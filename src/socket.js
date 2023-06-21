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
	});
};

// //required
// const test = {
//     chatId: "64909ef0772f3898f3dfd099",
//     content: "fsfsafsa",
//     userId: {
//         email: "aditya@gmail.com",
//         name: "Aditya",
//         password: "$2b$08$iIHe79p1lJPc.3Z1Cb56MuzMlGXkqqx761GGbvm3LrX7oIjt4HGWW",
//         picture: "https://res.cloudinary.com/dm8kvhwq7/image/upload/v1686459258/uwwine73qcjoknbdeyy0.webp",
//         _id: "648e9480cf47428bbe9cfc52"
//     },
//     _id: "6491c63c8caabf5f0003e9ab"
// }

// const test2 = {
//     chatId: {
//         chatid: "64909ef0772f3898f3dfd099",
//         email: "user@example.com",
//         name: "Guest",
//         picture: "https://res.cloudinary.com/dm8kvhwq7/image/upload/v1686459258/uwwine73qcjoknbdeyy0.webp",
//         _id: "648dc5d9727c412f9776279b"
//     },
//     content: {
//         chatid: "64909ef0772f3898f3dfd099",
//         content: "fsfaf",
//         userId: "648e9480cf47428bbe9cfc52",
//         __v: 0,
//         _id: "6491c9979f9426b31fb71891"
//     }
// }
