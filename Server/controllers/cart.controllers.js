import mongoose from "mongoose";
import { Customer } from "../models/customer.models.js";
import { Product } from "../models/product.models.js";

async function getCustomerCart(customerId) {
    const customer = await Customer.findById(customerId)
        .select("cart")
        .populate("cart.product");

    return customer?.cart || [];
}

export const getCart = async (req, res) => {
    const cart = await getCustomerCart(req.customerData._id);

    return res.status(200).json({
        success: true,
        cart,
    });
}

export const addToCart = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    const customer = await Customer.findById(req.customerData._id);
    customer.cart ||= [];
    const cartItem = customer.cart.find((item) => item.product.equals(productId));
    const nextQuantity = cartItem ? cartItem.quantity + 1 : 1;

    if (nextQuantity > product.stock) {
        return res.status(400).json({
            message: "Requested quantity exceeds available stock",
        });
    }

    if (cartItem) {
        cartItem.quantity = nextQuantity;
    } else {
        customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    const cart = await getCustomerCart(customer._id);

    return res.status(200).json({
        success: true,
        message: "Cart updated",
        cart,
    });
}

export const updateCartQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
        return res.status(400).json({
            message: "Quantity must be a number",
        });
    }

    if (quantity < 1) {
        return res.status(400).json({
            message: "Quantity must be at least 1",
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    if (quantity > product.stock) {
        return res.status(400).json({
            message: "Requested quantity exceeds available stock",
        });
    }

    const customer = await Customer.findById(req.customerData._id);
    customer.cart ||= [];
    const cartItem = customer.cart.find((item) => item.product.equals(productId));

    if (!cartItem) {
        return res.status(404).json({
            message: "Product not in cart",
        });
    }

    cartItem.quantity = quantity;
    await customer.save();
    const cart = await getCustomerCart(customer._id);

    return res.status(200).json({
        success: true,
        message: "Cart quantity updated",
        cart,
    });
}

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    const customer = await Customer.findById(req.customerData._id);
    customer.cart ||= [];
    const cartItem = customer.cart.find((item) => item.product.equals(productId));

    if (!cartItem) {
        return res.status(404).json({
            message: "Product not in cart",
        });
    }

    customer.cart.pull(cartItem._id);
    await customer.save();
    const cart = await getCustomerCart(customer._id);

    return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        cart,
    });
}
