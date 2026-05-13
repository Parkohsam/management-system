import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//   Generate JWT Token 
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}


// REGISTER 
export const register = async (req, res) => {
    try {
        // Get data from req.body
        console.log("Body received:", req.body);
        const { name, email, password, role } = req.body;

        // Check all the field provide 

        if (!name || !email || !password) {
            return res.status(404).json({ message: "All this fields are required" });
        }
        // Check if mail already exists

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }

        // Hash password 

        const hashedPassword = await bcrypt.hash(password, 10);

        // create and save the new user

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "staff"
        })

        // generate token 

        const token = generateToken(user._id);

        res.status(201).json({
            massage: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
};



// Login 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // compare password with hashed version in DB

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // 5. Generate token
        const token = generateToken(user._id);

        // 6. Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}

export const getMe = async (req, res) => {
    try {
        // req.user is set by our auth middleware (we'll build that next)
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};