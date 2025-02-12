"use client";

import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await axios.post("/api/chat", { message: input });
            const botReply = { sender: "bot", text: response.data.reply };

            setMessages((prev) => [...prev, botReply]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "bot", text: "Feil ved henting av svar" }]);
        }

        setInput("");
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-black font-bold mb-2">Chatbot</h2>
            <div className="h-64 overflow-y-auto border p-2 mb-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.sender === "user" ? "text-right text-blue-500" : "text-left text-black"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2 text-black">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Skriv en melding..."
                    className="flex-grow border p-2 rounded"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
