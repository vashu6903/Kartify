import mongoose from "mongoose";

// One wishlist belongs to one customer and stores references to Product documents.
const WishListSchema = mongoose.Schema({
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],

    customerId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"customer",
        unique:true,
        required:true,
    }

}, {timestamps:true})

export const Wishlist = mongoose.model("wishlist", WishListSchema);
