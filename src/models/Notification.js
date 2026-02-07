import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['new_message', 'new_order', 'new_customer', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Store related data like conversationId, orderId, etc.
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    recipientRole: {
        type: String,
        enum: ['manager', 'all'],
        default: 'manager'
    },
    link: {
        type: String, // URL to navigate to when clicked
        default: ''
    }
}, { timestamps: true });

// Index for efficient querying
NotificationSchema.index({ isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientRole: 1 });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
