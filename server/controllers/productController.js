import Product from "../models/Product.js";

// CREATE Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, sku } = req.body;

        if (!name || !description || !price || !stock || !category || !sku) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check SKU exists — return early if it does
        const existingSku = await Product.findOne({ sku });
        if (existingSku) {
            return res.status(400).json({ message: "SKU already exists" });
        }

        // Create happens here — outside the if block
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            sku,
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET ALL Products
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SINGLE Product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updated,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};