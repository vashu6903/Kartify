import jwt from 'jsonwebtoken'
import {Customer} from '../models/customer.models.js'



export const isAuthenticated = async (req, res, next)=>{
  // Login stores the JWT in a cookie named "token"; protected routes read it here.
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace(/^Bearer\s+/i, "").trim();
  }

  if (!token){
    return res.status(401).json({
      message:"Unauthorised"
    })
  }

  try {
    // Decode the token and load the matching customer from MongoDB.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.userId)

    if (!customer){
      return res.status(401).json({
        message:"User Not Found"
      })
    }

    // Attach the customer to the request so controllers do not query it again.
    req.customerData = customer

    next();
  } catch (error) {
    return res.status(401).json({
      message:"Invalid or expired token"
    })
  }
}
