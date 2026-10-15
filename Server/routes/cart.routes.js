import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cart.controllers.js";

const cartRoutes = express.Router();

// Cart routes are protected because each cart belongs to one logged-in customer.
cartRoutes.get("", isAuthenticated, getCart);
cartRoutes.post("/:productId", isAuthenticated, addToCart);
cartRoutes.patch("/:productId", isAuthenticated, updateCartQuantity);
cartRoutes.delete("/:productId", isAuthenticated, removeFromCart);

export default cartRoutes;
