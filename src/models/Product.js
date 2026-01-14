import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
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
        default: 0,
    },
    img: {
        type: String,
        required: true
    },
    productModel: {
        type: String,
        required: true,
        index: true
    },
    // Optional fields from Gift or other specific types
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

export default mongoose.models.Product || mongoose.model("Product", productSchema);
