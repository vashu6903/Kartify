import express from "express";
import {isAuthenticated} from '../middlewares/authMiddleware.js'
import { addToWishList, getWishList, removeFromWishList } from "../controllers/wishlist.controllers.js";


const wishListRoutes = express.Router()

// Wishlist routes are protected because each wishlist belongs to one customer.
wishListRoutes.get("", isAuthenticated, getWishList)
wishListRoutes.post("/:productId", isAuthenticated, addToWishList)
wishListRoutes.delete("/:productId", isAuthenticated, removeFromWishList)


export default wishListRoutes;
