import mongoose from "mongoose";

//  Define the schema (blueprint)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,       
            required: true,     
            trim: true,         
        },
        email: {
            type: String,
            required: true,
            unique: true,       
            lowercase: true,    
        },
        password: {
            type: String,
            required: true,
            minlength: 6,       
        },
        role: {
            type: String,
            enum: ["admin", "staff"],   
            default: "staff",           
        },
    },
    {
        timestamps: true,   // Auto adds createdAt and updatedAt fields
    }
);

//  Create the model from the schema
const User = mongoose.model("User", userSchema);

//  Export it so other files can use it
export default User;