'use client';
import { useChat } from '../../context/ChatContext';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const { messagesByPatient, loadHistory, loading, error } = useChat();
  const { patientId } = useParams();

  const messages = messagesByPatient[patientId] || [];

  useEffect(() => {
    if (patientId) {
      loadHistory(patientId);
    }
  }, [patientId]);

  return (
    <div className="min-h-screen p-6 text-white font-sans">

      {loading && <p>Loading chat history...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((msg, i) => {
          if (msg.role === "assistant") {
            return (
              <div key={i} className="text-left whitespace-pre-line leading-relaxed max-w-2xl">
                {msg.content}
              </div>
            );
          } else if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="inline-block px-5 py-3 max-w-xs sm:max-w-md md:max-w-lg rounded-3xl text-white bg-white/10 backdrop-blur border border-white/20">
                  {msg.content}
                </div>
              </div>
            );
          } else {
            // System / error messages
            return (
              <div key={i} className="text-center text-sm text-red-400 italic">
                {msg.content}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}