import mongoose from 'mongoose'

const schema = mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamp: true })


const Message = mongoose.model("message", schema)

export default Message