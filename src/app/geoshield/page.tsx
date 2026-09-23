"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import GeoShieldMap from "@/components/geoshield/GeoShieldMap";
import AlertCenter from "@/components/geoshield/AlertCenter";
import HeritageExposurePanel from "@/components/geoshield/HeritageExposurePanel";
import LayerController, { ActiveLayersState } from "@/components/geoshield/LayerController";
import CellBroadcastSimulator from "@/components/geoshield/CellBroadcastSimulator";
import HistoricalReplayModal, { ScenarioId } from "@/components/geoshield/HistoricalReplayModal";
import DataFreshnessBadge from "@/components/geoshield/DataFreshnessBadge";
import monasteriesData from "@/data/monasteries.json";
import {
  DisasterEvent,
  OfficialAlert,
  SafePoint,
  HeritageExposureSummary,
} from "@/lib/geoshield/types";
import {
  ShieldAlert,
  Radio,
  History,
  Info,
  Layers,
  Landmark,
  FileCode,
  X,
  RotateCcw,
} from "lucide-react";

export default function GeoShieldPage() {
  const [scenario, setScenario] = useState<ScenarioId>("india_live");
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [alerts, setAlerts] = useState<OfficialAlert[]>([]);
  const [safePoints, setSafePoints] = useState<SafePoint[]>([]);
  const [heritageSites, setHeritageSites] = useState<any[]>(monasteriesData);
  const [exposureData, setExposureData] = useState<HeritageExposureSummary | null>(null);

  // Selection states
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Modals
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [broadcastAlert, setBroadcastAlert] = useState<OfficialAlert | null>(null);
  const [capXmlAlert, setCapXmlAlert] = useState<{ alert: OfficialAlert; xml: string } | null>(null);

  // Active Map Layers
  const [layers, setLayers] = useState<ActiveLayersState>({
    flood: true,
    landslide: true,
    weather: true,
    fire: true,
    heritage: true,
    safePoints: true,
    routes: true,
    precipitation: true,
  });

  // Mobile drawer panel toggle
  const [activeSidePanel, setActiveSidePanel] = useState<"alerts" | "exposure" | "layers">("exposure");

  const getCountryForScenario = (sc: ScenarioId) => {
    switch (sc) {
      case "japan": return "Japan";
      case "morocco": return "Morocco";
      case "libya": return "Libya";
      case "greece": return "Greece";
      case "brazil": return "Brazil";
      case "nepal": return "Nepal";
      default: return "India";
    }
  };

  const getBadgeInfo = (sc: ScenarioId) => {
    switch (sc) {
      case "japan": return { label: "Japan Noto Replay", source: "JMA / FDMA Japan" };
      case "morocco": return { label: "Morocco Atlas Replay", source: "Protection Civile Maroc" };
      case "libya": return { label: "Libya Derna Replay", source: "NCM / Red Crescent" };
      case "greece": return { label: "Greece Rhodes Replay", source: "Hellenic 112 / Civil Protection" };
      case "brazil": return { label: "Brazil Flood Replay", source: "Defesa Civil RS (CENAD)" };
      case "nepal": return { label: "Nepal GLOF Replay", source: "Nepal NDRRMA / DHM" };
      default: return { label: "India Live Feeds", source: "NDMA SACHET / ISRO NRSC" };
    }
  };

  // Load all GeoShield intelligence feeds
  const loadData = useCallback(async () => {
    try {
      const countryParam = getCountryForScenario(scenario);
      const [eventsRes, alertsRes, safeRes, sitesRes, exposureRes] = await Promise.all([
        fetch(`/api/geoshield/events?country=${countryParam}`).then((r) => r.json()),
        fetch(`/api/geoshield/alerts?country=${countryParam}`).then((r) => r.json()),
        fetch(`/api/geoshield/safe-points?country=${countryParam}`).then((r) => r.json()),
        fetch(`/api/heritage`).then((r) => r.json()),
        fetch(`/api/geoshield/heritage-exposure`).then((r) => r.json()),
      ]);

      if (eventsRes?.success) setEvents(eventsRes.events || []);
      if (alertsRes?.success) setAlerts(alertsRes.alerts || []);
      if (safeRes?.success) setSafePoints(safeRes.safe_points || []);
      if (sitesRes?.data && Array.isArray(sitesRes.data) && sitesRes.data.length > 0) {
        const combined = [...(monasteriesData as any[])];
        sitesRes.data.forEach((d: any) => {
          if (!combined.some((m: any) => m.id === d.id)) {
            combined.push(d);
          }
        });
        setHeritageSites(combined);
      } else {
        setHeritageSites(monasteriesData);
      }
      if (exposureRes?.success) setExposureData(exposureRes.summary || null);
    } catch (err) {
      console.error("[GeoShield] Error loading data:", err);
    }
  }, [scenario]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle CAP preview request
  const handlePreviewCap = async (alert: OfficialAlert) => {
    try {
      const res = await fetch("/api/geoshield/cap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", alert }),
      });
      const data = await res.json();
      if (data.success) {
        setCapXmlAlert({ alert, xml: data.xml });
      }
    } catch (err) {
      console.error("CAP generation error:", err);
    }
  };

  const badgeInfo = getBadgeInfo(scenario);
  const isHistorical = scenario !== "india_live";

  return (
    <div className="min-h-screen bg-parchment-100 flex flex-col font-sans">
      <Header />

      {/* GeoShield Headline Control Bar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 px-3 sm:px-6 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Left: GeoShield Brand + Live Pill */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-stone-800 border border-stone-700 text-red-500 shadow-xs">
              <ShieldAlert size={16} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-sm tracking-wide text-parchment-100">
                GeoShield
              </h1>
              {!isHistorical ? (
                <span
                  className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-xs"
                  style={{
                    backgroundColor: "#145C45",
                    color: "#FFFFFF",
                    border: "1px solid #145C45",
                  }}
                >
                  LIVE
                </span>
              ) : (
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse">
                  {badgeInfo.label}
                </span>
              )}
            </div>
            <span className="text-stone-600 hidden lg:inline">•</span>
            <p className="text-[11px] text-stone-400 hidden lg:block truncate">
              Spatial Risk & Safety Intelligence
            </p>
          </div>

          {/* Right: Data Freshness Badge & Actions */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <DataFreshnessBadge
              source={badgeInfo.source}
              timestamp={new Date().toISOString()}
            />

            <button
              onClick={() => setShowReplayModal(true)}
              className="px-2.5 py-1 rounded-lg border border-stone-700 hover:border-amber-400 bg-stone-800/90 text-stone-200 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1 shrink-0"
              title="Switch Calamity Scenario"
            >
              <History size={12} className="text-amber-400" />
              <span>Scenario</span>
            </button>

            <button
              onClick={() =>
                setBroadcastAlert(
                  alerts[0] || {
                    id: "demo",
                    headline: "URGENT MONSOON LANDSLIDE ADVISORY",
                    description: "Slope movement alert on NH-58 pilgrimage route near Joshimath.",
                    severity: "Severe",
                    urgency: "Immediate",
                    certainty: "Likely",
                    source_name: badgeInfo.source,
                    country: getCountryForScenario(scenario),
                    is_official: true,
                    fetched_at: new Date().toISOString(),
                  }
                )
              }
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-[11px] font-semibold flex items-center gap-1 shrink-0 shadow-xs"
              title="Simulate Cell Alert Broadcast"
            >
              <Radio size={12} />
              <span>Simulate Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-3.5">
        {/* Left Column: Interactive Map */}
        <section className="flex-1 flex flex-col min-h-[550px] lg:min-h-[700px] relative">
          {/* Historical Replay Banner if in International Calamity Mode */}
          {isHistorical && (
            <div className="mb-2 p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <History size={16} className="shrink-0" />
                <span className="truncate">
                  HISTORICAL REPLAY MODE: {badgeInfo.label} — Demonstrating Cross-Border Provider Portability
                </span>
              </div>
              <button
                onClick={() => setScenario("india_live")}
                className="px-3 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold hover:bg-black transition-colors shrink-0 flex items-center gap-1 ml-2"
              >
                <RotateCcw size={11} />
                <span>Return to India Live</span>
              </button>
            </div>
          )}

          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md">
            <GeoShieldMap
              events={events}
              alerts={alerts}
              safePoints={safePoints}
              heritageSites={heritageSites}
              layers={layers}
              selectedSiteId={selectedSiteId}
              selectedEventId={selectedEventId}
              scenario={scenario}
              onSelectSite={(site) => setSelectedSiteId(site.id)}
              onSelectEvent={(ev) => setSelectedEventId(ev.id)}
            />
          </div>
        </section>

        {/* Right Column: Layer Controls, Sites & Risk & Alert Center */}
        <aside className="w-full lg:w-[415px] flex flex-col gap-3 shrink-0">
          {/* Site Safety Dossier (Interactive details when an advisory site or map monument is clicked) */}
          {selectedSiteId && (() => {
            const activeSite = heritageSites.find((s) => s.id === selectedSiteId);
            const siteName = activeSite?.name?.en || activeSite?.name_en || selectedSiteId;
            const siteState = activeSite?.state || activeSite?.district || "India";
            const intersectingEvent = events.find(
              (e) => Array.isArray(e.affected_heritage_ids) && e.affected_heritage_ids.includes(selectedSiteId)
            );

            return (
              <div className="p-3.5 rounded-2xl bg-white border-2 border-forest-600 shadow-lg space-y-2.5 animate-scale-up">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-forest-800 text-white shadow-xs">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider">
                        Site Safety Dossier
                      </span>
                      <h3 className="font-serif font-bold text-sm text-stone-900 leading-tight">
                        {siteName}
                      </h3>
                      <p className="text-[11px] text-stone-500">{siteState}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSiteId(null)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                    title="Close dossier"
                  >
                    <X size={16} />
                  </button>
                </div>

                {intersectingEvent ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <ShieldAlert size={14} className="shrink-0 text-amber-600" />
                      <span>{intersectingEvent.severity} ALERT: {intersectingEvent.title}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-900">
                      Active hazard perimeter detected. Avoid low-lying riverbank routes and shelter in sturdy stone masonry structures.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <span className="text-xs">✅</span>
                      <span>Normal Regional Status (Verified Safe)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      No active flood inundation or landslide hazards intersect this sector. Normal pilgrimage and visitor access open.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("open-parth", {
                            detail: {
                              query: `I am at ${siteName}. Is it safe right now and what is the emergency egress guidance?`,
                              siteId: selectedSiteId,
                              country: getCountryForScenario(scenario),
                            },
                          })
                        );
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-forest-800 text-white text-xs font-bold hover:bg-forest-900 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Radio size={14} />
                    <span>Ask PARTH Guidance for {siteName}</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Panel Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-parchment-200/80 p-1 rounded-xl border border-parchment-300 text-xs font-semibold">
            <button
              onClick={() => setActiveSidePanel("exposure")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSidePanel === "exposure"
                  ? "bg-white text-forest-950 shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Landmark size={13} />
              <span>Sites & Risk</span>
            </button>
            <button
              onClick={() => setActiveSidePanel("alerts")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSidePanel === "alerts"
                  ? "bg-white text-forest-950 shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShieldAlert size={13} />
              <span>Alert Centre</span>
            </button>
            <button
              onClick={() => setActiveSidePanel("layers")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeSidePanel === "layers"
                  ? "bg-white text-forest-950 shadow-xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers size={13} />
              <span>Layers</span>
            </button>
          </div>

          {/* Active Side Panel Content */}
          {activeSidePanel === "exposure" && (
            <HeritageExposurePanel
              exposureData={exposureData}
              selectedSiteId={selectedSiteId}
              onFocusSite={(id) => setSelectedSiteId(id)}
            />
          )}

          {activeSidePanel === "alerts" && (
            <AlertCenter
              alerts={alerts}
              onTriggerCellBroadcast={(a) => setBroadcastAlert(a)}
              onPreviewCap={(a) => handlePreviewCap(a)}
            />
          )}

          {activeSidePanel === "layers" && (
            <LayerController layers={layers} onChange={(l) => setLayers(l)} />
          )}

          {/* Quick Authority Attribution Card */}
          <div className="p-2.5 rounded-xl bg-white/95 border border-stone-200 text-[10px] text-stone-600 space-y-0.5 shadow-xs">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <Info size={11} className="text-forest-700 shrink-0" />
              <span>Authority & Compliance Notice</span>
            </div>
            <p className="leading-snug text-stone-500">
              Informational decision-support only. Official warnings: NDMA SACHET (CAP-AU), IMD Mausam & SEOCs.
            </p>
          </div>
        </aside>
      </main>

      {/* Cell Broadcast Simulator Modal */}
      {broadcastAlert && (
        <CellBroadcastSimulator
          headline={broadcastAlert.headline}
          instruction={broadcastAlert.instruction}
          source={broadcastAlert.source_name}
          severity={broadcastAlert.severity}
          onClose={() => setBroadcastAlert(null)}
        />
      )}

      {/* Historical Replay Selector Modal */}
      {showReplayModal && (
        <HistoricalReplayModal
          currentScenario={scenario}
          onSelectScenario={(sc) => setScenario(sc)}
          onClose={() => setShowReplayModal(false)}
        />
      )}

      {/* CAP 1.2 XML Preview Modal */}
      {capXmlAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-parchment-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-parchment-200 bg-parchment-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode size={18} className="text-forest-800" />
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  OASIS CAP 1.2 Standard Alert Payload
                </h3>
              </div>
              <button
                onClick={() => setCapXmlAlert(null)}
                className="p-1.5 rounded-lg hover:bg-parchment-200 text-stone-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-stone-950 text-emerald-400 font-mono text-[11px] leading-relaxed">
              <pre>{capXmlAlert.xml}</pre>
            </div>
            <div className="p-3 bg-parchment-100 border-t border-parchment-200 flex justify-end">
              <button
                onClick={() => setCapXmlAlert(null)}
                className="px-4 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-semibold hover:bg-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
