import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "soket.io";
import { log } from "console";

// Create Express app and HTTP Server
const app = express();
const server = http.createServer(app); // this supports socket.io

// Initiallize socket.io
export const io = new Server(server, {
    cors: { origin: "*" }
})

// Store Online User

export const userSocketMap = {}; // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("User Connected : ", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());


// Test route
app.use("/api/status", (req, res) => res.send("Server Is Live"));

// Route Setup
app.use("api/auth", userRouter);
app.use("api/messages", messageRouter);


//Connect to MongoDB
await connectDB();


const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/api/status ✨`);
});
