import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
})


const TOKEN = mongoose.model("token", userSchema)
export default TOKEN