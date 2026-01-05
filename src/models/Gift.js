import mongoose, { Schema } from "mongoose";

const giftSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        default: 5,
    },
    img: {
        type: String,
        required: true
    },
    productModel: {
        type: String,
        default: 'Gift'
    },
    bundleItems: {
        type: [String],
        default: []
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    occasion: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

export default mongoose.models.Gift || mongoose.model("Gift", giftSchema);
