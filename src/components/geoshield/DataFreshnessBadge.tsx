"use client";

import React from "react";
import { Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface DataFreshnessBadgeProps {
  source: string;
  timestamp?: string;
  isOfficial?: boolean;
  className?: string;
}

export default function DataFreshnessBadge({
  source,
  timestamp,
  isOfficial = true,
  className = "",
}: DataFreshnessBadgeProps) {
  const getRelativeTime = (timeStr?: string) => {
    if (!timeStr) return "Just now";
    try {
      const now = new Date().getTime();
      const past = new Date(timeStr).getTime();
      const diffMin = Math.max(1, Math.round((now - past) / 60000));
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.round(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(timeStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "Active";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shadow-xs transition-colors shrink-0 ${
        isOfficial
          ? "bg-stone-900/90 border-emerald-500/40 text-stone-200"
          : "bg-stone-900/90 border-amber-500/40 text-stone-200"
      } ${className}`}
    >
      {isOfficial ? (
        <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle size={12} className="text-amber-400 shrink-0" />
      )}
      <span className="font-semibold text-white tracking-tight">{source}</span>
      <span className="text-emerald-400/60 font-medium">✓</span>
      <span className="text-emerald-300 font-medium flex items-center gap-1">
        <Clock size={10} className="text-emerald-400" />
        {getRelativeTime(timestamp)}
      </span>
    </div>
  );
}
