"use client";

import React from "react";
import { Layers, Waves, Mountain, CloudRain, Flame, Landmark, ShieldCheck, Navigation } from "lucide-react";

export interface ActiveLayersState {
  flood: boolean;
  landslide: boolean;
  weather: boolean;
  fire: boolean;
  heritage: boolean;
  safePoints: boolean;
  routes: boolean;
  precipitation: boolean;
}

interface LayerControllerProps {
  layers: ActiveLayersState;
  onChange: (updated: ActiveLayersState) => void;
}

export default function LayerController({ layers, onChange }: LayerControllerProps) {
  const toggle = (key: keyof ActiveLayersState) => {
    onChange({ ...layers, [key]: !layers[key] });
  };

  const layerItems: { key: keyof ActiveLayersState; label: string; icon: any; color: string; source: string }[] = [
    {
      key: "landslide",
      label: "Landslide Corridors",
      icon: Mountain,
      color: "text-amber-600",
      source: "ISRO / NRSC",
    },
    {
      key: "flood",
      label: "Flood & River Inundation",
      icon: Waves,
      color: "text-blue-600",
      source: "CWC / ISRO",
    },
    {
      key: "weather",
      label: "Severe Weather Warnings",
      icon: CloudRain,
      color: "text-sky-600",
      source: "IMD / Open-Meteo",
    },
    {
      key: "fire",
      label: "Forest Fire Hotspots",
      icon: Flame,
      color: "text-orange-600",
      source: "FSI (Van Agni)",
    },
    {
      key: "precipitation",
      label: "Satellite Precipitation",
      icon: CloudRain,
      color: "text-indigo-600",
      source: "NASA GPM / IMD",
    },
    {
      key: "heritage",
      label: "Heritage Sites & Monuments",
      icon: Landmark,
      color: "text-forest-700",
      source: "SYNTAXUS Atlas",
    },
    {
      key: "safePoints",
      label: "Verified Safe Shelters",
      icon: ShieldCheck,
      color: "text-emerald-600",
      source: "Disaster Shelters / EOC",
    },
    {
      key: "routes",
      label: "Lower-Risk Travel Corridors",
      icon: Navigation,
      color: "text-purple-600",
      source: "OSRM Evaluator",
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-md p-3.5 space-y-2.5">
      <div className="flex items-center gap-2 border-b border-parchment-200 pb-2">
        <Layers size={16} className="text-forest-800" />
        <span className="font-serif text-xs font-bold text-forest-950 uppercase tracking-wider">
          Intelligence Layers
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {layerItems.map((item) => {
          const Icon = item.icon;
          const isActive = layers[item.key];

          return (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-forest-50/70 border-forest-300 text-forest-950 shadow-2xs font-semibold"
                  : "bg-parchment-50/50 border-parchment-200 text-stone-500 hover:bg-stone-50"
              }`}
            >
              <Icon size={15} className={`shrink-0 ${item.color} ${isActive ? "opacity-100" : "opacity-40"}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate leading-tight text-[11px]">{item.label}</div>
                <div className="text-[9px] text-stone-400 truncate">{item.source}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
