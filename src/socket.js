import { io } from "./app.js";

export const socket_io_listen = () => {
	io.on("connection", (socket) => {
		socket.on("join-chat", async (data) => {
			try {
				if (data.chatId) {
					socket.join(data.chatId);
				}
			} catch (error) {
				console.log(error);
			}
		});

		socket.on("update", (data) => {
			try {
				if (data.chatId) {
					socket.broadcast.to(data.chatId).emit("newMessage", data);
				}
			} catch (error) {
				console.log(error);
			}
		});

		socket.on("typing", (data) => {
			socket.broadcast.to(data.chatId).emit("isTyping", true);
		});
		socket.on("notTyping", (data) => {
			socket.broadcast.to(data.chatId).emit("isTyping", false);
		});
	});
};
