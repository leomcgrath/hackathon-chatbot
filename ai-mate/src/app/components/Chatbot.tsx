"use client";

import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ question: input }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Feil ved API-kall: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      console.error("Feil i frontend:", error);
      setResponse("Noe gikk galt, prøv igjen.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-black font-bold mb-2">Produkt Chatbot</h2>
      <form onSubmit={handleSubmit} className="mb-2 text-black">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Still et spørsmål..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Send</button>
      </form>
      {response && <p className="mt-2 p-2 border bg-gray-100 text-black">{response}</p>}
    </div>
  );
}
