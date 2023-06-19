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

userSchema.index({ email: 1, sweepstakes_id: 1 }, { unique: true });

const TOKEN = mongoose.model("token", userSchema)
export default TOKEN