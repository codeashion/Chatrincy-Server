import User from "../models/userModel.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Sign Up New User
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {

        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "Account Already Exits" });
        }

        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hasedPassword,
            bio
        });

        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Controller to Login User

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCurrenct = await bcrypt.compare(password, userData.password);

        if (!isPasswordCurrenct) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.json({ success: true, userData, token, message: "Login Successful" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Controller to check if user is authendicated

export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}


// Controller to update user profile details

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;

        let updateUser;

        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }

        res.json({ success: true, user: updateUser });

    } catch (error) {
        console.log(message.error);
        res.json({ success: false, message: message.error });
    }
}