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
    const { email, cartItems } = await req.json();
    console.log(email);
    console.log(cartItems);

    const user = await User.findOne({ email });
    console.log(JSON.stringify(user._id));


    if (!user) {
        return NextResponse.json({ success: false, message: 'User mot found' }, { status: 404 });
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
    async function verifyAndPopulateOrderItems(cartItems) {
        const verifiedCartItems = [];
        for (const { product_id, productModel, quantity } of cartItems) {
            const verificationResult = await verifyProductId(product_id, productModel);
            console.log(verificationResult);
            console.log(verificationResult._doc._id.toHexString());
            console.log(product_id, productModel);


            if (verificationResult) {
                verifiedCartItems.push({
                    productId: verificationResult._doc._id.toHexString(),
                    title: verificationResult._doc.title,
                    orderPrice: verificationResult._doc.price * quantity,
                    price: verificationResult._doc.price,
                    productModel: productModel,
                    quantity: quantity
                });
            } else {
                throw new Error(`Product with ID ${product_id} not found in ${productModel} collection.`)
            }
        }

        return verifiedCartItems;
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
        const verifiedItems = await verifyAndPopulateOrderItems(cartItems);
        console.log(verifiedItems);
        const totalPrice = await calculateTotalPrice(verifiedItems);
        console.log(totalPrice);

        const newOrder = new Order({
            user: user._doc._id.toHexString(),
            // email: user._doc.email,
            products: verifiedItems,
            totalPrice: totalPrice,
            orderDate: new Date(),
            status: 'pending'
        })
        console.log("new order id here:" + newOrder._id);

        const userId = user._doc._id.toHexString();
        console.log(userId);

        const orderIds = verifiedItems.map(item => item.productId)
        console.log(orderIds);


        const userIdInOrder = await Order.findOne({ user: userId })
        console.log("userIdInOrder:" + userIdInOrder);
        const returnItems = await Order.findOne({ user: userId })
        console.log("returnItems:" + JSON.stringify(returnItems));

        try {
            const userId = user._doc._id.toHexString();
            // extracting order ids
            const orderIds = verifiedItems.map(item => item.productId)
            const verifiedOrders = await Order.find({ user: userId, 'products.productId': { $all: orderIds } })
            const qtyV = JSON.stringify(verifiedOrders)
            const verifiedOrders2 = await Order.find({ user: userId, 'products.productId': { $in: orderIds } })
            const qtyV2 = JSON.stringify(verifiedOrders2)
            console.log("verifiedOrders2:" +  qtyV);
            if (!userIdInOrder) {
                await newOrder.save();
            } else if (verifiedOrders) {
                await Order.updateOne({ user: userId }, { $inc: { "products.$[product].quantity": qtyV } }, { arrayFilters: [{ "product.productId": { $in: orderIds } }] })
            } else if (verifiedOrders2) {
                await Order.updateOne({ user: userId }, { $inc: { "products.$[product].quantity": qtyV2 } }, { arrayFilters: [{ "product.productId": { $in: orderIds } }] })
            }
            // filter verifiedItem.productId !== returnId
            const newItems = verifiedItems.filter(item => !userIdInOrder.products.some(orderItem => orderItem.productId.equals(item.productId)))
            console.log("These items are not in cart:" + JSON.stringify(newItems));
            // This will add the items that are not found in the users order after the check of newItems
            await Order.updateOne({ user: userId }, { $push: { products: { $each: newItems } } })
            console.log('Order is added')

            const OrderPro = await Order.findOne({ user: userId })
            const qtys = OrderPro.products.map(item => item.quantity)
            const prs = OrderPro.products.map(item => item.price)
            console.log("qtys:" + qtys);
            console.log("prs:" + prs);
            // convert qtys and prs to number and calculate total price
            let totalPrice2 = qtys.reduce((acc, curr, idx) => acc + curr * prs[idx], 70)
            let tPriceUpdate = totalPrice2.toFixed(2)
            console.log("totalPrice2:" + tPriceUpdate);
            await Order.updateOne({ user: userId }, { $set: { totalPrice: tPriceUpdate } })
            //  updating user orders
            const verifiedOrdersInUser = await User.find({ _id: userId, 'order.productId': { $all: orderIds } })
            const verifiedOrdersInUser2 = await User.find({ _id: userId, 'order.productId': { $in: orderIds } })
            if (verifiedOrdersInUser) {
                await User.findByIdAndUpdate(userId, { $set: { orders: verifiedItems } })
            } else if (verifiedOrdersInUser2) {
                // const returnItems = await Order.findOne({ user: userId })
                // const newItems = verifiedItems.find(item => item.productId !== returnItems.productId)
                const newItems = verifiedItems.filter(item => !userIdInOrder.products.some(orderItem => orderItem.productId.equals(item.productId)))

                await User.findByIdAndUpdate(userId, { $push: { orders: newItems } })
            } else {
                await User.findByIdAndUpdate(userId, { $push: { orders: verifiedItems } })
            }

            console.log('Order created successfully');
            return res.status(200).json({ success: true, message: 'Order created successfully' });
        } catch (error) {
            console.error(error);
            return res.status(405).json({ success: false, message: 'Error creating order' });
        }


    }
    createOrder(user._id, cartItems)

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
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}