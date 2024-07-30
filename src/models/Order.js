import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            productType: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            orderPrice: {
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