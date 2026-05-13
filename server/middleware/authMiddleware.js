import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // Check if token exists in request headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, access denied" });
        }

        //  Extract token (format is "Bearer <token>")
        const token = authHeader.split(" ")[1];

        //  Verify the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  Find the user from the token's ID and attach to request
        req.user = await User.findById(decoded.id).select("-password");

        //  Move on to the actual route handler
        next();

    } catch (error) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
};

// Admin Only Middleware 
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();   // User is admin, allow through
    } else {
        res.status(403).json({ message: "Admin access required" });
    }
};