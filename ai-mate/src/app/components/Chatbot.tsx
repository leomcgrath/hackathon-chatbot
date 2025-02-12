"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, KeyboardEvent } from 'react';

// Define the shape of a chat message
type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (): Promise<void> => {
    if (!userInput.trim()) return;

    // Append the user's message to the conversation
    const userMessage: Message = { sender: 'user', text: userInput };
    setConversation((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // WARNING: For production, move the API key to a secure backend or use environment variables.
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(userInput);
      const responseText = result.response.text();

      const botMessage: Message = { sender: 'bot', text: responseText };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating content: ", error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, an error occurred. Please try again." };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setUserInput('');
      setIsLoading(false);
    }
  };

  // Allow sending the message when pressing Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && userInput.trim()) {
      handleSendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.conversation} className="text-black">
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#FFF',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer} className="text-black">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          style={styles.input}
        />
        <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '400px',
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  conversation: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    height: '300px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    outline: 'none',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Chatbot;
