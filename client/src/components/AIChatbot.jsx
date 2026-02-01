import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { BsRobot, BsSend, BsX, BsChatDots } from 'react-icons/bs';

const AIChatbot = ({ listing }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: `Hi! I'm your AI assistant. Ask me anything about "${listing.title}"!`, sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Real AI Response
        const context = `
        Context: The user is asking about a property listing.
        Listing Details:
        - Title: ${listing.title}
        - Type: ${listing.type}
        - Price: ₹${listing.price} per month
        - Location: ${listing.location}
        - Description: ${listing.description}
        - Amenities: ${listing.amenities.join(', ')}
        - Contact: ${listing.contactPhone}
        
        User Question: ${input}
        
        Answer based on the listing details provided. Be helpful and concise.
        `;

        try {
            const res = await fetch("http://localhost:3000/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: context }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
        }
    };

    return (
        <div className="position-fixed bottom-0 end-0 m-4 z-3" style={{ zIndex: 1050 }}>
            {!isOpen && (
                <Button
                    variant="primary"
                    className="rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', background: 'linear-gradient(45deg, #7000ff, #00f2ff)', border: 'none' }}
                    onClick={() => setIsOpen(true)}
                >
                    <BsChatDots className="text-white fs-4" />
                </Button>
            )}

            {isOpen && (
                <Card className="glass-card border border-white border-opacity-25 shadow-lg" style={{ width: '350px', height: '500px', background: '#0a0a12' }}>
                    <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center p-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary rounded-circle p-1 d-flex align-items-center justify-content-center">
                                <BsRobot className="text-white" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">RoomMate AI</h6>
                                <small className="text-success" style={{ fontSize: '10px' }}>● Online</small>
                            </div>
                        </div>
                        <Button variant="link" className="text-reset p-0" onClick={() => setIsOpen(false)}>
                            <BsX className="fs-4" />
                        </Button>
                    </Card.Header>

                    <Card.Body className="overflow-auto p-3 d-flex flex-column gap-3" style={{ scrollbarWidth: 'thin' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div
                                    className={`p-2 px-3 rounded-3 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                    style={{ maxWidth: '80%', fontSize: '0.9rem' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </Card.Body>

                    <Card.Footer className="bg-transparent border-top border-white border-opacity-10 p-3">
                        <Form onSubmit={handleSend}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Ask about rent, amenities..."
                                    className="bg-transparent border-secondary"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <Button variant="primary" type="submit">
                                    <BsSend />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Card.Footer>
                </Card>
            )}
        </div>
    );
};

export default AIChatbot;
