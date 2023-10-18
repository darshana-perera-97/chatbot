import React, { useState, useEffect } from "react";
import OpenAI from "openai";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are producing a software called lux from ABC company.",
    },
    {
      role: "assistant",
      content: "Hello! How can I assist you today?",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    setIsLoading(true);

    const newMessage = {
      role: "user",
      content: inputMessage,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputMessage("");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: updatedMessages,
        temperature: 0.7, // You can adjust these parameters as needed
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const assistantReply = response.choices[0].message.content;

      const updatedMessagesWithReply = [
        ...updatedMessages,
        {
          role: "assistant",
          content: assistantReply,
        },
      ];

      setMessages(updatedMessagesWithReply);
    } catch (error) {
      console.error("Chatbot API Error:", error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
