import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/db';
import { Message, Conversation } from '@/models/Chat';
import { Notification } from '@/models/Notification';

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, message } = await req.json();

        // Unique conversation ID based on email (simplified for demo)
        const conversationId = `chat_${email.replace(/[@.]/g, '_')}`;

        // 1. Save or Update Conversation
        await Conversation.findOneAndUpdate(
            { conversationId },
            {
                customerName: name,
                customerEmail: email,
                lastMessage: message,
                status: 'active'
            },
            { upsert: true, new: true }
        );

        // 2. Save Message
        await Message.create({
            conversationId,
            sender: 'user',
            senderName: name,
            senderEmail: email,
            text: message
        });

        // 3. Create Notification for Dashboard
        await Notification.create({
            type: 'new_message',
            title: `New Message from ${name}`,
            message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            data: { conversationId, email },
            link: '/dashboard/messages',
            recipientRole: 'manager'
        });

        // Create a transporter using SMTP or other transport
        // These should be set in your .env file
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your preferred service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Professional HTML Email Template for Velvet Casks
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    .header { background: #121212; color: #d4af37; padding: 30px; text-align: center; border-bottom: 2px solid #d4af37; }
                    .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; }
                    .content { padding: 40px; background: #fff; }
                    .inquiry-box { background: #fdfbf7; border-left: 4px solid #d4af37; padding: 20px; margin-top: 20px; border-radius: 4px; }
                    .label { font-weight: bold; color: #121212; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 5px; display: block; }
                    .value { font-size: 16px; margin-bottom: 15px; color: #444; }
                    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
                    .accent { color: #d4af37; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Velvet Casks</h1>
                        <p style="margin: 5px 0 0; font-style: italic; opacity: 0.8;">Concierge Service</p>
                    </div>
                    <div class="content">
                        <h2 style="color: #121212; margin-top: 0;">New Concierge Inquiry</h2>
                        <p>A new message has been received from the <span class="accent">Velvet Casks</span> digital concierge.</p>
                        
                        <div class="inquiry-box">
                            <span class="label">Client Name</span>
                            <div class="value">${name}</div>
                            
                            <span class="label">Email Address</span>
                            <div class="value">${email}</div>
                            
                            <span class="label">Inquiry Message</span>
                            <div class="value" style="white-space: pre-wrap;">${message}</div>
                        </div>
                        
                        <p style="margin-top: 30px;">Please respond to this luxury client at your earliest convenience to maintain the Velvet Casks standard of excellence.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Velvet Casks Premium Spirits. All rights reserved.</p>
                        <p>This is an automated notification from your digital concierge platform.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"Velvet Casks Concierge" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to yourself (the site owner)
            subject: `New Concierge Inquiry from ${name}`,
            html: htmlContent,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
    }
}
