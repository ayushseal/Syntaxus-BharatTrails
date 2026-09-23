"use client";

import React, { useState } from "react";
import { History, Shield, Check, X, AlertTriangle, Flame, Waves, Mountain } from "lucide-react";

export type ScenarioId = "india_live" | "nepal" | "japan" | "morocco" | "libya" | "greece" | "brazil";

interface HistoricalReplayModalProps {
  currentScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  onClose: () => void;
}

export default function HistoricalReplayModal({
  currentScenario,
  onSelectScenario,
  onClose,
}: HistoricalReplayModalProps) {
  const [filterRegion, setFilterRegion] = useState<string>("ALL");

  const scenarios: {
    id: ScenarioId;
    title: string;
    region: string;
    category: "LIVE" | "REPLAY";
    hazardType: string;
    description: string;
    sources: string[];
    date: string;
    icon: any;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
  }[] = [
    {
      id: "india_live",
      title: "India Live Feeds (NDMA SACHET & ISRO NRSC)",
      region: "India",
      category: "LIVE",
      hazardType: "Multi-Hazard (Landslide, Flood, Fire, Weather)",
      description: "Live real-time aggregation across Indian official authorities: NDMA SACHET (CAP-AU), ISRO NRSC landslide vulnerability along NH-58 Char Dham, IMD severe rainfall, and CWC Upper Teesta basin alerts.",
      sources: ["NDMA SACHET", "ISRO NRSC", "IMD Mausam", "CWC Flood", "FSI Van Agni"],
      date: "Active Monitoring (2026)",
      icon: Shield,
      accentColor: "border-forest-600 bg-forest-50/40",
      badgeBg: "bg-forest-100 text-forest-800",
      badgeText: "Primary Live System",
    },
    {
      id: "nepal",
      title: "August 2026 Nepal Bhote Koshi Glacier Collapse Flood",
      region: "Asia (Cross-Border)",
      category: "REPLAY",
      hazardType: "Glacial Outburst (GLOF)",
      description: "Catastrophic upper moraine dam breach in Bhote Koshi catchment triggering deep flash flood waves across Rasuwa and Langtang trekking trail corridors.",
      sources: ["Nepal NDRRMA", "DHM Nepal", "ICIMOD Replay Grid", "NASA GPM"],
      date: "August 2026",
      icon: Waves,
      accentColor: "border-amber-600 bg-amber-50/40",
      badgeBg: "bg-amber-100 text-amber-900",
      badgeText: "Himalayan Replay",
    },
    {
      id: "japan",
      title: "January 2024 Japan Noto Peninsula M7.6 Earthquake & Tsunami",
      region: "Asia",
      category: "REPLAY",
      hazardType: "M7.6 Earthquake & Coastal Tsunami",
      description: "Violent seismic rupture and coastal tsunami along Ishikawa Prefecture, devastating the historic 1,000-year-old Wajima Morning Market (Asaichi) and severing Highway 249.",
      sources: ["Japan Met Agency (JMA)", "FDMA 119", "Ishikawa Prefectural HQ"],
      date: "January 2024",
      icon: Mountain,
      accentColor: "border-rose-600 bg-rose-50/40",
      badgeBg: "bg-rose-100 text-rose-900",
      badgeText: "Recent Calamity",
    },
    {
      id: "morocco",
      title: "September 2023 Morocco Al-Haouz High Atlas Earthquake",
      region: "Africa",
      category: "REPLAY",
      hazardType: "M6.8 High Atlas Earthquake",
      description: "Destructive shallow earthquake southwest of Marrakech damaging UNESCO Medina ramparts, historical mountain adobe settlements, and the 12th-century Tinmal Mosque.",
      sources: ["Protection Civile Maroc (141)", "Ministry of Interior", "Red Crescent"],
      date: "September 2023",
      icon: Mountain,
      accentColor: "border-orange-600 bg-orange-50/40",
      badgeBg: "bg-orange-100 text-orange-900",
      badgeText: "Recent Calamity",
    },
    {
      id: "libya",
      title: "September 2023 Libya Derna Cyclone Daniel & Dam Failure",
      region: "Africa / Mediterranean",
      category: "REPLAY",
      hazardType: "Extreme Cyclone & Dual Dam Breach",
      description: "Over 400mm rainfall from Mediterranean Cyclone Daniel caused sequential breach of Abu Mansur and Derna dams, sweeping away quarters of ancient Derna and threatening Cyrenaica ruins.",
      sources: ["National Center of Meteorology (Libya)", "Libyan Red Crescent", "UN OCHA"],
      date: "September 2023",
      icon: Waves,
      accentColor: "border-blue-600 bg-blue-50/40",
      badgeBg: "bg-blue-100 text-blue-900",
      badgeText: "Recent Calamity",
    },
    {
      id: "greece",
      title: "July 2023 Greece Rhodes Island Wildfire Evacuation",
      region: "Europe",
      category: "REPLAY",
      hazardType: "Extreme Wildfire Fronts",
      description: "Severe Mediterranean wildfire requiring evacuation of over 19,000 tourists from coastal resort corridors and threatening approaches to Lindos Acropolis and medieval castle perimeters.",
      sources: ["Hellenic Civil Protection (112)", "Hellenic Fire Service", "EU Emergency"],
      date: "July 2023",
      icon: Flame,
      accentColor: "border-red-600 bg-red-50/40",
      badgeBg: "bg-red-100 text-red-900",
      badgeText: "Recent Calamity",
    },
    {
      id: "brazil",
      title: "May 2024 Brazil Rio Grande do Sul Historic Flood Catastrophe",
      region: "Americas",
      category: "REPLAY",
      hazardType: "Catastrophic Basin Inundation",
      description: "Record 5.35-meter surge of the Guaíba River completely submerging Porto Alegre's historic colonial downtown, cultural institutions, and regional heritage corridors across 478 municipalities.",
      sources: ["Defesa Civil RS (199)", "CENAD Brasil", "Bombeiros 193"],
      date: "May 2024",
      icon: Waves,
      accentColor: "border-teal-600 bg-teal-50/40",
      badgeBg: "bg-teal-100 text-teal-900",
      badgeText: "Recent Calamity",
    },
  ];

  const filteredScenarios = scenarios.filter((sc) => {
    if (filterRegion === "ALL") return true;
    if (filterRegion === "INDIA") return sc.id === "india_live";
    if (filterRegion === "ASIA") return sc.region.includes("Asia") || sc.id === "nepal" || sc.id === "japan";
    if (filterRegion === "AFRICA") return sc.region.includes("Africa");
    if (filterRegion === "EUROPE") return sc.region.includes("Europe");
    if (filterRegion === "AMERICAS") return sc.region.includes("Americas");
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-300 overflow-hidden text-stone-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest-100 text-forest-800">
              <History size={20} />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-forest-950">
                Disaster Intelligence Context & Historical Replays
              </h3>
              <p className="text-xs text-stone-500">
                Select an operational scenario to demonstrate live India monitoring or recent global calamity portability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Region Filter Tabs */}
        <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {["ALL", "INDIA", "ASIA", "AFRICA", "EUROPE", "AMERICAS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterRegion(tab)}
              className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${
                filterRegion === tab
                  ? "bg-forest-800 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-200 border border-stone-200"
              }`}
            >
              {tab === "ALL" ? "All Scenarios" : tab}
            </button>
          ))}
        </div>

        {/* Scenarios Scrollable List */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
          {filteredScenarios.map((sc) => {
            const isSelected = currentScenario === sc.id;
            const Icon = sc.icon;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.id);
                  onClose();
                }}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? `${sc.accentColor} shadow-md scale-[1.01]`
                    : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/80"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 text-white ${
                    sc.id === "india_live"
                      ? "bg-forest-700"
                      : sc.id === "japan"
                      ? "bg-rose-700"
                      : sc.id === "morocco"
                      ? "bg-orange-700"
                      : sc.id === "libya"
                      ? "bg-blue-700"
                      : sc.id === "greece"
                      ? "bg-red-700"
                      : sc.id === "brazil"
                      ? "bg-teal-700"
                      : "bg-amber-600"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {sc.title}
                    </h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sc.badgeBg}`}>
                        {sc.badgeText}
                      </span>
                      {isSelected && (
                        <div className="p-1 rounded-full bg-forest-600 text-white shadow-xs">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                    <span className="font-semibold text-stone-500">{sc.date}</span>
                    <span className="text-stone-300">•</span>
                    {sc.sources.map((src, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 text-[11px] flex items-center gap-1">
            <AlertTriangle size={12} className="text-amber-500" />
            <span>Historical replays are strictly educational demonstrations</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 text-white hover:bg-stone-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
