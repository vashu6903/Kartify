import { Product } from "../models/product.models.js";


export const createProduct = async (req, res) =>{
    const {name, description, price, category, image, stock} = req.body;

    // Products need all fields before they can be shown in the catalog.
    if (!name || !description || !price || !category || !image || stock === undefined){
        return res.status(400).json({
            message:"Missing Required Fields"
        })
    }

    if(Number.isNaN(Number(price)) || Number(price)<=0){
        return res.status(400).json({
            message:"Invalid Price"
        })
    }

    if(Number.isNaN(Number(stock)) || Number(stock)<0){
        return res.status(400).json({
            message:"Invalid Stock"
        })
    }

    const product = await Product.create({name, description, price, category, image, stock})


    return res.status(201).json({
        message:`Product successfully created: ${product._id}`
    })
}

export const getProducts = async (req, res, next)=>{
    const {search, category} = req.query;

    // If filters are present, pass control to filterProducts in the route chain.
    if(search || category){
        next();
    } else {

        // No filters means return the full product list.
        const products = await Product.find({}).lean();

        const response = {
            success:true,
            count: products.length,
            products:products,
        }




        return res.status(200).json(response);
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.id;

    // Product details pages request a single Mongo document by id.
    if(!id){
        return res.status(401).json({
            message:"Invalid Product Id"
        })
    }

    const product = await Product.findById(id);

    if(!product){
        return res.status(404).json({
            message:"Product not found"
        });
    }

    return res.status(200).json({
        message:"Product was found",
        productData:product
    })

}

export const filterProducts = async (req, res) =>{
    const {search = "", category = ""} = req.query;

    // Build a Mongo query object only from filters the user selected.
    const filters = {};
    if(search){
        filters.name = {$regex: search, $options: "i"};
    }
    if(category){
        filters.category = category;
    }

    const filteredProducts = await Product.find(filters).lean();

    return res.status(200).json({
        success:true,
        count:filteredProducts.length,
        products:filteredProducts
    })
}
