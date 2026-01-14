import mongoose, { Schema } from "mongoose";

const productModelSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.models.ProductModel || mongoose.model("ProductModel", productModelSchema);
