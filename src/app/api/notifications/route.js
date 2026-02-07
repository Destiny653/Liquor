import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { Notification } from '@/models/Notification';

// GET - Fetch notifications
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit')) || 20;

        const query = unreadOnly ? { isRead: false } : {};

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        const unreadCount = await Notification.countDocuments({ isRead: false });

        return NextResponse.json({
            success: true,
            data: notifications,
            unreadCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST - Create a new notification
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const notification = await Notification.create({
            type: body.type,
            title: body.title,
            message: body.message,
            data: body.data || {},
            link: body.link || '',
            recipientRole: body.recipientRole || 'manager'
        });

        return NextResponse.json({ success: true, data: notification }, { status: 201 });

    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH - Mark notifications as read
export async function PATCH(req) {
    try {
        await connectDB();
        const body = await req.json();

        if (body.markAllRead) {
            await Notification.updateMany({}, { isRead: true });
            return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 });
        }

        if (body.notificationId) {
            await Notification.findByIdAndUpdate(body.notificationId, { isRead: true });
            return NextResponse.json({ success: true, message: 'Notification marked as read' }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });

    } catch (error) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE - Delete a notification
export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const notificationId = searchParams.get('id');

        if (!notificationId) {
            return NextResponse.json({ success: false, message: 'Notification ID required' }, { status: 400 });
        }

        await Notification.findByIdAndDelete(notificationId);
        return NextResponse.json({ success: true, message: 'Notification deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
