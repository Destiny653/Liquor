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
        console.log(email);
        console.log(cartItems);

        const user = await User.findOne({ email });
        console.log(JSON.stringify(user));


        if (!user) {
            return NextResponse.json({ success: false, message: 'User mot found please sign up' }, { status: 404 });
        };

        async function verifyProductId(product_id, productModel) {
            console.log(productModel);
            console.log(product_id);


            let product = null;
            switch (productModel) {
                case 'Weller':
                    product = await Weller.findById(product_id);
                    console.log(JSON.stringify(product));
                    break;
                case 'Balton':
                    product = await Balton.findById(product_id)
                    console.log(JSON.stringify(product));
                    break;
                case 'Penelope':
                    product = await Penelope.findById(product_id)
                    console.log(JSON.stringify(product));
                    break;
                case 'Yamazaki':
                    product = await Yamazaki.findById(product_id)
                    console.log(JSON.stringify(product));
                    break;
                case 'Pappy':
                    product = await Pappy.findById(product_id)
                    console.log(JSON.stringify(product));
                    break;
                case 'Buffalo':
                    product = await Buffalo.findById(product_id)
                    console.log(JSON.stringify(product));
                    break;
                case 'Post':
                    product = await Post.findById(product_id)
                    console.log(JSON.stringify(product));
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
                console.log(item);

                let product;

                switch (item.productModel) {
                    case 'Post':
                        product = await Post.findById(item.productId).exec();
                        console.log(JSON.stringify(product));
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
            console.log(totalPrice);
            return totalPrice;
        }

        async function createOrder(customerId, cartItems) {
            const verify = await verifyAndPopulateOrderItems(cartItems);
            console.log(verify);
            if (verify.error) {
                return NextResponse.json({ success: false, message: 'Failed to verify and populate order items.', data: verify.error }, { status: 404 });
            }

            const verifiedItems = verify.data;
            let totalPrice = await calculateTotalPrice(verifiedItems);
            totalPrice = totalPrice.toFixed(2)
            console.log(totalPrice);

            const newOrder = new Order({
                user: user._doc._id.toHexString(),
                orders: [{
                    products: verifiedItems,
                    totalPrice: totalPrice,
                }],
            })
            console.log("new order id here:" + newOrder._id);

            const userId = user._doc._id.toHexString();
            console.log(userId);

            const orderIds = verifiedItems.map(item => item.productId)
            console.log(orderIds);
            const existingOrder = await Order.findOne({ user: userId })
            console.log("existingOrder:" + JSON.stringify(existingOrder));

            if (!existingOrder) {
                await newOrder.save()
                console.log('Order created successfully');
            } else {
                await Order.updateOne({ user: userId }, { $push: { orders: { products: verifiedItems, totalPrice } } })
                console.log('Order updated successfully');
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
        console.error(error); 
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export const GET = async (req, res) => {
    //  get and populate order with user and product
    await connectDB()
    try {
        const order = await Order.find().populate({ path: 'user', populate: { path: 'orders' } }).populate({ path: 'products.productId' }).exec();
        console.log(order);

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}