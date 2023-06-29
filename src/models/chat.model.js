import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ]
})


const ChatModel = mongoose.model("chat", chatSchema)

export default ChatModel;