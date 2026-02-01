import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 I’m your RoomMate Assistant — how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Send message to Gemini backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await res.json();

      let botReply = data.reply;
      if (!botReply && data.error) {
        botReply = `⚠️ ${data.error}`;
        if (data.hint) botReply += `\n💡 ${data.hint}`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: botReply || "Sorry, I didn’t understand that 😅" },
      ]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I’m having trouble connecting to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        className="chatbot-icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={28} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            RoomMate Assistant 💬
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="message-container"
                style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
              >
                <span
                  className={`message-bubble ${msg.sender === "user" ? "message-user" : "message-bot"}`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </span>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div style={{ textAlign: "left", marginTop: "5px" }}>
                <span className="loading-bubble">
                  Typing...
                </span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-btn"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
