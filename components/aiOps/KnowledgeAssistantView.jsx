"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User, Sparkles, MessageSquare, CornerDownLeft } from "lucide-react";

export default function KnowledgeAssistantView({ preIndexedQA }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Greetings. I am your GOR Enterprise AI Assistant. How may I assist you with product specs, order status, customer accounts, or analytics today?",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = { sender: "user", text: inputQuery };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputQuery;
    setInputQuery("");

    // Simulate AI knowledge retrieval
    setTimeout(() => {
      let matchedAns = "Analyzing GOR enterprise knowledgebase... Currently, all 24 connected systems are operating with a 98.4% health score.";
      
      const lower = currentQuery.toLowerCase();
      if (lower.includes("outerwear") || lower.includes("product") || lower.includes("suede") || lower.includes("jacket")) {
        matchedAns = "The Biella Shearling Trimmed Suede Jacket is our top-performing product ($2,450 / $2,100), generating $24,500 this month with 4 units remaining in stock.";
      } else if (lower.includes("order") || lower.includes("pending")) {
        matchedAns = "We have 6 pending orders, including 1 high-value VIP order (#ORD-2026-8801) for Lord Julian Sterling.";
      } else if (lower.includes("customer") || lower.includes("vip")) {
        matchedAns = "We have 1,840 active customer accounts, with VIP Platinum sales up +14.2% MoM.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: matchedAns }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Contextual AI Knowledge Assistant
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Query product catalogs, order fulfillment statuses, VIP customer records, and inventory metrics in natural language.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {preIndexedQA.map((qa, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInputQuery(qa.question);
            }}
            className="px-3.5 py-2 bg-[#151515] border border-[#2A2A2A] hover:border-[#C8A45D] text-xs text-[#F8F6F3] rounded-[12px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            "{qa.question}"
          </button>
        ))}
      </div>

      {/* Chat Window Container */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-2xl flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === "user"
                    ? "bg-[#C8A45D] text-[#090909]"
                    : "bg-[#090909] border border-[#2A2A2A] text-emerald-400"
                }`}
              >
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-md p-4 rounded-[18px] text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#C8A45D] text-[#090909] font-medium"
                    : "bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#2A2A2A] flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask GOR AI about products, orders, customers, or inventory..."
            className="flex-1 bg-[#090909] border border-[#2A2A2A] rounded-[14px] px-4 py-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] font-bold text-xs uppercase tracking-wider rounded-[14px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold shrink-0"
          >
            <Send className="w-4 h-4" /> Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}
