"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const INIT_MESSAGES: Message[] = [
  { id: "1", senderId: "2", text: "Olá! Cheguei no local.", timestamp: "14:30" },
  { id: "2", senderId: "1", text: "Que ótimo! O Rex já está na porta.", timestamp: "14:31" },
  { id: "3", senderId: "2", text: "Já estou com ele. Vamos passear!", timestamp: "14:35" },
];

export function ChatInterface({ walkId, currentUserId }: { walkId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate walker reply if we are the client
    if (currentUserId === "1") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-reply",
            senderId: "2", // Walker
            text: "Certo! 👍",
            timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1500);
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-background relative">
      {/* ─── Header ─── */}
      <div className="flex items-center p-4 border-b border-border bg-background z-10">
        <Button variant="ghost" size="icon" render={<Link href={`/walks/${walkId}/tracking`} />} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {currentUserId === "1" ? "C" : "A"} {/* Carlos (walker) or Ana (client) */}
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">
              {currentUserId === "1" ? "Carlos Silva" : "Ana Lima"}
            </h2>
            <p className="text-xs text-green-500 font-medium tracking-tight">
              Passeio em andamento
            </p>
          </div>
        </div>
      </div>

      {/* ─── Messages Area ─── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-[15px] shadow-sm leading-relaxed",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background border border-border text-foreground rounded-tl-sm"
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* ─── Input Area ─── */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="resize-none pr-10 min-h-[44px] rounded-xl border-border focus-visible:ring-primary shadow-sm"
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
