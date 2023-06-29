import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoute from "./routes/messgae.routes.js";
import { Server } from "socket.io";
import { socket_io_listen } from "./socket.js";

/**
 * express app
 */

const app = express();

/**
 * http server
 */

const server = http.createServer(app);

export const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

/**
 * app uses
 */
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://127.0.0.1:5501",
			"https://talk-a-tive-seven.vercel.app",
		],
		credentials: true,
		methods: ["POST", "GET", "PUT"],
	}),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/chat", chatRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoute);

/**
 * root route for checking
 */

app.get("/", (req, res) => {
	res.send("server working");
});

/**
 * Socket io connection
 */

// io.on("connection",(socket) => {
//     console.log(socket.id)
// })

socket_io_listen();
export default server;
