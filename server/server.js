import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from './lib/db.js';
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";


//create Express app and HTTP server

const app = express();
const server = http.createServer(app)

//Initialize socket.io server

export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online users

export const userSocketMap = {}; //{userId: socketId}

//Socket.io connection handler

io.on("connection", (Socket)=>{
    const userId = Socket.handshake.query.userId;
    console.log("User Connected", userId);
    if(userId) userSocketMap[userId] = Socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    Socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

//Middleeare setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

//Route setup
app.use("/api/status",(req,res)=>res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to MongoDB
await connectDB();

const PORT  = process.env.PORT || 5000

server.listen(PORT, ()=>console.log("Server is running on PORT : " + PORT))