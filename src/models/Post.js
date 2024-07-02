import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
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
    img: {
        type: String,
        required:true
    }
},{timestamps:true});

export default mongoose.models.Post ||  mongoose.model("Post", postSchema);