'use client';
import { useChat } from '../../../context/ChatContext';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";


function TypingIndicator() {
  return (
    <div className="flex space-x-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></span>
      ))}
    </div>
  );
}

export default function ChatPage() {
  const { messagesByPatient, loadHistory, error, isStreaming } = useChat();
  const { patientId } = useParams();
  const messagesEndRef = useRef(null);
  const messages = messagesByPatient[patientId] || [];
  const lastUserMessageRef = useRef(null);
  const lastUserMessageIndexRef = useRef(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      loadHistory(patientId).finally(() => setIsLoading(false));
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      loadHistory(patientId);
    }
  }, [patientId]);

  useEffect(() => {
    const lastUserIndex = messages
      .map((m, i) => (m.role === "user" ? i : -1))
      .filter(i => i !== -1)
      .pop();

    if (lastUserIndex > lastUserMessageIndexRef.current) {
      lastUserMessageIndexRef.current = lastUserIndex;
      lastUserMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    // If last message is from user and assistant is streaming -> show typing
    if (lastMessage?.role === "user" && !isStreaming) {
      setIsGenerating(true);
    } else {
      setIsGenerating(false);
    }
  }, [messages, isStreaming]);

  return (
    <div className="text-black font-sans">
      {error && <p className="text-red-400">Error: {error}</p>}

      <div className="space-y-6 max-w-3xl pt-4">

        {isLoading ? (
          <div>

          </div>
        ) : messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              const isLastUserMessage =
                msg.role === "user" &&
                i === messages.map((m) => m.role === "user" ? i : -1).filter(j => j !== -1).pop();
              const text = typeof msg.content === "string" ? msg.content : msg.content.text || "";
              if (isAssistant) {
                console.log("RAW MARKDOWN:", JSON.stringify(text));
                console.log("CODES:", Array.from(text.slice(0, 50)).map(c => c.charCodeAt(0)));
              }
              return (
                <div
                  key={i}
                  ref={isLastUserMessage ? lastUserMessageRef : null}
                  className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} mb-2`}
                  style={msg.role === "user" ? { scrollMarginTop: "1rem" } : {}}
                >
                  {isAssistant ? (
                      <div className="w-full break-words text-black">
                        <div className="prose prose-slate max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                          >
                            {(typeof msg.content === "string" ? msg.content : msg.content.text) || ""}
                          </ReactMarkdown>
                        </div>
                      </div>
                  ) : (
                    <div className="rounded-2xl px-4 py-2 break-words max-w-full sm:max-w-[75%] bg-black/5 text-black space-y-2">
                      {msg.content && <p>{msg.content}</p>}
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
            {isGenerating && (
              <div className="flex w-full justify-start mb-2">
                <div className="rounded-2xl px-4 py-2 bg-gray-200/50">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {/* Conditional 100vh spacer: only if at least 2 user messages */}
            {messages.filter(m => m.role === "user").length >= 2 && (
              <div style={{ height: "70vh" }} />
            )}
            <div ref={messagesEndRef}></div>
          </div>
        ) : (
          // 👇 Empty state when no chat history
          <div className="flex flex-col items-center justify-center h-[70vh] text-center text-black">
            <h2 className="text-2xl font-semibold mb-2">Let’s start</h2>
            <p className="text-base">No messages yet for this patient.</p>
            <p className="text-sm text-gray-400 mt-1">Start typing below to begin the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}