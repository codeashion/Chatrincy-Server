

// Middleware to Protect routes

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const ProtectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const decored = jwt.verify(token, process.env.JWR_SECRET);
        const user = await User.findById(decored.userId).select("-password");

        if (!user) return res.json({ success: false, message: "User Not Found" });

        req.user = user;

        next();

    } catch (error) {

        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}