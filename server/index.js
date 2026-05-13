// Import our packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";  
import orderRoutes from "./routes/orderRoutes.js"; 

//   Load environment variables from .env file
dotenv.config();

//  Create the Express app
const app = express();

//  Middlewares — these run on EVERY request
app.use(cors());                    // Allow frontend to connect
app.use(express.json());            // Lets us read JSON data from requests

//  Test route — just to confirm server works

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`); // test
//   next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);  
app.use("/api/orders", orderRoutes);   

app.get("/", (req, res) => {
    res.json({ message: "Stax Store API is running!!!!" });
});

//  Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(" MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });