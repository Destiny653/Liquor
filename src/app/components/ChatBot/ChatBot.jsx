'use client';
import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { PiPaperPlaneRight, PiX, PiChatCircleText, PiRobot, PiUser, PiCheckCircle } from 'react-icons/pi';

export default function ChatBot({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState('initial');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);

    // Load initial welcome message if no history
    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
            fetchHistory(email);
        } else {
            setMessages([{
                id: 1,
                type: 'bot',
                text: 'Welcome to Velvet Casks Concierge. How may I assist you with your premium spirit selection today?',
                timestamp: new Date()
            }]);
        }
    }, []);

    // Polling for new messages from manager
    useEffect(() => {
        if (formData.email) {
            const conversationId = `chat_${formData.email.replace(/[@.]/g, '_')}`;
            pollingInterval.current = setInterval(() => {
                fetchNewMessages(conversationId);
            }, 5000);
        }
        return () => clearInterval(pollingInterval.current);
    }, [formData.email, messages.length]);

    const fetchHistory = async (email) => {
        const conversationId = `chat_${email.replace(/[@.]/g, '_')}`;
        try {
            const res = await fetch(`/api/chat?conversationId=${conversationId}`);
            const result = await res.json();
            if (result.success && result.data.length > 0) {
                const formattedMessages = result.data.map(m => ({
                    id: m._id,
                    type: m.sender,
                    text: m.text,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(formattedMessages);
                setStep('sent');
            } else {
                setMessages([{
                    id: 1,
                    type: 'bot',
                    text: 'Welcome back to Velvet Casks. How can we help you today?',
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    const fetchNewMessages = async (conversationId) => {
        try {
            const res = await fetch(`/api/chat?conversationId=${conversationId}`);
            const result = await res.json();
            if (result.success) {
                const newMsgs = result.data.map(m => ({
                    id: m._id,
                    type: m.sender,
                    text: m.text,
                    timestamp: new Date(m.timestamp)
                }));

                if (newMsgs.length > messages.length) {
                    setMessages(newMsgs);
                }
            }
        } catch (error) {
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        if (step === 'sent') {
            const conversationId = `chat_${formData.email.replace(/[@.]/g, '_')}`;
            try {
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.name || 'Returning Client', email: formData.email, message: currentInput })
                });
                setIsTyping(false);
            } catch (error) {
                setIsTyping(false);
            }
            return;
        }

        // Simulate bot thinking and flow
        setTimeout(async () => {
            let botResponse = '';
            let nextStep = step;

            switch (step) {
                case 'initial':
                    botResponse = "I'd be happy to help. May I have your name to start?";
                    nextStep = 'name';
                    break;
                case 'name':
                    setFormData(prev => ({ ...prev, name: userMsg.text }));
                    botResponse = `Pleasure to meet you, ${userMsg.text}. Could you provide your email address so our team can follow up?`;
                    nextStep = 'email';
                    break;
                case 'email':
                    setFormData(prev => ({ ...prev, email: userMsg.text }));
                    botResponse = "Thank you. Please describe your inquiry or let us know which bottle you are interested in.";
                    nextStep = 'message';
                    break;
                case 'message':
                    const updatedData = { ...formData, message: userMsg.text };
                    setFormData(updatedData);

                    setIsTyping(true);
                    try {
                        const response = await fetch('/api/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedData)
                        });

                        if (response.ok) {
                            botResponse = "Thank you. Your inquiry has been received by our concierge team. We will respond shortly via email.";
                        } else {
                            botResponse = "I apologize, but I encountered an error sending your inquiry. Our team has been notified, or you can try again later.";
                        }
                    } catch (error) {
                        botResponse = "I'm having trouble connecting to our server right now. Please check your connection or try again shortly.";
                    }
                    nextStep = 'sent';
                    break;
                case 'sent':
                    botResponse = " Is there anything else I can assist you with?";
                    nextStep = 'initial'; // Loop back or handle differently
                    // Reset form for new inquiry if needed, or keep state
                    if (userMsg.text.toLowerCase().includes('no')) {
                        botResponse = "Have a wonderful day. Cheers! 🥃";
                        nextStep = 'closed';
                    }
                    break;
                default:
                    botResponse = "How can I help you today?";
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: botResponse,
                timestamp: new Date()
            }]);
            setStep(nextStep);
            setIsTyping(false);
        }, 1000);
    };

    const formatTime = (date) => {
        const msgDate = new Date(date);
        const today = new Date();
        const isToday = msgDate.toDateString() === today.toDateString();

        if (isToday) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="chatbot-title">
                    <div className="chatbot-avatar">
                        <PiRobot size={20} />
                    </div>
                    <div>
                        <h3>Velvet Casks Concierge</h3>
                        <span className="online-status">Online</span>
                    </div>
                </div>
                <button onClick={onClose} className="close-btn">
                    <PiX size={20} />
                </button>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type === 'manager' ? 'bot' : msg.type}`}>
                        {(msg.type === 'bot' || msg.type === 'manager') && (
                            <div className="message-icon bot">
                                <PiRobot size={16} />
                            </div>
                        )}
                        <div className="message-bubble-wrapper">
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                            <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                        {msg.type === 'user' && (
                            <div className="message-icon user">
                                <PiUser size={16} />
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="message bot">
                        <div className="message-icon bot">
                            <PiRobot size={16} />
                        </div>
                        <div className="message-bubble typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-area">
                <>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={step === 'closed'}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || step === 'closed'}>
                        <PiPaperPlaneRight size={20} />
                    </button>
                </>
            </div>
        </div>
    );
}
