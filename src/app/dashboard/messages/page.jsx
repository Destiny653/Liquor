'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PiRobot, PiUser, PiPaperPlaneRight, PiChatCircleText, PiClock, PiMagnifyingGlass } from 'react-icons/pi';
import './messages.css';
import DashboardLayout from '../components/DashboardLayout';

export default function MessagesDashboard() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Poll for new convs
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv.conversationId);
            const interval = setInterval(() => fetchMessages(selectedConv.conversationId), 5000); // Poll for new messages
            return () => clearInterval(interval);
        }
    }, [selectedConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/chat');
            const result = await res.json();
            if (result.success) {
                setConversations(result.data);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const res = await fetch(`/api/chat?conversationId=${id}`);
            const result = await res.json();
            if (result.success) {
                setMessages(result.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedConv) return;
        setSending(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConv.conversationId,
                    text: replyText
                })
            });
            const result = await res.json();
            if (result.success) {
                setReplyText('');
                fetchMessages(selectedConv.conversationId);
            }
        } catch (error) {
            console.error("Error sending reply:", error);
        } finally {
            setSending(false);
        }
    };

    const formatDate = (date) => {
        const msgDate = new Date(date);
        const today = new Date();
        const isToday = msgDate.toDateString() === today.toDateString();

        if (isToday) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };

    return (
        <DashboardLayout>
            <div className="messages-dashboard">
                <div className="conv-list-panel">
                    <div className="panel-header">
                        <h2>Concierge Inbox</h2>
                        <div className="search-bar">
                            <PiMagnifyingGlass />
                            <input type="text" placeholder="Search conversations..." />
                        </div>
                    </div>

                    <div className="conv-items">
                        {loading ? (
                            <div className="panel-loader">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="empty-state">No conversations found</div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.conversationId}
                                    className={`conv-item ${selectedConv?.conversationId === conv.conversationId ? 'active' : ''}`}
                                    onClick={() => setSelectedConv(conv)}
                                >
                                    <div className="avatar">{conv.customerName?.charAt(0) || 'U'}</div>
                                    <div className="conv-info">
                                        <div className="conv-meta">
                                            <span className="user-name">{conv.customerName}</span>
                                            <span className="time">{formatDate(conv.updatedAt)}</span>
                                        </div>
                                        <div className="last-msg">{conv.lastMessage}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="chat-panel">
                    {selectedConv ? (
                        <>
                            <div className="chat-header">
                                <div className="user-profile">
                                    <div className="avatarLarge">{selectedConv.customerName?.charAt(0)}</div>
                                    <div>
                                        <h3>{selectedConv.customerName}</h3>
                                        <span>{selectedConv.customerEmail}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-history">
                                {messages.map((msg, idx) => (
                                    <div key={msg._id || idx} className={`msg-row ${msg.sender === 'manager' ? 'manager' : 'user'}`}>
                                        <div className="msg-bubble">
                                            <p>{msg.text}</p>
                                            <span className="msg-time">{formatDate(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                                />
                                <button onClick={handleSendReply} disabled={sending || !replyText.trim()}>
                                    {sending ? '...' : <PiPaperPlaneRight />}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <PiChatCircleText size={60} />
                            <h3>Select a conversation to start replying</h3>
                            <p>Inquiries from your digital concierge will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
