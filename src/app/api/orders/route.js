import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

import Product from "@/models/Product";



export const POST = async (req, res) => {
    await connectDB();
    try {
        const { email, cartItems } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User mot found please sign up' }, { status: 404 });
        };

        async function verifyProductId(product_id) {
            return await Product.findById(product_id);
        }

        async function verifyAndPopulateOrderItems(cartItems, subtotal) {
            const verifiedCartItems = [];
            let dataError = null
            for (const { product_id, productModel, quantity } of cartItems) {
                const verificationResult = await verifyProductId(product_id);

                if (verificationResult) {
                    verifiedCartItems.push({
                        productId: verificationResult._doc._id.toHexString(),
                        title: verificationResult._doc.title,
                        orderPrice: verificationResult._doc.price * quantity,
                        price: verificationResult._doc.price,
                        productModel: productModel,
                        quantity: quantity,
                        totalPrice: subtotal
                    });
                } else {
                    dataError = {
                        id: product_id,
                        model: productModel
                    }
                    break;
                }
            }

            return {
                error: dataError,
                data: verifiedCartItems,
            }
        }
        async function calculateTotalPrice(verifiedItems) {
            let totalPrice = 0;
            for (const item of verifiedItems) {
                let product;

                product = await Product.findById(item.productId).exec();

                // Check if the product exists in the database and calculate the total price for this item.
                if (product) {
                    totalPrice += product.price * item.quantity;
                }
            }
            return totalPrice;
        }

        async function createOrder(customerId, cartItems) {
            const verify = await verifyAndPopulateOrderItems(cartItems);
            if (verify.error) {
                return NextResponse.json({ success: false, message: 'Failed to verify and populate order items.', data: verify.error }, { status: 404 });
            }

            const verifiedItems = verify.data;
            let totalPrice = await calculateTotalPrice(verifiedItems);
            totalPrice = totalPrice.toFixed(2)

            const newOrder = new Order({
                user: user._doc._id.toHexString(),
                orders: [{
                    products: verifiedItems,
                    totalPrice: totalPrice,
                }],
            })
            const userId = user._doc._id.toHexString();

            const orderIds = verifiedItems.map(item => item.productId)
            const existingOrder = await Order.findOne({ user: userId })

            if (!existingOrder) {
                await newOrder.save()
            } else {
                await Order.updateOne({ user: userId }, { $push: { orders: { products: verifiedItems, totalPrice } } })
            }
            //  updating user orders
            const verifiedOrdersInUser = await User.find({ _id: userId, 'order.productId': { $all: orderIds } })
            const verifiedOrdersInUser2 = await User.find({ _id: userId, 'order.productId': { $in: orderIds } })
            if (verifiedOrdersInUser) {
                await User.findByIdAndUpdate(userId, { $set: { orders: verifiedItems } })
            } else if (verifiedOrdersInUser2) {
                // const existingOrder = await Order.findOne({ user: userId })
                // const newItems = verifiedItems.find(item => item.productId !== existingOrder.productId)
                const newItems = verifiedItems.filter(item => !existingOrder.products.some(orderItem => orderItem.productId.equals(item.productId)))
                await User.findByIdAndUpdate(userId, { $push: { orders: newItems } })
            } else {
                await User.findByIdAndUpdate(userId, { $push: { orders: verifiedItems } })
            }
            return NextResponse.json({ success: true, message: 'Order created successfully' }, { status: 200 });
        }

        return createOrder(user._id, cartItems);
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}


export const GET = async (req, res) => {
    //  get and populate order with user and product
    await connectDB()
    try {
        const order = await Order.find().populate({ path: 'user', populate: { path: 'orders' } }).populate({ path: 'orders.products.productId' }).exec();

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}