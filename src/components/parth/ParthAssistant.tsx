"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  X,
  Send,
  Phone,
  MapPin,
  Navigation,
  AlertCircle,
  RefreshCw,
  Compass,
  Sparkles,
  BookOpen,
  Landmark,
  RotateCcw,
} from "lucide-react";
import ParthEmergencyMessage from "./ParthEmergencyMessage";
import ParthGeneralMessage from "./ParthGeneralMessage";
import { ParthStructuredResponse } from "@/lib/parth/parthEngine";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  structured?: ParthStructuredResponse;
  timestamp: string;
}

interface ParthAssistantProps {
  currentCountry?: string;
  selectedSiteId?: string;
  userLocation?: { lat: number; lng: number };
  initialQuery?: string;
  openSignal?: number;
}

export default function ParthAssistant({
  currentCountry = "India",
  selectedSiteId,
  userLocation,
  initialQuery,
  openSignal,
}: ParthAssistantProps) {
  const pathname = usePathname() || "";

  const isGeoShield = pathname.startsWith("/geoshield");

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Global event listener so any page or button can trigger PARTH
  useEffect(() => {
    const handleOpenParth = (e: any) => {
      setIsOpen(true);
      if (e.detail?.query) {
        handleSendMessage(e.detail.query, e.detail?.siteId, e.detail?.country);
      }
    };
    window.addEventListener("open-parth", handleOpenParth);
    return () => window.removeEventListener("open-parth", handleOpenParth);
  }, []);

  // Trigger open and send initialQuery when openSignal increments
  useEffect(() => {
    if (openSignal) {
      setIsOpen(true);
      if (initialQuery) {
        handleSendMessage(initialQuery);
      }
    }
  }, [openSignal]);

  const historyKey = isGeoShield ? "parth_emergency_history_v1" : "parth_general_history_v1";

  // Restore persistent messages and open state from localStorage on mount
  useEffect(() => {
    try {
      const savedOpen = localStorage.getItem("parth_chat_open_v1");
      if (savedOpen === "true") {
        setIsOpen(true);
      }

      const savedMsgs = localStorage.getItem(historyKey);
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("[PARTH] localStorage read error:", e);
    }

    // Default welcome message if no history
    setMessages([
      {
        id: "msg_welcome",
        role: "assistant",
        content: isGeoShield
          ? "Namaste! I am PARTH, your AI Emergency Guidance Assistant for GeoShield. I monitor NDMA SACHET alerts, ISRO landslide corridors, IMD weather warnings, and verified safe shelters. How can I assist your journey today?"
          : "Namaste! I am PARTH, your AI Cultural & Travel Assistant for BharatTrails. Ask me anything about India's sacred monasteries, hidden heritage, architecture, visiting etiquette, or trip planning across the Himalayas!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [historyKey, isGeoShield]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(historyKey, JSON.stringify(messages));
      } catch (e) {
        console.warn("[PARTH] localStorage write error:", e);
      }
    }
  }, [messages, historyKey]);

  // Persist open/close state
  const handleToggleOpen = (openState: boolean) => {
    setIsOpen(openState);
    try {
      localStorage.setItem("parth_chat_open_v1", openState ? "true" : "false");
    } catch {}
  };

  // Reset / Clear Chat History
  const handleClearChat = () => {
    try {
      localStorage.removeItem(historyKey);
    } catch {}
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        role: "assistant",
        content: isGeoShield
          ? "Chat cleared. Ask about NDMA alerts, road closures, or safe shelters."
          : "Chat cleared. What would you like to explore across BharatTrails today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string, overrideSiteId?: string, overrideCountry?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/parth/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          country: overrideCountry || currentCountry,
          selectedSiteId: overrideSiteId || selectedSiteId,
          mode: isGeoShield ? "emergency" : "general",
          location: userLocation || { lat: 27.2889, lng: 88.5614 },
        }),
      });

      if (!res.ok) throw new Error("Failed to reach PARTH service");

      const data = await res.json();
      if (data.success && data.response) {
        const assistantMsg: ChatMessage = {
          id: `a_${Date.now()}`,
          role: "assistant",
          structured: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "PARTH returned unexpected response");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: isGeoShield
            ? "⚠️ Emergency connection notice: Real-time decision-support is temporarily operating in local cached mode. Dial 112 directly for critical rescue support."
            : "Namaste! Real-time assistant is temporarily offline. Explore the interactive monastery atlas and heritage cards directly on BharatTrails.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const emergencyQuickActions = [
    {
      label: "Find Nearest Shelter",
      icon: MapPin,
      query: "Where is the nearest verified safe shelter or medical relief point?",
    },
    {
      label: "Check Route Safety",
      icon: Navigation,
      query: "Is the road corridor open for travel, or are there active landslide blockages ahead?",
    },
    {
      label: "Emergency Helplines (112)",
      icon: Phone,
      query: "What are the verified disaster emergency helpline numbers for this district?",
    },
    {
      label: "Char Dham Landslide Status",
      icon: AlertCircle,
      query: "What is the official NDMA / ISRO landslide status for the Chamoli pilgrimage axis?",
    },
  ];

  const generalQuickActions = [
    {
      label: "Gurudongmar Lake Guide",
      icon: Compass,
      query: "When should I go to Gurudongmar Lake and what precautions should I take?",
    },
    {
      label: "Rumtek Monastery Guide",
      icon: Landmark,
      query: "Tell me about Rumtek Monastery and its significance",
    },
    {
      label: "Monastery Etiquette & Dress Code",
      icon: BookOpen,
      query: "What is the proper etiquette and dress code when visiting Buddhist monasteries?",
    },
    {
      label: "Plan 3-Day Sikkim Circuit",
      icon: Compass,
      query: "Plan a 3-day monastery pilgrimage circuit in Sikkim",
    },
    {
      label: "Best Time to Visit Ladakh",
      icon: Sparkles,
      query: "What is the best time to visit monasteries in Ladakh and see Cham dances?",
    },
  ];

  const activeQuickActions = isGeoShield ? emergencyQuickActions : generalQuickActions;

  // Do not render PARTH AI on curator portal login or inside curator dashboard
  if (pathname.startsWith("/curator")) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => handleToggleOpen(true)}
          className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 border group ${
            isGeoShield
              ? "bg-[#0f2e23] hover:bg-[#145C45] border-[#145C45] backdrop-blur-md"
              : "bg-forest-900 hover:bg-forest-950 border-amber-400/80 shadow-forest-950/40"
          }`}
          aria-label={isGeoShield ? "Open PARTH Emergency Guidance" : "Open PARTH AI"}
        >
          {isGeoShield ? (
            <div className="text-left select-none px-0.5">
              <div className="font-serif font-bold text-[11px] leading-tight flex items-center gap-1 text-white">
                <span className="text-amber-400 text-xs">✦</span>
                <span>PARTH AI</span>
              </div>
              <div className="text-[9px] text-emerald-200/90 leading-tight mt-0.5">
                Emergency Guidance
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-0.5">
              <Sparkles size={14} className="text-amber-300" />
              <span className="font-serif font-bold text-xs tracking-wider text-white">
                PARTH AI
              </span>
            </div>
          )}
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-parchment-300 flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-forest-900 text-white px-4 py-3 flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                isGeoShield
                  ? "bg-forest-800 border-saffron-400/40 text-saffron-300"
                  : "bg-forest-800 border-amber-400/40 text-amber-300"
              }`}>
                {isGeoShield ? <ShieldAlert size={18} /> : <Compass size={18} />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-parchment-100 flex items-center gap-1.5">
                  <span>{isGeoShield ? "Safety Copilot" : "PARTH AI"}</span>
                  {isGeoShield && (
                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider shadow-xs"
                      style={{
                        backgroundColor: "#145C45",
                        color: "#FFFFFF",
                        border: "1px solid #145C45",
                      }}
                    >
                      LIVE
                    </span>
                  )}
                </h3>
                {isGeoShield && (
                  <p className="text-[10px] text-parchment-300 font-medium">
                    Emergency Decision Support
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset / Clear Conversation"
                className="p-1.5 rounded-lg hover:bg-forest-800 text-parchment-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline text-[10px]">Clear</span>
              </button>
              <button
                onClick={() => handleToggleOpen(false)}
                className="p-1.5 rounded-lg hover:bg-forest-800 text-parchment-300 hover:text-white transition-colors"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="bg-parchment-50 border-b border-parchment-200 px-3 py-2 flex gap-1.5 overflow-x-auto text-[11px]">
            {activeQuickActions.map((qa, idx) => {
              const Icon = qa.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qa.query)}
                  className="px-2.5 py-1 rounded-full bg-white border border-parchment-300 hover:border-forest-500 text-stone-700 hover:text-forest-900 transition-colors whitespace-nowrap flex items-center gap-1 shrink-0 font-medium shadow-2xs"
                >
                  <Icon size={12} className="text-forest-700 shrink-0" />
                  <span>{qa.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Container */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-parchment-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    msg.role === "user"
                      ? "bg-forest-800 text-white rounded-br-xs font-medium"
                      : "bg-white border border-parchment-300 text-stone-800 rounded-bl-xs"
                  }`}
                >
                  {msg.structured ? (
                    isGeoShield ? (
                      <ParthEmergencyMessage response={msg.structured} />
                    ) : (
                      <ParthGeneralMessage response={msg.structured} />
                    )
                  ) : (
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-parchment-300 rounded-2xl max-w-[80%] text-xs text-stone-500 animate-pulse">
                <RefreshCw size={14} className="animate-spin text-forest-700" />
                <span>
                  {isGeoShield
                    ? "Checking NDMA alerts & ISRO hazard corridors..."
                    : "Consulting BharatTrails Monastic Atlas..."}
                </span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-parchment-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                isGeoShield
                  ? "Ask PARTH (e.g. Is NH-58 open? Where is safe shelter?)"
                  : "Ask PARTH (e.g. Tell me about Rumtek, dress code, trip plan...)"
              }
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-parchment-50 border border-parchment-300 focus:outline-none focus:border-forest-600 text-stone-900 placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-xl bg-forest-800 text-white hover:bg-forest-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
