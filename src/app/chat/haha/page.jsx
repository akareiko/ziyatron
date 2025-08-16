'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages] = useState([
    { sender: "bot", text: "Hi Alexey! How can I help you today?" },
    { sender: "user", text: "Can you summarize today's weather?" },
    { sender: "bot", text: "Sure! It's mostly sunny with light winds and a high of 27°C." }
  ]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl mb-4">Chat with: {chatId}</h1>

      <div className="space-y-4 max-w-3xl mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : "text-center"}>
            <div
              className={`inline-block px-4 py-3 rounded-2xl text-white ${
                msg.sender === "user"
                  ? "bg-blue-600 max-w-xs sm:max-w-md md:max-w-lg"
                  : "bg-gray-700 max-w-2xl"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}