"use client";

import React from "react";
import { ParthStructuredResponse } from "@/lib/parth/parthEngine";
import { ShieldAlert, Phone, ShieldCheck, Navigation, Info, CheckCircle2 } from "lucide-react";

interface ParthEmergencyMessageProps {
  response: ParthStructuredResponse;
}

export default function ParthEmergencyMessage({ response }: ParthEmergencyMessageProps) {
  const isSafe = response.is_safe !== false && !response.current_status.toLowerCase().includes("red") && !response.current_status.toLowerCase().includes("orange") && !response.current_status.toLowerCase().includes("yellow");

  return (
    <div className="space-y-3 text-xs leading-relaxed animate-fade-in">
      {/* 1. Direct Simple Answer (Prominent & Clear) */}
      <div
        className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-xs ${
          isSafe
            ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
            : "bg-red-50/90 border-red-300 text-red-950"
        }`}
      >
        {isSafe ? (
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <ShieldAlert size={20} className="text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
            <span className={isSafe ? "text-emerald-800" : "text-red-800"}>
              {isSafe ? "Verified Safe to Visit" : "Travel Hazard Caution"}
            </span>
            {response.target_location && (
              <span className="text-[11px] font-normal text-stone-600">
                • {response.target_location}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-stone-900 leading-snug">
            {response.direct_answer || (isSafe ? "All clear. Normal visiting hours and routes are open." : response.current_status)}
          </p>
        </div>
      </div>

      {/* 2. Immediate Safe Action / Guidance */}
      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5">
        <Info size={16} className="text-forest-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px] block">
            Guidance & Status
          </span>
          <div className="text-stone-800 text-xs mt-0.5 font-medium">
            {response.immediate_action}
          </div>
        </div>
      </div>

      {/* 3. Nearest Safe Shelter (ONLY when in an active risk area) */}
      {!isSafe && response.lower_risk_option && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>Nearest Verified Safe Shelter</span>
            </span>
            {response.lower_risk_option.distance_km && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                {response.lower_risk_option.distance_km} km away
              </span>
            )}
          </div>
          <div className="font-bold text-emerald-950 text-xs">
            {response.lower_risk_option.name}
          </div>
          {response.lower_risk_option.address && (
            <div className="text-[11px] text-stone-600">
              {response.lower_risk_option.address}
            </div>
          )}
          {response.lower_risk_option.contact && (
            <div className="text-[11px] text-emerald-800 font-semibold pt-0.5">
              Contact: {response.lower_risk_option.contact}
            </div>
          )}
        </div>
      )}

      {/* 4. Lower-Risk Route Guidance (ONLY when in risk area) */}
      {!isSafe && response.route_guidance && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-900 font-bold text-[10px] uppercase">
            <Navigation size={13} className="text-purple-700" />
            <span>Transit Corridor Assessment</span>
          </div>
          <div className="text-stone-800 text-[11px] font-medium">
            {response.route_guidance.advisory}
          </div>
          <div className="flex items-center gap-3 pt-1 text-[10px] text-purple-800">
            <span>Distance: ~{response.route_guidance.distance_km} km</span>
            <span>Risk Score: {response.route_guidance.risk_score}/100</span>
          </div>
        </div>
      )}

      {/* 5. Official Advisories */}
      {response.official_advisories && response.official_advisories.length > 0 && (
        <div className="p-2.5 rounded-xl bg-parchment-100/60 border border-parchment-300 space-y-1">
          <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px] block">
            Official Feed Status
          </span>
          <ul className="space-y-1 text-[11px] text-stone-700">
            {response.official_advisories.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-forest-600">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Emergency Contacts */}
      {response.emergency_contacts && response.emergency_contacts.length > 0 && (
        <div className="p-2.5 rounded-xl bg-stone-100/80 border border-stone-200 space-y-1.5">
          <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Phone size={12} />
            <span>Official Emergency Contacts</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {response.emergency_contacts.map((c, idx) => (
              <a
                key={idx}
                href={`tel:${c.number.replace(/\D/g, "")}`}
                className="p-1.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between hover:border-forest-400 transition-colors shadow-2xs"
              >
                <span className="text-[10px] text-stone-600 truncate">{c.name}</span>
                <span className="text-[11px] font-bold text-forest-800 shrink-0 ml-1">
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 7. Provenance */}
      <div className="pt-1 text-[10px] text-stone-500 flex items-center justify-between border-t border-stone-200">
        <span className="truncate">
          Source: {response.sources?.map((s) => s.name).join(" • ") || "Official Feeds"}
        </span>
        <span className="shrink-0 text-stone-400">
          Confidence: <strong className="text-forest-700">{response.confidence}</strong>
        </span>
      </div>
    </div>
  );
}
