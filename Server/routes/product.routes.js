import express from 'express';
import { createProduct, getProducts, getProductById, filterProducts } from '../controllers/product.controllers.js';
const productRoutes = express.Router()

// GET /products optionally flows into filterProducts when query params exist.
productRoutes.get("", getProducts, filterProducts);
productRoutes.post("", createProduct);
productRoutes.get("/:id", getProductById);




export default productRoutes;
