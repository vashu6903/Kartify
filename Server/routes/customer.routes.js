import express from 'express';


import {isAuthenticated} from '../middlewares/authMiddleware.js';
import {registerCustomer, loginUser, getUser, logOutUser} from '../controllers/customer.controllers.js';


const customerRoutes = express.Router();

// Account routes: register/login/logout plus a protected "current user" check.
customerRoutes.post('/register', registerCustomer);
customerRoutes.get('/me', isAuthenticated, getUser);
customerRoutes.post('/login', loginUser);
customerRoutes.get('/logout', logOutUser);

export default customerRoutes;
