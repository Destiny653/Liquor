import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: false,
        default: 'user'
    }
},
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)