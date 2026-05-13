import mongoose from "mongoose";

// This is a sub-schema — it defines ONE item inside an order
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,  // References a Product document
        ref: "Product",                         // "ref" means link to the Product model
        required: true,
    },
    name: {
        type: String,
        required: true,   // We save the name here too in case product is deleted
    },
    price: {
        type: Number,
        required: true,   // Price at time of purchase (price can change later)
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

// Main order schema
const orderSchema = new mongoose.Schema(
    {
        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, default: "" },
        },
        items: [orderItemSchema],   // Array of order items (uses sub-schema above)

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        note: {
            type: String,
            default: "",    // Optional note on the order
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",    // Which staff/admin created this order
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;