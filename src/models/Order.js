import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productModel: {
                type: String,
                required: true
            },
            productId: {
                type: Schema.Types.ObjectId,
                refPath: "products.productModel",
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            } 
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
},
 {
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;