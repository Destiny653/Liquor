import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

const { default: Balton } = require("@/models/Balton");
const { default: Buffalo } = require("@/models/Buffalo");
const { default: Pappy } = require("@/models/Pappy");
const { default: Penelope } = require("@/models/Penelope");
const { default: Weller } = require("@/models/Weller");
const { default: Yamazaki } = require("@/models/Yamazaki");

const productModels = {
    Weller,
    Balton,
    Penelope,
    Yamazaki,
    Pappy,
    Buffalo
};

export const POST = async (req, res) => {
    await connectDB();
    const { email, cartItems } = await req.json();

    try {
        const user = await User.findById(email);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User mot found' }, { status: 404 });
        };

        let totalPrice = 0;
        const orderProducts = await Promise.all(cartItems.map(async (item) => {
            const productModel = productModels[item.productType];
            if (!productModel) {
                throw new Error(`Product type ${item.productType} not found`);
            };

            const product = await productModel.findById(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            };
            totalPrice += product.price * item.quantity;
            return {
                productId: item.productId,
                productType: item.productType,
                quantity: item.quantity,
                price: product.price,
                orderPrice: item.quantity * item.price
            };
        }));

        const order = new Order({
            user: email,
            products: orderProducts,
            totalPrice: totalPrice
        });
        await order.save();
        user.orders.push(order._id);
        await user.save();
        return NextResponse.json({ success: true, message: 'Order placed successfully', order }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = async(req, res)=>{
    await connectDB();
    const { email } = req.query;
    try {
        const orders = await Order.find({user: email}).populate('products.productId');
        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}