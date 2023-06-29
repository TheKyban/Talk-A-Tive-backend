import ChatModel from "../models/chat.model.js";
import USER from "../models/user.model.js";

class ChatControllers {
	async createChat(req, res) {
		try {
			//1st user
			const user1 = req.user.token;
			//2nd user
			const { userId } = req.body;

			if (!user1 || !userId) {
				return res.json({
					create: false,
					message: "all fields required",
				});
			}

			/**
			 * Check userid is correct or not
			 */

			try {
				const user = USER.findById(userId);
				if (!user) {
					return res.json({
						created: false,
						message: "Invalid userId",
					});
				}
			} catch (error) {
				return res.json({
					created: false,
					message: "Invalid userId",
				});
			}

			const createChat = await ChatModel.create({
				users: [user1, userId],
			});

			// console.log(createChat);
			//sending
			/**
			 * {
			 *  isGroup: false,
			 *  users: [
			 *    new ObjectId("649aa3395a6e56d7b1a097d7"),
			 *  new ObjectId("649aa36b5a6e56d7b1a097dd")
			 * ],
			 * _id: new ObjectId("649aaad35f7b3f051e8159bf"),
			 * __v: 0
			 * }
			 */

			const chatuser = await USER.findById(
				createChat.users.filter((id) => {
					return id != user1;
				}),
			).select("-password");

			res.json({
				created: true,
				data: {
					_id: chatuser._id,
					name: chatuser.name,
					email: chatuser.email,
					picture: chatuser.picture,
					chatId: createChat._id,
				},
			});
		} catch (error) {
			console.log(error);
			res.json({
				message: "some error in db or in controller",
			});
		}
	}

	async findChats(req, res) {
		try {
			/**
			 * getting userid from cookie
			 */

			const userId = req.user.token;
			/**
			 * finding chats
			 */
			const chats = await ChatModel.find({
				users: { $all: [userId] },
			}).populate("users", "-password");

			let allChats = [];

			/**
			 * append friend id only and chatid in allchats array
			 */
			chats.map((chat) => {
				const chatId = chat._id; // chatId
				let user = chat.users.filter((user) => {
					/**
					 * returns friend Id only
					 */
					return user._id != userId;
				});

				/**
				 * append to array in object formate
				 */
				allChats.push({
					_id: user[0]._id,
					name: user[0].name,
					email: user[0].email,
					picture: user[0].picture,
					chatId: chatId,
				});
			});

			res.json({
				data: allChats,
				success: true,
			});
		} catch (error) {
			console.log(error);

			res.json({
				message: "db error",
			});
		}
	}
}

export default new ChatControllers();
