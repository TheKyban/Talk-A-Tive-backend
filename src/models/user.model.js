import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: false,
        default: "https://res.cloudinary.com/dm8kvhwq7/image/upload/v1686459258/uwwine73qcjoknbdeyy0.webp"
    },
    password: {
        type: String,
        required: true
    },
})

const USER = mongoose.model("user", userSchema)
export default USER