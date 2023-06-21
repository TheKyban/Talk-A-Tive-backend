import ChatModel from "../models/chat.model.js"
import USER from "../models/user.model.js"

class ChatControllers {
    async createChat(req, res) {

        try {
            //1st user
            const user1 = req.user.token
            //2nd user
            const { userId } = req.body


            if (!user1 || !userId) {
                return res.json({
                    create: false,
                    message: "all fields required"
                })
            }

            /**
             * Check userid is correct or not
             */

            try {

                const user = USER.findById(userId)
                if (!user) {
                    return res.json({
                        created: false,
                        message: "Invalid userId"
                    })
                }
            } catch (error) {
                return res.json({
                    created: false,
                    message: "Invalid userId"
                })
            }


            const createChat = await ChatModel.create({ users: [user1, userId] })

            res.json({
                created: true,
                data: createChat,
                message: "Chat created"
            })

        } catch (error) {
            res.json({
                message: "some error in db or in controller"
            })
        }
    }

    async findChats(req, res) {

        try {
            const userId = req.user.token
            const chats = await ChatModel.find({ users: { $all: [userId] } },)
                .populate("users", "-password")

            let allChats = []

            chats.map(chat => {
                const chatId = chat._id
                let user = chat.users.filter(user => {
                    return user._id != userId
                })

                allChats.push({
                    _id: user[0]._id,
                    name: user[0].name,
                    email: user[0].email,
                    picture: user[0].picture,
                    chatId: chatId
                })

            })



            res.json({
                data: allChats,
                success: true
            })
        } catch (error) {
            console.log(error)

            res.json({
                message: "db error"
            })
        }
    }
}

export default new ChatControllers()