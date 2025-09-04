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
    <div className="min-h-screen p-6 text-black font-sans">
      {loading && <p>Loading chat history...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      <div className="space-y-4 max-w-3xl mx-auto">
        {messages.map((msg, i) => {
          // Bubble for assistant
          if (msg.role === 'assistant') {
            return (
              <div
                key={i}
                className="text-left px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words break-all overflow-x-hidden bg-gray-100"
              >
                {msg.content}
                {msg.file && (
                  <a
                    href={msg.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition"
                  >
                    📄 {msg.file.name}
                  </a>
                )}
              </div>
            );
          }

          // Bubble for user
          if (msg.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="inline-block px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-2xl text-black bg-[#243c5a]/15 break-words break-all overflow-x-hidden">
                  {msg.content}
                  {msg.file && (
                    <a
                      href={msg.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block px-3 py-2 bg-[#243c5a]/10 border border-[#243c5a]/30 rounded-lg text-sm text-[#243c5a] hover:bg-[#243c5a]/20 transition"
                    >
                      📄 {msg.file.name}
                    </a>
                  )}
                </div>
              </div>
            );
          }

          // System / error messages
          return (
            <div key={i} className="text-center text-sm text-red-400 italic">
              {msg.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}