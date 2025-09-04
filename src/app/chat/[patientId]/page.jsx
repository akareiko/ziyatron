'use client';
import LayoutWrapper from '../../LayoutWrapper';
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
    <LayoutWrapper>
      <div className="min-h-screen p-6 text-black font-sans">
        {loading && <p>Loading chat history...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((msg, i) => {
            if (msg.role === "assistant") {
              return (
                <div
                  key={i}
                  className="text-left px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words break-all overflow-x-hidden"
                >
                  {msg.content}
                </div>
              );
            } else if (msg.role === "user") {
              return (
                <div key={i} className="flex justify-end">
                  <div className="inline-block px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-2xl text-black bg-[#243c5a]/15 break-words break-all overflow-x-hidden">
                    {msg.content}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={i} className="text-center text-sm text-red-400 italic">
                  {msg.content}
                </div>
              );
            }
          })}
        </div>
      </div>
    </LayoutWrapper>
  );
}