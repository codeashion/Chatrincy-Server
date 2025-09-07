import express from 'express';
import { checkAuth, login, signUp, updateProfile } from '../controllers/userController.js';
import { ProtectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", ProtectRoute, updateProfile);
userRouter.get("/check", ProtectRoute, checkAuth);

export default userRouter;