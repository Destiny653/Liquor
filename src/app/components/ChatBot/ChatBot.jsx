'use client';
import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { PiPaperPlaneRight, PiX, PiChatCircleText, PiRobot, PiUser, PiCheckCircle } from 'react-icons/pi';

export default function ChatBot({ onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Welcome to LiquorLuxx Concierge. How may I assist you with your premium spirit selection today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState('initial'); // initial, name, email, message, sent
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate bot thinking and flow
        setTimeout(() => {
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
                    setFormData(prev => ({ ...prev, message: userMsg.text }));
                    // Here you would typically send the data to your backend/EmailJS
                    botResponse = "Thank you. Your inquiry has been received by our concierge team. We will respond shortly via email.";
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

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
            setStep(nextStep);
            setIsTyping(false);
        }, 1000);
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
                        <h3>LiquorLuxx Concierge</h3>
                        <span className="online-status">Online</span>
                    </div>
                </div>
                <button onClick={onClose} className="close-btn">
                    <PiX size={20} />
                </button>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.type === 'bot' && (
                            <div className="message-icon bot">
                                <PiRobot size={16} />
                            </div>
                        )}
                        <div className="message-bubble">
                            {msg.text}
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
