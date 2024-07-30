import mongoose, { Schema } from "mongoose";

const pappySchema = new Schema({
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
    },
    productType: {
        type: String,
        default: 'pappy'
    }
},{timestamps:true});

export default mongoose.models.Pappy ||  mongoose.model("Pappy", pappySchema);