import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import customerRoutes from './routes/customer.routes.js';
import productRoutes  from './routes/product.routes.js';
import wishListRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load database and JWT settings from Server/.env before the app starts.
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();
const app = express();

const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect Express to MongoDB through Mongoose models.
mongoose.connect(process.env.dbUrl).then(()=>console.log("DB Connected")).catch((error)=>console.error(error))

// Parse JSON bodies, cookies, and allow the Vite frontend to send auth cookies.
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));

// Mount each group of API routes under its base URL.
app.use('/customer', customerRoutes);
app.use("/products", productRoutes);
app.use('/wishlist', wishListRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)



// Start the API server that the React app calls through axios.
const port = Number(process.env.PORT) || 8001;
app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server started on port ${port}`);
})
