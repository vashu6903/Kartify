import mongoose from 'mongoose';

// Product shapes are defined here in Productmodels


// Products are the leather goods shown in the shop pages.
const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
        min:[1, "Must be greater than zero"],
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
        min:[0, "Minimum Zero"]
    },
}, {timestamps:true})

export const Product = mongoose.model("product", ProductSchema);
