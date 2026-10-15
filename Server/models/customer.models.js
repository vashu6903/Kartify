import mongoose from 'mongoose'

// Customer accounts are used for login and wishlist ownership.
const CustomerSchema = mongoose.Schema({
    fullName:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
    },
    contactNo:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    // what a cart looks like in mongodb
    cart:{
        type:[{
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            quantity:{
                type: Number,
                default: 1,
                min: 1,
            },
        }],
        default: [],
    },

}, {timestamps:true});


export const Customer = mongoose.model('customer', CustomerSchema);
