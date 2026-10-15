import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


export const genToken = (userId)=>{
    // Store only the user id in the JWT; the full user is fetched from MongoDB later.
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"10d"});
     return token;
}
