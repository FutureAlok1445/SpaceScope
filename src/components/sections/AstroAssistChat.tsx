"use client";

import { useState, useRef, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AstroAssistChatProps {
  mode?: "kid" | "expert";
}

export function AstroAssistChat({ mode = "kid" }: AstroAssistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Astro-Assist. Ask me anything about space! 🌌",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulated AI response (replace with actual GPT-4o-mini API call)
    setTimeout(() => {
      const responses = {
        kid: [
          "That's a great question! Let me explain it in a fun way...",
          "Wow! Did you know that...",
          "That's super cool! Here's what happens...",
        ],
        expert: [
          "Based on current astrophysical models, the phenomenon you're asking about involves...",
          "The technical explanation involves quantum mechanics and general relativity...",
          "Current research suggests that...",
        ],
      };

      const assistantMessage: Message = {
        role: "assistant",
        content:
          responses[mode][Math.floor(Math.random() * responses[mode].length)] +
          " " +
          userMessage.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Web Speech API TTS
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.rate = mode === "kid" ? 0.9 : 1.0;
        speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <GlassPanel className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-500" />
            <h3 className="font-orbitron text-lg text-white uppercase tracking-widest">
              Astro-Assist
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className={cn(
                "px-3 py-1 rounded text-xs font-mono uppercase",
                mode === "kid"
                  ? "bg-cyan-500/20 text-cyan-500 border border-cyan-500/50"
                  : "bg-white/10 text-white/60 border border-white/20"
              )}
            >
              Kid Mode
            </button>
            <button
              onClick={() => {}}
              className={cn(
                "px-3 py-1 rounded text-xs font-mono uppercase",
                mode === "expert"
                  ? "bg-cyan-500/20 text-cyan-500 border border-cyan-500/50"
                  : "bg-white/10 text-white/60 border border-white/20"
              )}
            >
              Expert Mode
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <Bot className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.role === "user"
                    ? "bg-cyan-500/20 text-white"
                    : "bg-white/10 text-white/90"
                )}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {msg.role === "user" && (
                <User className="w-5 h-5 text-white/60 shrink-0 mt-1" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Bot className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about space..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
            aria-label="Chat input"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-500 hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}

