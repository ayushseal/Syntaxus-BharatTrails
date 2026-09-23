"use client";

import React, { useState } from "react";
import { Landmark, ShieldAlert, ChevronRight, Building, Compass } from "lucide-react";
import { HeritageExposureSummary } from "@/lib/geoshield/types";

interface HeritageExposurePanelProps {
  exposureData: HeritageExposureSummary | null;
  selectedSiteId?: string | null;
  onFocusSite?: (siteId: string) => void;
}

export default function HeritageExposurePanel({
  exposureData,
  selectedSiteId,
  onFocusSite,
}: HeritageExposurePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!exposureData) {
    return (
      <div className="p-4 rounded-xl bg-white/80 border border-parchment-300 text-stone-500 text-xs text-center">
        Loading regional sites status matrix...
      </div>
    );
  }

  const allCategories = exposureData.breakdown_by_category || [];
  const totalExposed = exposureData.exposed_sites_count;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-md p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-parchment-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-saffron-100 text-saffron-800">
            <Landmark size={18} />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-forest-950">
              Regional Sites & Monument Risk Status
            </h3>
            <p className="text-[11px] text-stone-500">
              Active spatial monitoring of regional monuments, monasteries & corridors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <ShieldAlert size={13} className="text-amber-600" />
          <span>{totalExposed} Monitored Sites</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
            selectedCategory === "ALL"
              ? "bg-forest-800 text-white shadow-xs"
              : "bg-parchment-100 text-stone-600 hover:bg-parchment-200"
          }`}
        >
          All Sites ({totalExposed})
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === cat.category
                ? "bg-forest-800 text-white shadow-xs"
                : "bg-parchment-100 text-stone-600 hover:bg-parchment-200"
            }`}
          >
            <span>{cat.category.replace(/_/g, " ")}</span>
            <span className="opacity-75 font-normal">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* List of Sites */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {allCategories
          .filter((c) => selectedCategory === "ALL" || c.category === selectedCategory)
          .flatMap((c) => c.sites.map((s) => ({ ...s, category: c.category })))
          .map((site) => {
            const isSelected = selectedSiteId === site.id;
            return (
              <div
                key={site.id}
                onClick={() => onFocusSite && onFocusSite(site.id)}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-forest-100/80 border-forest-600 ring-2 ring-forest-500/40 shadow-sm"
                    : "border-parchment-200 bg-parchment-50/60 hover:bg-forest-50/50 hover:border-forest-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border text-stone-600 ${
                    isSelected ? "bg-forest-700 text-white border-forest-800" : "bg-white border-parchment-200 group-hover:text-forest-700"
                  }`}>
                    <Building size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-forest-950">
                      {site.name}
                    </h4>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                      {site.category.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      site.severity === "RED"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : site.severity === "ORANGE"
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {site.severity === "RED" ? "Restricted" : site.severity === "ORANGE" ? "Warning" : "Advisory"}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${
                      isSelected ? "text-forest-800 translate-x-0.5" : "text-stone-400 group-hover:text-forest-700 group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </div>
            );
          })}

        {totalExposed === 0 && (
          <div className="py-6 text-center text-xs text-stone-500">
            <Compass size={24} className="mx-auto text-stone-400 mb-1.5" />
            No heritage monuments currently intersect high-risk disaster boundaries.
          </div>
        )}
      </div>
    </div>
  );
}
