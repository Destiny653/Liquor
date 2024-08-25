import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import { toObjectId } from "@/utils/hexId";

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
    console.log(user);


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
                console.log(product);
                break;
            case 'Balton':
                product = await Balton.findById(product_id)
                console.log(product);
                break;
            case 'Penelope':
                product = await Penelope.findById(product_id)
                console.log(product);
                break;
            case 'Yamazaki':
                product = await Yamazaki.findById(product_id)
                console.log(product);
                break;
            case 'Pappy':
                product = await Pappy.findById(product_id)
                console.log(product);
                break;
            case 'Buffalo':
                product = await Buffalo.findById(product_id)
                console.log(product);
                break;
            case 'Post':
                product = await Post.findById(product_id)
                console.log(product);
                break;
            default:
                return product ? { product, model: productModel } : null;
        }
        return product;

        console.log(product);
        
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
                    console.log(product);
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

        await newOrder.save();
    }

    createOrder(user._id, cartItems)


    // const { email, cartItems } = await req.json();
    // try {
    //     const user = await User.findById(email);
    //     if (!user) {
    //         return NextResponse.json({ success: false, message: 'User mot found' }, { status: 404 });
    //     };

    //     let totalPrice = 0;
    //     const ordercartItems = await Promise.all(cartItems.map(async (item) => {
    //         const productModel = productModels[item.productType];
    //         if (!productModel) {
    //             throw new Error(`Product type ${item.productType} not found`);
    //         };

    //         const product = await productModel.findById(toObjectId(item.product_id));
    //         if (!product) {
    //             throw new Error(`Product ${item.product_id} not found`);
    //         };
    //         totalPrice += product.price * item.quantity;
    //         return {
    //             product_id: toObjectId(item.product_id),
    //             productType: item.productType,
    //             quantity: item.quantity,
    //             price: product.price,
    //             orderPrice: item.quantity * item.price
    //         };
    //     }));

    //     const order = new Order({
    //         user: email,
    //         cartItems: ordercartItems,
    //         totalPrice: totalPrice
    //     });
    //     await order.save();
    //     user.orders.push(toObjectId(order._id));
    //     await user.save();
    //     return NextResponse.json({ success: true, message: 'Order placed successfully', order }, { status: 200 });
    // } catch (error) {
    //     console.log(error);
    //     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    // }
}


export const GET = async (req, res) => {
    //  get and populate order with user and product
    await connectDB()
    try{
        const order = await Order.find().populate({path:'user', populate:{path: 'order'}}).populate({path:'products.productId'}).exec();
        console.log(order);
        
        if(!order){
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, order }, { status: 200 });
    }catch(err){
        console.error(err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 }); 
    }
}