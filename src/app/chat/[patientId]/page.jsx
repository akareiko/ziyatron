'use client';
import { useChat } from '../../../context/ChatContext';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import CopyButton from '../../../components/CopyButton';
import { useRef } from 'react';
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messagesByPatient, loadHistory, loading, error } = useChat();
  const { patientId } = useParams();
  const messagesEndRef = useRef(null);

  const messages = messagesByPatient[patientId] || [];

  useEffect(() => {
    if (patientId) {
      loadHistory(patientId);
    }
  }, [patientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 2) scrollToBottom();
  }, [messages]);

  return (
      <div className="min-h-screen text-black font-sans">
        {error && <p className="text-red-400">Error: {error}</p>}

        <div className="space-y-6 max-w-3xl pt-4">
          {messages.length > 0 && (
            <div className="flex flex-col gap-4 mb-2 pb-12">
              {messages.map((msg, i) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={i}
                    className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} mb-2`}
                  >
                    {isAssistant ? (
                      // Assistant message: full width, no background
                      <div className="w-full break-words text-black">
                        <ReactMarkdown>
                          {typeof msg.content === "string" ? msg.content : msg.content.text || ""}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="rounded-2xl p-3 break-words max-w-full sm:max-w-[75%] bg-black/5 text-black space-y-2">
                        {/* Render text if exists */}
                        {msg.content && <p>{msg.content}</p>}

                        {/* Render file preview if exists */}
                        {msg.file && (
                          <a
                            href={msg.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 bg-[#243c5a]/10 border border-[#243c5a]/30 rounded-xl text-sm text-[#243c5a] hover:bg-[#243c5a]/20 transition"
                          >
                            📄 {msg.file.name}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef}></div>
            </div>
          )}
        </div>
      </div>
  );
}