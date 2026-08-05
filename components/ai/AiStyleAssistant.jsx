"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, X, Send, Bot, User, ArrowRight, Check, MessageSquare } from "lucide-react";
import { aiService } from "@/lib/aiService";

// Excluded routes where assistant must NOT be rendered (distraction-free checkout)
const EXCLUDED_ROUTES = [
  "/checkout",
  "/payment",
  "/order-confirmation",
  "/cart", // Distraction-free cart/checkout flow
];

function AiStyleAssistantComponent() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check route exclusion
  const isExcludedRoute = EXCLUDED_ROUTES.some((route) => pathname?.startsWith(route));

  // Initialize initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome-1",
        sender: "concierge",
        text: "Welcome to GOR Atelier. How may I assist your style curation today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // Keyboard accessibility: Escape key closes panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trapping when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-scroll messages container
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // If excluded route, do not render assistant
  if (isExcludedRoute) return null;

  const suggestions = aiService.getPromptSuggestions();

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputValue.trim();
    if (!textToSend) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue("");
    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(textToSend);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "concierge",
          text: "Forgive me, our concierge system is undergoing maintenance. Please explore our curated collections.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat.id);
    handleSendMessage(cat.query);
  };

  return (
    <>
      {/* ── 1. Floating Assistant Trigger Button ── */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9990] pointer-events-auto"
        >
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open GOR AI Luxury Style Assistant"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className="group relative flex items-center gap-2.5 h-[48px] px-4 rounded-full bg-[#0E1013] border border-[#C9A86A]/40 text-[#F7F5F2] shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(201,168,106,0.15)] hover:border-[#C9A86A] transition-all duration-300 cursor-pointer active:scale-95"
          >
            {/* Soft gold pulsing outer ring (non-reduced-motion) */}
            {!shouldReduceMotion && (
              <span className="absolute inset-0 rounded-full border border-[#C9A86A]/30 animate-ping opacity-25 pointer-events-none" />
            )}

            <div className="w-6 h-6 rounded-full bg-[#C9A86A]/15 border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            </div>

            <span className="font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[#F7F5F2] hidden sm:inline-block">
              AI Stylist
            </span>
          </button>
        </motion.div>
      )}

      {/* ── 2. Assistant Concierge Dialog / Bottom Sheet Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="GOR AI Luxury Style Assistant Concierge"
            className="fixed inset-0 z-[9995] flex items-end sm:items-bottom-right justify-end p-0 sm:p-6 pointer-events-auto select-none"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#080808]/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none pointer-events-auto"
            />

            {/* Concierge Window */}
            <motion.div
              ref={panelRef}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 30, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.96 }
              }
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[90vh] bg-[#0E1013] border border-[#C9A86A]/30 rounded-t-[24px] sm:rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_0_1px_rgba(201,168,106,0.15)] flex flex-col overflow-hidden pointer-events-auto z-10"
            >
              {/* Top Header */}
              <div className="p-4 sm:p-5 bg-[#14171C] border-b border-[#C9A86A]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0E1013] border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A]">
                    <Sparkles className="w-4 h-4 text-[#C9A86A]" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-normal text-[#F7F5F2] leading-tight">
                      GOR ATELIER
                    </h3>
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold">
                      Luxury Fashion Concierge
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Assistant"
                  className="w-8 h-8 rounded-full border border-white/10 hover:border-[#C9A86A]/40 text-[#B8B6B0] hover:text-[#F7F5F2] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Stream Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-none bg-[#0E1013]">
                {/* Message Stream */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-[16px] font-sans text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#C9A86A] text-[#0E1013] font-medium rounded-tr-none shadow-md"
                          : "bg-[#14171C] border border-[#C9A86A]/20 text-[#F7F5F2] rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="font-sans text-[9px] text-[#B8B6B0]/60 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-[#14171C] border border-[#C9A86A]/20 rounded-[16px] rounded-tl-none w-fit text-[#C9A86A]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span className="font-sans text-xs text-[#B8B6B0]">
                      Curating styling response...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Occasion Quick Selection Chips */}
              <div className="p-3 bg-[#14171C]/80 border-t border-[#C9A86A]/15 shrink-0">
                <span className="font-sans text-[9.5px] uppercase tracking-[0.2em] text-[#C9A86A] font-semibold block mb-2 px-1">
                  How are you dressing today?
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {suggestions.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3 py-1.5 rounded-full font-sans text-[10.5px] uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border ${
                        selectedCategory === cat.id
                          ? "bg-[#C9A86A] text-[#0E1013] font-bold border-[#C9A86A]"
                          : "bg-[#0E1013] text-[#B8B6B0] border-[#C9A86A]/20 hover:text-[#F7F5F2] hover:border-[#C9A86A]/50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 sm:p-4 bg-[#0E1013] border-t border-[#C9A86A]/20 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask your luxury concierge..."
                  className="flex-1 h-[44px] px-4 bg-[#14171C] border border-[#C9A86A]/20 focus:border-[#C9A86A] rounded-[12px] text-xs font-sans text-[#F7F5F2] placeholder-[#B8B6B0]/50 outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                  className="w-[44px] h-[44px] rounded-[12px] bg-[#C9A86A] hover:bg-[#D4B57C] text-[#0E1013] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const AiStyleAssistant = memo(AiStyleAssistantComponent);
export default AiStyleAssistant;
