import express from 'express';
import { ProtectRoute } from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get("/users", ProtectRoute, getUsersForSidebar);
messageRouter.get("/:id", ProtectRoute, getMessages);
messageRouter.put("/mark/:id", ProtectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", ProtectRoute, sendMessage);

export default messageRouter;