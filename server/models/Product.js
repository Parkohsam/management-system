import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            min: 0,           // Price cannot be negative
        },
        stock: {
            type: Number,
            required: true,
            min: 0,           // Stock cannot be negative
            default: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ["Electronics", "Furniture", "Health", "Apparel", "Other"],
        },
        sku: {
            type: String,
            required: true,
            unique: true,     // Each product has a unique code
            uppercase: true,  // Always saved as uppercase 
        },
        image: {
            type: String,
            default: "",      // Optional product image URL
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;