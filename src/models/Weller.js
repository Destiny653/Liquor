import mongoose, { Schema } from "mongoose";

const wellerSchema = new Schema({
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
    productModel: {
        type: String,
        default: 'Weller'
    }
},{timestamps:true});

export default mongoose.models.Weller ||  mongoose.model("Weller", wellerSchema);