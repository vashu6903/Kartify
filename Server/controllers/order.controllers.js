import crypto from "crypto";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getRazorpayClient } from "../config/razorpay.js";
import { Customer } from "../models/customer.models.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function ensureEnvLoaded() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        dotenv.config({ path: path.join(__dirname, "../.env") });
    }
}

function validateShippingAddress(shippingAddress = {}) {
    const requiredFields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];

    for (const field of requiredFields) {
        if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
            return `${field} is required`;
        }
    }

    if (!/^[0-9]{10}$/.test(String(shippingAddress.phone).trim())) {
        return "Phone must contain 10 digits";
    }

    if (!/^[0-9]{6}$/.test(String(shippingAddress.pincode).trim())) {
        return "Pincode must contain 6 digits";
    }

    return null;
}

function sanitizeShippingAddress(shippingAddress) {
    return {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
    };
}

async function buildOrderFromCart(customer) {
    if (!customer || !customer.cart || customer.cart.length === 0) {
        return {
            errorStatus: 400,
            errorMessage: "Cart is empty",
        };
    }

    const items = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
        const product = await Product.findById(cartItem.product);

        if (!product) {
            return {
                errorStatus: 400,
                errorMessage: "A product in your cart no longer exists",
            };
        }

        if (cartItem.quantity > product.stock) {
            return {
                errorStatus: 400,
                errorMessage: `Insufficient stock for ${product.name}`,
            };
        }

        items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: cartItem.quantity,
            image: product.image,
        });

        totalAmount += Number(product.price) * cartItem.quantity;
    }

    return { items, totalAmount };
}

export const createPaymentOrder = async (req, res) => {
    ensureEnvLoaded();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
            message: "Razorpay keys are missing on the backend. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Server/.env",
        });
    }

    const customer = await Customer.findById(req.customerData._id).select("cart");

    if (!customer || !customer.cart || customer.cart.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
        });
    }

    const addressError = validateShippingAddress(req.body.shippingAddress);

    if (addressError) {
        return res.status(400).json({
            message: addressError,
        });
    }

    const orderData = await buildOrderFromCart(customer);

    if (orderData.errorMessage) {
        return res.status(orderData.errorStatus).json({
            message: orderData.errorMessage,
        });
    }

    const shopKartOrder = await Order.create({
        user: req.customerData._id,
        items: orderData.items,
        shippingAddress: sanitizeShippingAddress(req.body.shippingAddress),
        totalAmount: orderData.totalAmount,
        paymentStatus: "PENDING",
        status: "PENDING_PAYMENT",
    });

    try {
        const razorpay = getRazorpayClient();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(orderData.totalAmount * 100),
            currency: "INR",
            receipt: shopKartOrder._id.toString(),
        });

        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();

        return res.status(201).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        await Order.findByIdAndDelete(shopKartOrder._id);
        return res.status(500).json({
            message: error.message || "Failed to create Razorpay payment order",
        });
    }
}

export const verifyPayment = async (req, res) => {
    const { shopKartOrderId } = req.body;
    const razorpay_order_id = req.body.razorpay_order_id || req.body.razorpayOrderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.razorpaySignature;

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
        return res.status(400).json({
            message: "Invalid order ID",
        });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            message: "Missing Razorpay payment details",
        });
    }

    const order = await Order.findById(shopKartOrderId);

    if (!order) {
        return res.status(404).json({
            message: "Order not found",
        });
    }

    if (!order.user.equals(req.customerData._id)) {
        return res.status(403).json({
            message: "Forbidden: You are not authorized to access this order",
        });
    }

    if (order.paymentStatus === "PAID" && order.status === "PLACED") {
        return res.status(200).json({
            success: true,
            message: "Order already verified and placed",
            order,
            cart: [],
        });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({
            message: "Razorpay order mismatch",
        });
    }

    ensureEnvLoaded();

    if (!process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
            message: "RAZORPAY_KEY_SECRET is missing on the backend",
        });
    }

    const body = `${order.razorpayOrderId}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        order.paymentStatus = "FAILED";
        await order.save();
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    const customer = await Customer.findById(req.customerData._id);
    if (customer) {
        customer.cart = [];
        await customer.save();
    }

    return res.status(200).json({
        success: true,
        message: "Payment verified and order placed",
        order,
        cart: [],
    });
}

export const getOrders = async (req, res) => {
    const orders = await Order.find({user: req.customerData._id}).sort({createdAt: -1});

    return res.status(200).json({
        success: true,
        orders,
    });
}

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid order ID",
        });
    }

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found",
        });
    }

    if (!order.user.equals(req.customerData._id)) {
        return res.status(403).json({
            message: "Forbidden: You are not authorized to view this order",
        });
    }

    return res.status(200).json({
        success: true,
        order,
    });
}

// Bonus Challenge (+10 Marks): Update order progression status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid order ID",
        });
    }

    const order = await Order.findById(id);

    if (!order) {
        return res.status(404).json({
            message: "Order not found",
        });
    }

    if (!order.user.equals(req.customerData._id)) {
        return res.status(403).json({
            message: "Forbidden: You are not authorized to update this order",
        });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
    });
}
