"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Mountain,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Download,
  Calendar,
  Route,
  AlertCircle,
  ArrowRight,
  Shield,
  BookOpen,
} from "lucide-react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import fallbackMonasteries from "@/data/monasteries.json";
import fallbackTrails from "@/data/trails.json";
import { useI18n } from "@/lib/i18n";

interface ItineraryItem {
  monasteryId: string;
  day: number;
}

export default function PlanPage() {
  const { language, t } = useI18n();
  const [monasteriesList, setMonasteriesList] = useState<any[]>(fallbackMonasteries);
  const [trailsList, setTrailsList] = useState<any[]>(fallbackTrails);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [activeTrail, setActiveTrail] = useState<string | null>(null);
  const activeTrailObj = trailsList.find((t) => t.id === activeTrail);

  useEffect(() => {
    async function loadPlanData() {
      try {
        const [sitesRes, circuitsRes] = await Promise.all([
          fetch("/api/heritage", { cache: "no-store" }),
          fetch("/api/circuits", { cache: "no-store" }),
        ]);
        if (sitesRes.ok) {
          const sJson = await sitesRes.json();
          if (sJson.data && sJson.data.length > 0) setMonasteriesList(sJson.data);
        }
        if (circuitsRes.ok) {
          const cJson = await circuitsRes.json();
          if (cJson.data && cJson.data.length > 0) {
            setTrailsList(cJson.data);
            if (itinerary.length === 0 && cJson.data[0]) {
              const first = cJson.data[0];
              setActiveTrail(first.id);
              const rawStops: string[] = [];
              if (first.stops && first.stops.length > 0) {
                first.stops.forEach((s: any) => {
                  const id = s.siteId || s.monasteryId;
                  if (id && !rawStops.includes(id)) rawStops.push(id);
                });
              } else if (first.monasteries && first.monasteries.length > 0) {
                first.monasteries.forEach((id: string) => {
                  if (id && !rawStops.includes(id)) rawStops.push(id);
                });
              }
              setItinerary(rawStops.map((mId: string, i: number) => ({ monasteryId: mId, day: Math.ceil((i + 1) / 2) })));
            }
          }
        }
      } catch (e) {
        console.warn("Using fallback data on plan page:", e);
      }
    }
    loadPlanData();
  }, []);

  const addToItinerary = (monasteryId: string) => {
    if (itinerary.find((i) => i.monasteryId === monasteryId)) return;
    const day = itinerary.length > 0 ? itinerary[itinerary.length - 1].day : 1;
    setItinerary([...itinerary, { monasteryId, day }]);
  };

  const removeFromItinerary = (monasteryId: string) => {
    setItinerary(itinerary.filter((i) => i.monasteryId !== monasteryId));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItinerary = [...itinerary];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItinerary.length) return;
    [newItinerary[index], newItinerary[swapIndex]] = [
      newItinerary[swapIndex],
      newItinerary[index],
    ];
    setItinerary(newItinerary);
  };

  const loadTrail = (trailId: string) => {
    const trail = trailsList.find((t) => t.id === trailId);
    if (!trail) return;
    setActiveTrail(trailId);
    
    // Deduplicate stops to prevent any double-listing
    const rawStops: string[] = [];
    if (trail.stops && trail.stops.length > 0) {
      trail.stops.forEach((s: any) => {
        const id = s.siteId || s.monasteryId;
        if (id && !rawStops.includes(id)) rawStops.push(id);
      });
    } else if (trail.monasteries && trail.monasteries.length > 0) {
      trail.monasteries.forEach((id: string) => {
        if (id && !rawStops.includes(id)) rawStops.push(id);
      });
    }

    const items: ItineraryItem[] = rawStops.map((mId: string, i: number) => ({
      monasteryId: mId,
      day: Math.ceil((i + 1) / 2),
    }));
    setItinerary(items);
  };

  const totalDistance = itinerary.reduce((total, item, index) => {
    if (index === 0) return 0;
    const prevM = monasteriesList.find((m) => m.id === itinerary[index - 1].monasteryId);
    const currM = monasteriesList.find((m) => m.id === item.monasteryId);
    if (!prevM || !currM || !prevM.location || !currM.location) return total;
    const dist = Math.sqrt(
      Math.pow((currM.location.lat - prevM.location.lat) * 111, 2) +
      Math.pow((currM.location.lng - prevM.location.lng) * 85, 2)
    );
    return total + dist;
  }, 0);

  return (
    <>
      <Header />
      <main className="flex-1 pb-24">
        <div className="section-padding max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest-700 mb-2">
            {t("plan.title")}
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            {t("plan.subtitle")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Trail suggestions + monastery picker */}
            <div className="lg:col-span-1 space-y-6">
              {/* Suggested trails */}
              <div>
                <h3 className="font-heading font-semibold text-forest-700 mb-3 flex items-center gap-2">
                  <Route size={16} className="text-saffron-500" />
                  {t("plan.circuitsHeading")}
                </h3>
                <div className="space-y-2">
                  {trailsList.map((trail) => {
                    const cName = typeof trail.name === "string" ? trail.name : (language === "hi" && trail.name?.hi ? trail.name.hi : trail.name?.en || trail.id);
                    return (
                      <button
                        key={trail.id}
                        onClick={() => loadTrail(trail.id)}
                        className={`w-full text-left p-3 rounded-heritage border transition-all min-h-[48px] ${
                          activeTrail === trail.id
                            ? "border-forest-500 bg-forest-50"
                            : "border-parchment-200 bg-parchment-50 hover:border-forest-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-forest-700">
                            {cName}
                          </h4>
                          {(trail as any).region && (
                            <span className="text-[10px] bg-saffron-100 text-saffron-800 font-bold px-2 py-0.5 rounded-full">
                              {(trail as any).region}
                            </span>
                          )}
                        </div>
                        {(() => {
                          const stopCount = (trail.stops && trail.stops.length > 0)
                            ? trail.stops.length
                            : (trail.monasteries ? trail.monasteries.length : 0);
                          return (
                            <p className="text-[11px] text-stone-500 font-medium mt-1">
                              {trail.distance || trail.totalDistance || "240 km"} · {trail.duration || trail.estimatedTime || "3 Days"} · {stopCount} {language === "hi" ? "स्टॉप" : (stopCount === 1 ? "Stop" : "Stops")}
                            </p>
                          );
                        })()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add monasteries */}
              <div>
                <h3 className="font-heading font-semibold text-forest-700 mb-3">
                  {t("plan.addSites")}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {monasteriesList.map((m) => {
                    const mName = typeof m.name === "string" ? m.name : (language === "hi" && m.name?.hi ? m.name.hi : m.name?.en || m.id);
                    const inItinerary = itinerary.some(
                      (i) => i.monasteryId === m.id
                    );
                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-parchment-100 transition"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                          <Image
                            src={m.heroImage || `/images/monasteries/${m.id}.png`}
                            alt={mName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 truncate">
                            {mName}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {m.district} · {m.altitude}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            inItinerary
                              ? removeFromItinerary(m.id)
                              : addToItinerary(m.id)
                          }
                          className={`p-2 rounded-lg transition min-h-[40px] min-w-[40px] flex items-center justify-center ${
                            inItinerary
                              ? "bg-forest-100 text-forest-700"
                              : "bg-parchment-100 text-stone-400 hover:text-forest-600"
                          }`}
                        >
                          {inItinerary ? (
                            <X size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Itinerary builder */}
            <div className="lg:col-span-2">
              <div className="heritage-border bg-parchment-50 p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-semibold text-forest-700 text-lg">
                        {t("plan.yourItinerary")}
                      </h3>
                      {activeTrailObj && (
                        <span className="text-xs bg-forest-100 text-forest-800 font-bold px-2.5 py-0.5 rounded-full border border-forest-200">
                          {typeof activeTrailObj.name === "string" ? activeTrailObj.name : (language === "hi" && activeTrailObj.name?.hi ? activeTrailObj.name.hi : activeTrailObj.name?.en || activeTrailObj.id)}
                        </span>
                      )}
                    </div>
                    {activeTrailObj?.description && (
                      <p className="text-xs text-stone-600 mt-1 max-w-xl line-clamp-2">
                        {activeTrailObj.description}
                      </p>
                    )}
                    {itinerary.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-stone-400 mt-1.5">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          ~{Math.round(totalDistance)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Mountain size={12} />
                          {itinerary.length} {t("plan.stops")}
                        </span>
                      </div>
                    )}
                  </div>
                  {itinerary.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/offline"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition"
                      >
                        <Download size={13} />
                        {t("plan.downloadOffline")}
                      </Link>
                      {itinerary[0] && (
                        <Link
                          href={`/monastery/${itinerary[0].monasteryId}/etiquette`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-semibold shadow-xs transition"
                        >
                          <Shield size={13} />
                          {t("plan.reviewEtiquette")}
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                {itinerary.length === 0 ? (
                  <div className="text-center py-12 text-stone-400">
                    <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium mb-1">
                      {t("plan.noStops")}
                    </p>
                    <p className="text-xs">
                      {t("plan.noStopsHint")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itinerary.map((item, index) => {
                      const m = monasteriesList.find(
                        (m) => m.id === item.monasteryId
                      );
                      if (!m) return null;
                      const mName = typeof m.name === "string" ? m.name : (language === "hi" && m.name?.hi ? m.name.hi : m.name?.en || m.id);
                      return (
                        <div
                          key={item.monasteryId}
                          className="flex gap-4 items-start"
                        >
                          {/* Timeline dot */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-forest-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {index + 1}
                            </div>
                            {index < itinerary.length - 1 && (
                              <div className="w-0.5 h-12 bg-forest-200 mt-1" />
                            )}
                          </div>

                          {/* Card */}
                          <div className="flex-1 bg-white rounded-heritage border border-parchment-200 p-3.5 shadow-card">
                            <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0">
                                <Image
                                  src={m.heroImage || `/images/monasteries/${m.id}.png`}
                                  alt={mName}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <Link
                                      href={`/heritage/${m.id}`}
                                      className="text-sm font-semibold text-forest-700 hover:underline min-h-0 block"
                                    >
                                      {mName}
                                    </Link>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                      {m.district}, {m.state || "India"} · {m.sect} · {m.altitude}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 ml-2">
                                    <button
                                      onClick={() => moveItem(index, "up")}
                                      disabled={index === 0}
                                      className="p-1 rounded hover:bg-parchment-100 disabled:opacity-20 min-h-0 min-w-0"
                                      aria-label="Move stop up"
                                    >
                                      <ChevronUp size={14} />
                                    </button>
                                    <button
                                      onClick={() => moveItem(index, "down")}
                                      disabled={index === itinerary.length - 1}
                                      className="p-1 rounded hover:bg-parchment-100 disabled:opacity-20 min-h-0 min-w-0"
                                      aria-label="Move stop down"
                                    >
                                      <ChevronDown size={14} />
                                    </button>
                                    <button
                                      onClick={() => removeFromItinerary(item.monasteryId)}
                                      className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 min-h-0 min-w-0 ml-1"
                                      aria-label="Remove stop"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2 mt-1 text-[10px] text-stone-400">
                                  <span>
                                    <Clock size={10} className="inline mr-0.5" />
                                    {m.visitingHours?.open || "06:00"}–{m.visitingHours?.close || "18:00"}
                                  </span>
                                </div>

                                {/* Action Buttons: Review Etiquette & Download Offline */}
                                <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-parchment-100">
                                  <Link
                                    href={`/monastery/${m.id}/etiquette`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-saffron-50 hover:bg-saffron-100 text-saffron-800 text-[11px] font-semibold transition border border-saffron-200"
                                  >
                                    <Shield size={12} className="text-saffron-700" />
                                    {t("plan.reviewEtiquette")}
                                  </Link>
                                  <Link
                                    href="/offline"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 hover:bg-forest-100 text-forest-800 text-[11px] font-semibold transition border border-forest-200"
                                  >
                                    <Download size={12} className="text-forest-700" />
                                    {t("plan.downloadOffline")}
                                  </Link>
                                  <Link
                                    href={`/heritage/${m.id}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-100 text-stone-700 text-[11px] font-medium transition border border-stone-200 ml-auto"
                                  >
                                    {t("plan.exploreSite")}
                                    <ArrowRight size={11} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
