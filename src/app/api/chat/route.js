import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Message, Conversation } from '@/models/Chat';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        await connectDB();
        const { conversationId, text } = await req.json();

        // 1. Get Conversation to find customer email
        const conversation = await Conversation.findOne({ conversationId });
        if (!conversation) {
            return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });
        }

        // 2. Save Manager Message
        const newMessage = await Message.create({
            conversationId,
            sender: 'manager',
            senderName: 'Velvet Casks Concierge',
            text: text
        });

        // 3. Update Conversation last message
        conversation.lastMessage = text;
        await conversation.save();

        // 4. Send Email Notification to Customer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
                    .header { background: #121212; color: #d4af37; padding: 25px; text-align: center; border-bottom: 2px solid #d4af37; }
                    .content { padding: 40px; }
                    .message-bubble { background: #fdfbf7; border-left: 4px solid #d4af37; padding: 20px; font-style: italic; color: #444; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; background: #f9f9f9; }
                    .btn { display: inline-block; padding: 12px 25px; background: #121212; color: #d4af37; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; border: 1px solid #d4af37; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Velvet Casks</h1></div>
                    <div class="content">
                        <h3>New reply from Concierge</h3>
                        <p>Hello ${conversation.customerName},</p>
                        <p>Our concierge service has replied to your inquiry:</p>
                        <div class="message-bubble">"${text}"</div>
                        <p>You can view this message and continue the chat on our website.</p>
                        <a href="${process.env.NEXTAUTH_URL}" class="btn">GO TO LIQUORLUXX</a>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Velvet Casks. Premium Spirits, Exceptional Service.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"Velvet Casks Concierge" <${process.env.EMAIL_USER}>`,
            to: conversation.customerEmail,
            subject: "New Message from Velvet Casks Concierge",
            html: htmlContent
        });

        return NextResponse.json({ success: true, data: newMessage }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            // Get all conversations for the dashboard
            const conversations = await Conversation.find().sort({ updatedAt: -1 });
            return NextResponse.json({ success: true, data: conversations }, { status: 200 });
        }

        // Get messages for a specific conversation
        const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
        return NextResponse.json({ success: true, data: messages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
