import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orders: [{
        products: [

            {
                productModel: {
                    type: String,
                    required: true
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                orderPrice: {
                    type: Number,
                    required: true,
                    default: function () {
                        return this.price * this.quantity;
                    }
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        }
    }]
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;