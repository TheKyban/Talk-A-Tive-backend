import Message from "../models/message.model.js";

class Messagecontroller {
	async createMessage(req, res) {
		try {
			const { chatId, content } = req.body;
			const userId = req.user.token;

			if (!chatId || !content || !userId) {
				return res.json({
					message: "Details are required",
					success: false,
				});
			}
			let newMessage = await Message.create({
				chatId,
				userId,
				content,
			});

			newMessage = await newMessage.populate("userId", "-password");

			res.json({
				message: "new message created",
				success: true,
				messages: newMessage,
			});
		} catch (error) {
			console.log(error);
			res.send("some db error");
		}
	}

	async fetchMessage(req, res) {
		try {
			const { chatId } = req.params;

			if (!chatId) {
				return res.json({
					success: false,
					message: "not provided chatId",
				});
			}

			const messages = await Message.find({ chatId }).populate("userId");

			res.json({
				messages: messages ? messages : [],
			});
		} catch (error) {
			res.send("some db error");
			console.log(error);
		}
	}
}

export default new Messagecontroller();
