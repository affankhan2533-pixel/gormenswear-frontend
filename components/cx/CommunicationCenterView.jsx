"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, Send, Sparkles, User, Bot, Paperclip } from "lucide-react";

export default function CommunicationCenterView({ onSendReply }) {
  const [activeChannel, setActiveChannel] = useState("WhatsApp");
  const [replyText, setReplyText] = useState("");
  const [aiSuggestedReply, setAiSuggestedReply] = useState(
    "Good morning Lord Sterling. Your sleeve alteration request for 34.5 inches has been assigned to Master Giuseppi. Expected completion is tomorrow at 14:00 GMT."
  );

  const [messages, setMessages] = useState([
    {
      sender: "customer",
      name: "Lord Julian Sterling",
      channel: "WhatsApp",
      time: "10:05 AM",
      text: "Hello Marcus, I just placed order #ORD-2026-8801. Please ensure the jacket sleeves are adjusted to 34.5 inches before dispatch.",
    },
    {
      sender: "agent",
      name: "Marcus Sterling (Concierge)",
      channel: "WhatsApp",
      time: "10:08 AM",
      text: "Good morning Lord Sterling. I have flagged your order for Master Giuseppi at our Mayfair Atelier.",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setMessages([
      ...messages,
      {
        sender: "agent",
        name: "Marcus Sterling (Concierge)",
        channel: activeChannel,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
      },
    ]);
    onSendReply(replyText);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-editorial text-3xl font-normal text-[#F8F6F3]">
          Omnichannel Communication Center
        </h2>
        <p className="text-xs text-[#8E8A85]">
          Unified messaging inbox for WhatsApp Concierge, Email, SMS, Live Chat, and internal staff notes.
        </p>
      </div>

      {/* Channel Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["WhatsApp", "Email", "Live Chat", "SMS", "Internal Notes"].map((chan) => (
          <button
            key={chan}
            type="button"
            onClick={() => setActiveChannel(chan)}
            className={`px-4 py-2 rounded-[10px] text-xs font-bold uppercase transition-colors shrink-0 ${
              activeChannel === chan
                ? "bg-[#C8A45D] text-[#090909]"
                : "bg-[#151515] text-[#8E8A85] border border-[#2A2A2A]"
            }`}
          >
            {chan}
          </button>
        ))}
      </div>

      {/* Main Inbox Frame */}
      <div className="p-6 bg-[#151515] border border-[#2A2A2A] rounded-[24px] shadow-2xl flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === "agent" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === "agent"
                    ? "bg-[#C8A45D] text-[#090909]"
                    : "bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3]"
                }`}
              >
                {m.name.charAt(0)}
              </div>

              <div
                className={`max-w-md p-4 rounded-[18px] text-xs leading-relaxed space-y-1 ${
                  m.sender === "agent"
                    ? "bg-[#090909] border border-[#C8A45D]/40 text-[#F8F6F3]"
                    : "bg-[#090909] border border-[#2A2A2A] text-[#F8F6F3]"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#8E8A85]">
                  <span className="font-bold text-[#C8A45D]">{m.name}</span>
                  <span>{m.time}</span>
                </div>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggested Reply Banner */}
        <div className="p-3 bg-[#090909] border border-[#2A2A2A] rounded-[14px] my-2 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="text-[11px] text-[#8E8A85]">
              AI Suggested Reply: <strong className="text-[#F8F6F3]">"{aiSuggestedReply.substring(0, 75)}..."</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setReplyText(aiSuggestedReply)}
            className="px-2.5 py-1 bg-[#151515] hover:bg-[#C8A45D] hover:text-[#090909] text-[#C8A45D] text-[10px] font-bold uppercase rounded-[6px] border border-[#2A2A2A] transition-colors cursor-pointer shrink-0"
          >
            Insert AI Reply
          </button>
        </div>

        {/* Reply Input Bar */}
        <form onSubmit={handleSend} className="pt-2 border-t border-[#2A2A2A] flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to customer via ${activeChannel}...`}
            className="flex-1 bg-[#090909] border border-[#2A2A2A] rounded-[14px] px-4 py-3 text-xs text-[#F8F6F3] focus:border-[#C8A45D] outline-none"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#C8A45D] hover:bg-[#D4B77D] text-[#090909] text-xs font-bold uppercase tracking-wider rounded-[14px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md font-bold shrink-0"
          >
            <Send className="w-4 h-4" /> Send Reply
          </button>
        </form>
      </div>
    </div>
  );
}
