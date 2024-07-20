import mongoose, { Schema } from "mongoose";

const buffaloSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        default: 0,
    },
    img: {
        type: String,
        required:true
    }
},{timestamps:true});

export default mongoose.models.Buffalo ||  mongoose.model("Buffalo", buffaloSchema);