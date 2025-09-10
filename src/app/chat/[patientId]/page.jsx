'use client';
import { useChat } from '../../context/ChatContext';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import CopyButton from '../../CopyButton';
import { useRef } from 'react';
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { messagesByPatient, loadHistory, loading, error } = useChat();
  const { patientId } = useParams();
  const messagesEndRef = useRef(null);

  const messages = messagesByPatient[patientId] || [];

  // function MessageSkeleton({ role = "assistant" }) {
  //   const isAssistant = role === "assistant";

  //   return (
  //     <div className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} gap-2`}>
  //       <div
  //         className={`rounded-2xl animate-pulse bg-gray-300/50 ${
  //           isAssistant
  //             ? "w-2/3 h-16 px-5 py-3"
  //             : "w-1/2 h-10 px-4 py-2"
  //         }`}
  //       ></div>
  //     </div>
  //   );
  // }

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
        {/* {loading && (
          <div className="flex flex-col gap-4 mb-2 pb-24">
            <MessageSkeleton role="assistant" />
            <MessageSkeleton role="user" />
            <MessageSkeleton role="assistant" />
          </div>
        )} */}
        {error && <p className="text-red-400">Error: {error}</p>}

        <div className="space-y-6 max-w-3xl mx-auto pt-4">
          {messages.length > 0 && (
            <div className="flex flex-col gap-4 mb-2 pb-12">
              {messages.map((msg, i) => {
                
                // if (msg.role === "assistant") {
                //   const highlights = msg.highlights || [];
                //   const next_steps = msg.next_steps || [];
                //   const warnings = msg.warnings || [];

                //   return (
                //     <div key={i} className="flex flex-col items-start gap-1">
                //       <div className="text-left px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words break-all overflow-x-hidden bg-white/70 text-black">
                //         <ReactMarkdown>{msg.text || ""}</ReactMarkdown>

                //         {/* Highlights */}
                //         {highlights.length > 0 && (
                //           <ul>
                //             {highlights.map((h, idx) => <li key={idx}>{h}</li>)}
                //           </ul>
                //         )}

                //         {/* Next steps */}
                //         {next_steps.length > 0 && (
                //           <p><strong>Next steps:</strong> {next_steps.join(", ")}</p>
                //         )}

                //         {/* Warnings */}
                //         {warnings.length > 0 && (
                //           <p style={{ color: "red" }}>{warnings.join(" | ")}</p>
                //         )}
                //       </div>
                //       <div className="pl-2">
                //         <CopyButton text={msg.text || ""} />
                //       </div>
                //     </div>
                //   );
                // } 

                if (msg.role === "assistant") {
                  const highlights = msg.highlights || [];
                  const next_steps = msg.next_steps || [];
                  const warnings = msg.warnings || [];

                  return (
                    <div key={i} className="flex flex-col items-start gap-1">
                      <div className="text-left px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words overflow-x-hidden bg-white/70 text-black">
                        <ReactMarkdown>{typeof msg.content === "string" ? msg.content : msg.content.text || ""}</ReactMarkdown>

                        {/* Highlights */}
                        {highlights.length > 0 && <ul>{highlights.map((h, idx) => <li key={idx}>{h}</li>)}</ul>}

                        {/* Next steps */}
                        {next_steps.length > 0 && (
                          <p><strong>Next steps:</strong> {next_steps.join(", ")}</p>
                        )}

                        {/* Warnings */}
                        {warnings.length > 0 && (
                          <p style={{ color: "red" }}>{warnings.join(" | ")}</p>
                        )}
                      </div>
                      <div className="pl-2">
                        <CopyButton text={msg.content || ""} />
                      </div>
                    </div>
                  );
                }

                else if (msg.role === "user") {
                  return (
                    <div key={i} className="flex flex-col items-end gap-1">
                      <div className="inline-block px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-2xl text-black bg-[#243c5a]/15 break-words overflow-x-hidden">
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
                      <div className="pr-2">
                        <CopyButton text={msg.content} />
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={messagesEndRef}></div>
            </div>
          )}
        </div>
      </div>
  );
}