import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
    createPaymentOrder,
    getOrderById,
    getOrders,
    updateOrderStatus,
    verifyPayment,
} from "../controllers/order.controllers.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isAuthenticated, createPaymentOrder);
orderRoutes.post("/", isAuthenticated, createPaymentOrder);
orderRoutes.post("/verify-payment", isAuthenticated, verifyPayment);
orderRoutes.get("", isAuthenticated, getOrders);
orderRoutes.get("/:id", isAuthenticated, getOrderById);
orderRoutes.patch("/:id/status", isAuthenticated, updateOrderStatus);

export default orderRoutes;
