import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import Product from "@/models/Product";



export const POST = async (req, res) => {
    await connectDB();
    try {
        const { email, cartItems, billingDetails, paymentMethod } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User mot found please sign up' }, { status: 404 });
        };

        // Update user phone number if provided
        if (billingDetails?.phone) {
            await User.findOneAndUpdate({ email }, { phoneNumber: billingDetails.phone });
        }

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
                    paymentMethod: paymentMethod
                }],
            })
            const userId = user._doc._id.toHexString();

            const orderIds = verifiedItems.map(item => item.productId)
            const existingOrder = await Order.findOne({ user: userId })

            if (!existingOrder) {
                await newOrder.save()
            } else {
                await Order.updateOne({ user: userId }, { $push: { orders: { products: verifiedItems, totalPrice, paymentMethod } } })
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

            // Send email notification
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.OWNER_EMAIL || 'admin@liquorluxx.com', // Replace with actual owner email or env var
                    subject: `New Order - ${paymentMethod} - ${billingDetails.firstname} ${billingDetails.lastname}`,
                    html: `
                        <h2>New Order Received</h2>
                        <p><strong>Customer:</strong> ${billingDetails.firstname} ${billingDetails.lastname}</p>
                        <p><strong>Phone:</strong> ${billingDetails.phone}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                        <p><strong>Total Amount:</strong> $${totalPrice}</p>
                        <hr/>
                        <h3>Order Items:</h3>
                        <ul>
                            ${verifiedItems.map(item => `<li>${item.title} (x${item.quantity})</li>`).join('')}
                        </ul>
                        <p>Please contact the customer to finalize the payment.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error("Failed to send email notification:", emailError);
                // Continue execution, don't fail the order just because email failed
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