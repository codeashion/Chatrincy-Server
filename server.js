import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

// Create Express app and HTTP Server
const app = express();
const server = http.createServer(app); // this supports socket.io

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Test route
app.use("/api/status", (req, res) => res.send("Server Is Live"));

// Route Setup
app.use("api/auth", userRouter);

//Connect to MongoDB
await connectDB();


const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/api/status ✨`);
});
