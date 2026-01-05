import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: String, // 'user' or 'manager'
        required: true
    },
    senderName: String,
    senderEmail: String,
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: String,
    customerEmail: String,
    lastMessage: String,
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    }
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
