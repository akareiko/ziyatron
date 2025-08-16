'use client';
import { useChat } from '../../context/ChatContext';

export default function ChatPage() {
  const { messages } = useChat();

  return (
    <div className="min-h-screen p-6 text-white font-sans">
      <h1 className="text-2xl mb-6">Chat</h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((msg, i) => {
          if (msg.role === "assistant") {
            return (
              <div
                key={i}
                className="text-left whitespace-pre-line leading-relaxed max-w-2xl"
                style={{ whiteSpace: "pre-line" }}
              >
                {msg.content}
              </div>
            );
          } else {
            return (
              <div key={i} className="flex justify-end">
                <div
                  className="inline-block px-5 py-3 max-w-xs sm:max-w-md md:max-w-lg rounded-3xl text-white"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    boxShadow: "0 4px 30px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}