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
        required: false,
    },
    provider: {
        type: String,
        required: true,
        default: 'credentials'
    },
    orders: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Order",
                required: true
            }
        }],
    role: {
        type: String,
        required: false,
        default: 'user'
    }
},
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)