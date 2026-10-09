"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I am WicketWise 🏏. Ask me for pitch reports, squad lists, or player stats for the match!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const askWicketWise = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply || data.error || "An error occurred." },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I couldn't reach the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askWicketWise();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#ededed] text-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#ededed]">
        <h1 className="text-xl font-semibold tracking-wide flex items-center">
          <img src="/WicketWise.png" alt="WicketWise Logo" className="w-8 h-8 mr-3 rounded-full object-cover" />
          WicketWise
        </h1>
      </header>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full md:max-w-3xl mx-auto px-4 py-8 space-y-6 flex flex-col scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm whitespace-pre-wrap leading-relaxed ${msg.role === "user"
                ? "bg-[#2f2f2f] text-gray-200 self-end rounded-tr-sm"
                : "bg-transparent text-gray-800 self-start"
                }`}
            >
              {msg.role === "ai" && (
                <div className="flex items-center mb-3">
                  <img src="/WicketWise.png" alt="Logo" className="w-6 h-6 mr-2 rounded-full object-cover" />
                  <span className="font-bold text-xs text-green-400 tracking-wider uppercase">WicketWise</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="max-w-[80%] px-5 py-3">
              <div className="flex items-center mb-2">
                <img src="/WicketWise.png" alt="Logo" className="w-6 h-6 mr-2 rounded-full object-cover" />
                <span className="font-bold text-xs text-green-400 tracking-wider uppercase">WicketWise</span>
              </div>
              <div className="flex space-x-1 items-center h-5 mt-2 ml-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-[#ededed] w-full pb-6 pt-2">
        <div className="md:max-w-3xl mx-auto px-4">
          <form
            onSubmit={askWicketWise}
            className="flex items-end bg-[#2f2f2f] px-4 py-3 rounded-3xl shadow-xl focus-within:ring-1 focus-within:ring-gray-500 transition-shadow"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WicketWise a question..."
              className="flex-1 min-h-[50px] bg-transparent outline-none resize-none text-gray-900 placeholder-gray-500 py-1"
              rows={1}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 mb-1 mr-1 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </form>
          <div className="text-center text-xs text-gray-500 mt-3 font-medium flex items-center justify-center">
            WicketWise can make mistakes. Always verify your fantasy stats.
          </div>
        </div>
      </div>
    </div>
  );
}