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
const { default: Post } = require("@/models/Post")


export const POST = async (req, res) => {
    await connectDB();
    try {
        const { email, cartItems } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User mot found please sign up' }, { status: 404 });
        };

        async function verifyProductId(product_id, productModel) {
            let product = null;
            switch (productModel) {
                case 'Weller':
                    product = await Weller.findById(product_id);
                    break;
                case 'Balton':
                    product = await Balton.findById(product_id)
                    break;
                case 'Penelope':
                    product = await Penelope.findById(product_id)
                    break;
                case 'Yamazaki':
                    product = await Yamazaki.findById(product_id)
                    break;
                case 'Pappy':
                    product = await Pappy.findById(product_id)
                    break;
                case 'Buffalo':
                    product = await Buffalo.findById(product_id)
                    break;
                case 'Post':
                    product = await Post.findById(product_id)
                    break;
                default:
                    return product ? { product, model: productModel } : null;
            }
            return product;
        }
        async function verifyAndPopulateOrderItems(cartItems, subtotal) {
            const verifiedCartItems = [];
            let dataError = null
            for (const { product_id, productModel, quantity } of cartItems) {
                const verificationResult = await verifyProductId(product_id, productModel);
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

                switch (item.productModel) {
                    case 'Post':
                        product = await Post.findById(item.productId).exec();
                        break;
                    case 'Weller':
                        product = await Weller.findById(item.productId).exec();
                        break;
                    case 'Balton':
                        product = await Balton.findById(item.productId).exec();
                        break;
                    case 'Penelope':
                        product = await Penelope.findById(item.productId).exec();
                        break;
                    case 'Yamazaki':
                        product = await Yamazaki.findById(item.productId).exec();
                        break;
                    case 'Pappy':
                        product = await Pappy.findById(item.productId).exec();
                        break;
                    case 'Buffalo':
                        product = await Buffalo.findById(item.productId).exec();
                        break;
                    default:
                        throw new Error(`Product type ${item.productModel} not found.`);
                }
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