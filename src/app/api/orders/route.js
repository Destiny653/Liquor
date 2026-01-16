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
                    paymentMethod: paymentMethod,
                    billingDetails: billingDetails
                }],
            })
            const userId = user._doc._id.toHexString();

            const orderIds = verifiedItems.map(item => item.productId)
            const existingOrder = await Order.findOne({ user: userId })

            if (!existingOrder) {
                await newOrder.save()
            } else {
                await Order.updateOne({ user: userId }, { $push: { orders: { products: verifiedItems, totalPrice, paymentMethod, billingDetails } } })
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
                    from: `"LiquorLuxx Admin" <${process.env.EMAIL_USER}>`,
                    to: process.env.OWNER_EMAIL || 'admin@liquorluxx.com',
                    subject: `New Order Received - ${paymentMethod.toUpperCase()} - $${totalPrice}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #d4af37;">
                                <h1 style="color: #1a1a1a; margin: 0; letter-spacing: 2px;">LIQUOR<span style="color: #d4af37;">LUXX</span></h1>
                                <p style="color: #888; font-size: 14px; margin: 5px 0 0;">Premium Order Notification</p>
                            </div>
                            
                            <div style="padding: 20px 0;">
                                <h2 style="color: #333; font-size: 20px; border-left: 4px solid #d4af37; padding-left: 10px;">New Order Details</h2>
                                
                                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-weight: 600;">Customer:</td>
                                        <td style="padding: 8px 0; color: #333;">${billingDetails.firstname} ${billingDetails.lastname}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-weight: 600;">Contact:</td>
                                        <td style="padding: 8px 0; color: #333;">${billingDetails.phone} | ${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-weight: 600;">Payment Method:</td>
                                        <td style="padding: 8px 0;"><span style="background-color: #d4af37; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${paymentMethod.toUpperCase()}</span></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #666; font-weight: 600;">Total Amount:</td>
                                        <td style="padding: 8px 0; color: #d4af37; font-size: 18px; font-weight: bold;">$${totalPrice}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <h3 style="margin-top: 0; color: #333; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Billing Address</h3>
                                <p style="color: #555; line-height: 1.6; margin: 10px 0;">
                                    ${billingDetails.streetAddress}<br>
                                    ${billingDetails.city}, ${billingDetails.state} ${billingDetails.zipCode}<br>
                                    ${billingDetails.country}
                                </p>
                                ${billingDetails.additionalNotes ? `<p style="font-style: italic; color: #888; font-size: 13px;"><strong>Note:</strong> ${billingDetails.additionalNotes}</p>` : ''}
                            </div>
                            
                            <div style="padding: 20px 0;">
                                <h3 style="color: #333; font-size: 16px;">Order Items</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="background-color: #eee;">
                                            <th style="padding: 10px; text-align: left; font-size: 14px; color: #333;">Product</th>
                                            <th style="padding: 10px; text-align: center; font-size: 14px; color: #333;">Qty</th>
                                            <th style="padding: 10px; text-align: right; font-size: 14px; color: #333;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${verifiedItems.map(item => `
                                            <tr style="border-bottom: 1px solid #eee;">
                                                <td style="padding: 10px; color: #555; font-size: 14px;">${item.title}</td>
                                                <td style="padding: 10px; text-align: center; color: #555; font-size: 14px;">${item.quantity}</td>
                                                <td style="padding: 10px; text-align: right; color: #555; font-size: 14px;">$${(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 20px; color: #888; font-size: 12px;">
                                <p>This is an automated notification from your LiquorLuxx store.</p>
                                <p>&copy; ${new Date().getFullYear()} LiquorLuxx Inc.</p>
                            </div>
                        </div>
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