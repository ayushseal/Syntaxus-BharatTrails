"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldAlert, Radio, FileCode, ChevronDown, ChevronUp, Info } from "lucide-react";
import { OfficialAlert } from "@/lib/geoshield/types";
import DataFreshnessBadge from "./DataFreshnessBadge";

interface AlertCenterProps {
  alerts: OfficialAlert[];
  onTriggerCellBroadcast?: (alert: OfficialAlert) => void;
  onPreviewCap?: (alert: OfficialAlert) => void;
}

export default function AlertCenter({
  alerts,
  onTriggerCellBroadcast,
  onPreviewCap,
}: AlertCenterProps) {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "MONITORING" | "HISTORICAL">("ACTIVE");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === "HISTORICAL") {
      return a.country === "Nepal" || a.headline.includes("HISTORICAL");
    }
    if (activeTab === "MONITORING") {
      return a.severity === "Moderate" || a.severity === "Minor";
    }
    return a.severity === "Severe" || a.severity === "Extreme";
  });

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-md p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-stone-900">
              Official Alert Centre (CAP 1.2)
            </h3>
            <p className="text-[11px] text-stone-500">
              Authoritative warnings from NDMA SACHET & State Emergency Centers
            </p>
          </div>
        </div>

        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-stone-100 text-stone-700">
          {filteredAlerts.length} Alerts
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-parchment-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
            activeTab === "ACTIVE"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Active Warnings
        </button>
        <button
          onClick={() => setActiveTab("MONITORING")}
          className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
            activeTab === "MONITORING"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Advisories & Watch
        </button>
        <button
          onClick={() => setActiveTab("HISTORICAL")}
          className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
            activeTab === "HISTORICAL"
              ? "bg-stone-800 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Historical Replays
        </button>
      </div>

      {/* Alert List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredAlerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;
          const isSevere = alert.severity === "Extreme" || alert.severity === "Severe";

          return (
            <div
              key={alert.id}
              className={`rounded-xl border transition-all ${
                isSevere
                  ? "border-red-200 bg-red-50/30"
                  : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                className="p-3 cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isSevere ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <DataFreshnessBadge
                      source={alert.source_name}
                      timestamp={alert.fetched_at}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {alert.headline}
                  </h4>
                </div>
                <button className="text-stone-400 pt-1">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-stone-100 text-xs space-y-2 text-stone-700">
                  <p className="leading-relaxed bg-white/80 p-2.5 rounded-lg border border-stone-200 text-stone-800">
                    {alert.description}
                  </p>

                  {alert.instruction && (
                    <div className="p-2 rounded-lg bg-forest-50/80 border border-forest-200 text-forest-900 flex items-start gap-2 text-[11px]">
                      <Info size={14} className="shrink-0 mt-0.5 text-forest-700" />
                      <div>
                        <strong>Instructions:</strong> {alert.instruction}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Target Area: {alert.area_description || "Designated District"}</span>
                    <span>Identifier: {alert.alert_identifier}</span>
                  </div>

                  {/* Actions: Cell Broadcast & CAP Preview */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                    <button
                      onClick={() => onTriggerCellBroadcast && onTriggerCellBroadcast(alert)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 text-xs shadow-xs"
                    >
                      <Radio size={12} className="text-red-400" />
                      <span>Simulate Broadcast</span>
                    </button>
                    <button
                      onClick={() => onPreviewCap && onPreviewCap(alert)}
                      className="py-1.5 px-3 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs"
                    >
                      <FileCode size={12} />
                      <span>CAP 1.2 XML</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="py-8 text-center text-xs text-stone-500">
            <AlertCircle size={24} className="mx-auto text-stone-400 mb-1" />
            No active alerts matching this tab.
          </div>
        )}
      </div>
    </div>
  );
}
