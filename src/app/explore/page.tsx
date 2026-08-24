"use client";

import { useState, useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import Image from "next/image";
import {
  Map as MapIcon,
  List,
  Filter,
  Eye,
  X,
  ChevronRight,
  Phone,
  Search,
  Building,
  Layers,
} from "lucide-react";
import Header from "@/components/layout/Header";
import MonasteryCard from "@/components/monastery/MonasteryCard";
import monasteries from "@/data/monasteries.json";
import { useI18n } from "@/lib/i18n";
import { searchHeritageMonuments } from "@/lib/searchEngine";

type ViewMode = "map" | "list";
type MapStyle = "osm" | "voyager" | "dark-matter";

const MAP_STYLES: Array<{ id: MapStyle; label: string; icon: string }> = [
  { id: "osm", label: "OpenTopoMap (Topological)", icon: "🏞️" },
  { id: "voyager", label: "Voyager (Bright)", icon: "🗺️" },
  { id: "dark-matter", label: "Dark Matter (Night)", icon: "🌙" },
];

const TILE_URLS: Record<MapStyle, string[]> = {
  osm: [
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ],
  voyager: [
    "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
  ],
  "dark-matter": [
    "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  ],
};

const REGIONS = [
  { id: "all", label: "All India" },
  { id: "Northern Frontiers", label: "Northern Frontiers" },
  { id: "Eastern Corridors", label: "Eastern Corridors" },
  { id: "North-Eastern", label: "North-Eastern" },
  { id: "Western & Central", label: "Western & Central" },
  { id: "Southern Peninsula", label: "Southern Peninsula" },
];

const STATES = [
  "All States",
  "Delhi",
  "West Bengal",
  "Sikkim",
  "Madhya Pradesh",
  "Chhattisgarh",
  "Bihar",
  "Odisha",
  "Uttar Pradesh",
  "Karnataka",
  "Rajasthan",
  "Kerala",
  "Tamil Nadu",
  "Maharashtra",
  "Gujarat",
  "Andhra Pradesh",
  "Telangana",
  "Arunachal Pradesh",
  "Tripura",
  "Meghalaya",
  "Ladakh",
  "Uttarakhand",
  "Manipur",
];

const STATE_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  Delhi: { center: [77.21, 28.56], zoom: 11 },
  "West Bengal": { center: [88.36, 24.8], zoom: 7.2 },
  Sikkim: { center: [88.45, 27.32], zoom: 9.2 },
  "Madhya Pradesh": { center: [77.74, 23.48], zoom: 8 },
  Chhattisgarh: { center: [82.0, 21.5], zoom: 7.2 },
  Bihar: { center: [85.44, 25.14], zoom: 8.5 },
  Odisha: { center: [85.82, 20.29], zoom: 7.8 },
  "Uttar Pradesh": { center: [82.0, 26.0], zoom: 7.2 },
  Karnataka: { center: [76.0, 15.0], zoom: 7.5 },
  Rajasthan: { center: [73.5, 26.5], zoom: 7.2 },
  Kerala: { center: [75.8, 11.5], zoom: 7.8 },
  "Tamil Nadu": { center: [78.5, 10.5], zoom: 7.5 },
  Maharashtra: { center: [75.7, 19.5], zoom: 7.2 },
  Gujarat: { center: [70.21, 23.88], zoom: 7.5 },
  "Andhra Pradesh": { center: [78.28, 14.81], zoom: 8 },
  Telangana: { center: [78.48, 17.38], zoom: 8.2 },
  "Arunachal Pradesh": { center: [92.5, 27.5], zoom: 7.8 },
  Tripura: { center: [91.8, 23.8], zoom: 8.5 },
  Meghalaya: { center: [91.67, 25.4], zoom: 8.5 },
  Ladakh: { center: [77.5, 34.5], zoom: 7.5 },
  Uttarakhand: { center: [79.5, 30.5], zoom: 8 },
  Manipur: { center: [93.8, 24.6], zoom: 8.5 },
};

const REGION_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  "Northern Frontiers": { center: [77.2, 29.5], zoom: 6 },
  "Eastern Corridors": { center: [86.5, 24.0], zoom: 6.5 },
  "North-Eastern": { center: [91.5, 26.5], zoom: 6.5 },
  "Western & Central": { center: [74.5, 22.0], zoom: 6 },
  "Southern Peninsula": { center: [78.5, 13.0], zoom: 6 },
};

export default function ExplorePage() {
  const { language, t } = useI18n();
  const [monasteriesList, setMonasteriesList] = useState<any[]>(monasteries);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [currentStyle, setCurrentStyle] = useState<MapStyle>("osm");
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [selectedMonastery, setSelectedMonastery] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Load live sites from API
  useEffect(() => {
    async function loadLiveSites() {
      try {
        const res = await fetch("/api/heritage", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setMonasteriesList(json.data);
          }
        }
      } catch (e) {
        console.warn("Using fallback sites on explore:", e);
      }
    }
    loadLiveSites();
  }, []);

  // Scroll position on return (default view is always map)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const target = sessionStorage.getItem("explore_scroll_target");
      if (target) {
        sessionStorage.removeItem("explore_scroll_target");
        setTimeout(() => {
          const el = document.getElementById(`card-${target}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-4", "ring-saffron-400", "rounded-2xl", "transition-all", "duration-700");
            setTimeout(() => {
              el.classList.remove("ring-4", "ring-saffron-400");
            }, 3000);
          }
        }, 300);
      }
    }
  }, []);

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("explore_view_mode", mode);
    }
    if (mode === "map" && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 100);
    }
  };

  const searchFiltered = searchQuery.trim()
    ? searchHeritageMonuments(searchQuery, monasteriesList)
    : monasteriesList;

  const filteredMonasteries = searchFiltered.filter((m) => {
    const monumentState = ((m as any).state || "").trim().toLowerCase();
    const targetState = selectedState.trim().toLowerCase();

    // Match state accurately
    const matchesState =
      selectedState === "All States" ||
      monumentState === targetState;

    // Match region (only applied if "All States" is selected)
    const matchesRegion =
      selectedState !== "All States" ||
      selectedRegion === "all" ||
      (m as any).region === selectedRegion;

    return matchesState && matchesRegion;
  });

  const selected = selectedMonastery
    ? monasteriesList.find((m) => m.id === selectedMonastery)
    : null;

  const filteredRef = useRef(filteredMonasteries);
  filteredRef.current = filteredMonasteries;

  const createMapStyle = (styleKey: MapStyle) => {
    const tiles = TILE_URLS[styleKey] || TILE_URLS.osm;
    return {
      version: 8,
      sources: {
        "raster-tiles": {
          type: "raster",
          tiles: tiles,
          tileSize: 256,
          attribution:
            '&copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: "raster-layer",
          type: "raster",
          source: "raster-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  };

  const createPopupContent = (monastery: any) => {
    const nameStr = typeof monastery.name === "string" ? monastery.name : monastery.name?.en || monastery.id;
    const stateStr = monastery.state || "India";
    const districtStr = monastery.district || "";
    const sectStr = monastery.sect || "";
    const altitudeStr = monastery.altitude || "";
    const phoneStr = monastery.contact?.phone || "";
    const heroImg = monastery.heroImage || `/images/monasteries/${monastery.id}.png`;
    const has360 = Boolean(monastery.virtualTourEnabled ?? monastery.virtualTour?.available ?? true);

    const div = document.createElement("div");
    div.className = "heritage-border bg-[#FDFBF7]/98 backdrop-blur-md p-3.5 shadow-2xl rounded-2xl border-2 border-amber-500 w-[310px] sm:w-[340px] text-stone-800 animate-fade-in";

    div.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-2 pr-6">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            ${stateStr}
          </span>
          <span class="text-[10px] text-stone-500 font-medium truncate">
            ${districtStr}
          </span>
        </div>
      </div>
      <div class="flex gap-3 items-center">
        <div class="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-300 shadow-xs" style="width: 64px; height: 64px;">
          <img src="${heroImg}" alt="${nameStr}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/monasteries/rumtek.png'" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-[#1B4332] text-sm leading-snug line-clamp-2" style="font-family: inherit;">
            ${nameStr}
          </h3>
          <p class="text-[11px] text-stone-600 font-medium truncate mt-0.5">
            ${sectStr}${altitudeStr ? ` · ${altitudeStr}` : ""}
          </p>
          ${phoneStr ? `
            <a href="tel:${phoneStr}" class="inline-flex items-center gap-1 text-[11px] text-[#2D8A54] font-semibold mt-0.5 hover:underline">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${phoneStr}
            </a>
          ` : ""}
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <a href="/heritage/${monastery.id}" class="flex-1 bg-[#1B4332] hover:bg-[#2D8A54] text-white text-xs font-bold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1 shadow-sm transition-all" style="text-decoration: none;">
          <span>View Profile</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </a>
        ${has360 ? `
          <a href="/monastery/${monastery.id}/virtual" class="bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold py-2 px-3 rounded-lg text-center flex items-center justify-center gap-1 shadow-sm transition-all" style="text-decoration: none;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>360°</span>
          </a>
        ` : ""}
      </div>
    `;

    return div;
  };

  // Initialize Map
  useEffect(() => {
    if (viewMode !== "map" || !mapContainerRef.current) return;

    let isSubscribed = true;

    const initMap = async () => {
      try {
        const maplibreglModule = await import("maplibre-gl");
        const maplibregl = (maplibreglModule as any).default || maplibreglModule;

        if (!isSubscribed || !mapContainerRef.current) return;

        if (mapRef.current) {
          mapRef.current.resize();
          return;
        }

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: createMapStyle(currentStyle),
          center: [79.5, 23.0],
          zoom: 4.8,
          minZoom: 3.5,
          maxZoom: 18,
          attributionControl: false,
        });

        mapRef.current = map;

        const renderMarkers = () => {
          if (!isSubscribed || !map) return;

          markersRef.current.forEach((m) => m.remove());
          markersRef.current = [];

          const items = filteredRef.current;
          items.forEach((monastery) => {
            const lat = monastery.location?.lat ?? monastery.latitude;
            const lng = monastery.location?.lng ?? monastery.longitude;
            if (typeof lat !== "number" || typeof lng !== "number") return;

            const el = document.createElement("div");
            el.className = "cursor-pointer group";
            el.setAttribute("data-monastery-id", monastery.id);

            el.innerHTML = `
              <div class="relative flex items-center justify-center">
                <div class="w-9 h-9 rounded-full bg-forest-700 border-2 border-saffron-400 shadow-heritage flex items-center justify-center transform group-hover:scale-125 transition-transform duration-200">
                  <span class="text-saffron-300 font-bold text-xs">☸</span>
                </div>
                <div class="absolute -bottom-1 w-2 h-2 bg-saffron-500 rotate-45"></div>
              </div>
            `;

            const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
              .setLngLat([lng, lat])
              .addTo(map);

            el.addEventListener("click", (e) => {
              e.stopPropagation();
              // Close any currently open popups
              document.querySelectorAll(".maplibregl-popup").forEach((p) => p.remove());

              const popup = new maplibregl.Popup({
                offset: {
                  left: [22, -18],
                  right: [-22, -18],
                  top: [0, 16],
                  bottom: [0, -42],
                },
                anchor: "left",
                closeButton: true,
                closeOnClick: false,
                maxWidth: "360px",
                className: "heritage-pin-popup",
              }).setDOMContent(createPopupContent(monastery));

              popup.setLngLat([lng, lat]).addTo(map);

              map.flyTo({
                center: [lng, lat],
                zoom: 12,
                duration: 1000,
                offset: [-120, 0],
              });
            });

            markersRef.current.push(marker);
          });
        };

        map.on("load", () => {
          renderMarkers();
          map.resize();
        });

        map.on("styledata", () => {
          renderMarkers();
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

        setTimeout(() => {
          if (isSubscribed && map) {
            map.resize();
          }
        }, 200);
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    initMap();

    return () => {
      isSubscribed = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode, currentStyle]);

  // Reactive Map Markers Redraw based on filteredMonasteries (Search, State, Region filters)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    import("maplibre-gl").then((maplibreglModule) => {
      const maplibregl = (maplibreglModule as any).default || maplibreglModule;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      filteredMonasteries.forEach((monastery) => {
        const lat = monastery.location?.lat ?? monastery.latitude;
        const lng = monastery.location?.lng ?? monastery.longitude;
        if (typeof lat !== "number" || typeof lng !== "number") return;

        const el = document.createElement("div");
        el.className = "cursor-pointer group";
        el.setAttribute("data-monastery-id", monastery.id);

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-9 h-9 rounded-full bg-forest-700 border-2 border-saffron-400 shadow-heritage flex items-center justify-center transform group-hover:scale-125 transition-transform duration-200">
              <span class="text-saffron-300 font-bold text-xs">☸</span>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-saffron-500 rotate-45"></div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([lng, lat])
          .addTo(map);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          // Close any currently open popups
          document.querySelectorAll(".maplibregl-popup").forEach((p) => p.remove());

          const popup = new maplibregl.Popup({
            offset: {
              left: [22, -18],
              right: [-22, -18],
              top: [0, 16],
              bottom: [0, -42],
            },
            anchor: "left",
            closeButton: true,
            closeOnClick: false,
            maxWidth: "360px",
            className: "heritage-pin-popup",
          }).setDOMContent(createPopupContent(monastery));

          popup.setLngLat([lng, lat]).addTo(map);

          map.flyTo({
            center: [lng, lat],
            zoom: 12,
            duration: 1000,
            offset: [-120, 0],
          });
        });

        markersRef.current.push(marker);
      });

      // If user searched a keyword, auto-frame map to matched monuments
      if (searchQuery.trim() && filteredMonasteries.length > 0) {
        if (filteredMonasteries.length === 1) {
          const single = filteredMonasteries[0];
          const lat = single.location?.lat ?? single.latitude;
          const lng = single.location?.lng ?? single.longitude;
          if (typeof lat === "number" && typeof lng === "number") {
            map.flyTo({ center: [lng, lat], zoom: 9.5, duration: 1000 });
          }
        } else {
          const bounds = new maplibregl.LngLatBounds();
          let hasPoints = false;
          filteredMonasteries.forEach((m) => {
            const lat = m.location?.lat ?? m.latitude;
            const lng = m.location?.lng ?? m.longitude;
            if (typeof lat === "number" && typeof lng === "number") {
              bounds.extend([lng, lat]);
              hasPoints = true;
            }
          });
          if (hasPoints) {
            map.fitBounds(bounds, { padding: 80, maxZoom: 10.5, duration: 1000 });
          }
        }
      }
    });
  }, [filteredMonasteries, searchQuery]);

  // Recenter map on state or region changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedState !== "All States" && STATE_COORDINATES[selectedState]) {
      mapRef.current.flyTo({
        center: STATE_COORDINATES[selectedState].center,
        zoom: STATE_COORDINATES[selectedState].zoom,
        duration: 1400,
      });
    } else if (selectedRegion !== "all" && REGION_COORDINATES[selectedRegion]) {
      mapRef.current.flyTo({
        center: REGION_COORDINATES[selectedRegion].center,
        zoom: REGION_COORDINATES[selectedRegion].zoom,
        duration: 1400,
      });
    } else {
      mapRef.current.flyTo({
        center: [79.5, 23.0],
        zoom: 4.8,
        duration: 1400,
      });
    }
  }, [selectedState, selectedRegion]);

  return (
    <>
      <Header />
      <main className="flex-1 pb-0">
        {/* Controls bar */}
        <div className="sticky top-16 z-40 glass-card border-b border-parchment-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("explore.searchPlaceholder")}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-parchment-300 bg-white focus:outline-none focus:border-forest-700 min-h-[38px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 min-h-0 min-w-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* State Dropdown */}
              <div className="flex items-center gap-1">
                <Building size={14} className="text-forest-700" />
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    if (e.target.value !== "All States") {
                      setSelectedRegion("all");
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-parchment-300 bg-white text-xs font-semibold text-stone-700 focus:outline-none min-h-[38px]"
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st === "All States" && language === "hi" ? "सभी राज्य" : st}
                    </option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div className="flex bg-parchment-100 rounded-lg p-1 border border-parchment-200">
                <button
                  onClick={() => handleSetViewMode("map")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[34px] ${
                    viewMode === "map"
                      ? "bg-forest-700 text-white shadow-sm font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <MapIcon size={14} />
                  <span>{t("explore.mapView")}</span>
                </button>
                <button
                  onClick={() => handleSetViewMode("list")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all min-h-[34px] ${
                    viewMode === "list"
                      ? "bg-forest-700 text-white shadow-sm font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <List size={14} />
                  <span>{t("explore.listView")} ({filteredMonasteries.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Macro-Region Filter Pills */}
          <div className="max-w-7xl mx-auto flex items-center gap-2 mt-2 pt-2 border-t border-parchment-200/60 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter size={11} className="text-saffron-600" />
              {language === "hi" ? "क्षेत्र:" : "Regions:"}
            </span>
            {REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegion(reg.id);
                  if (reg.id !== "all") {
                    setSelectedState("All States");
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all min-h-[28px] ${
                  selectedRegion === reg.id
                    ? "bg-forest-700 text-white font-bold shadow-xs"
                    : "bg-white text-stone-600 border border-parchment-300 hover:bg-parchment-100"
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-parchment-100">
            {/* MapLibre container */}
            <div
              ref={mapContainerRef}
              className="w-full h-full min-h-[600px]"
              style={{ width: "100%", height: "100%", minHeight: "600px" }}
            />

            {/* Map Style Selector Floating Pill */}
            <div className="absolute top-4 left-4 z-20">
              <div className="relative">
                <button
                  onClick={() => setStyleMenuOpen(!styleMenuOpen)}
                  className="glass-card flex items-center gap-2 px-3 py-2 rounded-xl border border-parchment-300 text-xs font-bold text-forest-800 shadow-md hover:bg-white transition-all min-h-[36px]"
                >
                  <Layers size={14} className="text-saffron-600" />
                  <span>
                    {MAP_STYLES.find((s) => s.id === currentStyle)?.label || "Map Style"}
                  </span>
                </button>

                {styleMenuOpen && (
                  <div className="absolute top-12 left-0 bg-white/95 backdrop-blur-md rounded-xl border border-parchment-300 shadow-xl p-1.5 w-52 animate-fade-in flex flex-col gap-1 z-30">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Map Cartography Styles
                    </div>
                    {MAP_STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setCurrentStyle(st.id);
                          setStyleMenuOpen(false);
                        }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                          currentStyle === st.id
                            ? "bg-forest-700 text-white shadow-xs font-bold"
                            : "text-stone-700 hover:bg-parchment-100"
                        }`}
                      >
                        <span>{st.icon}</span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="section-padding max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMonasteries.map((monastery) => (
                <div
                  key={monastery.id}
                  id={`card-${monastery.id}`}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("explore_view_mode", "list");
                      sessionStorage.setItem("explore_scroll_target", monastery.id);
                    }
                  }}
                  className="rounded-2xl transition-all duration-300"
                >
                  <MonasteryCard
                    id={monastery.id}
                    name={monastery.name}
                    tagline={monastery.tagline || ""}
                    district={`${(monastery as any).state ? (monastery as any).state + " · " : ""}${monastery.district || ""}`}
                    sect={monastery.sect || ""}
                    altitude={monastery.altitude || "500m"}
                    heroImage={monastery.heroImage || `/images/monasteries/${monastery.id}.png`}
                    offlinePackSize={(monastery as any).offlinePackSize || "12 MB"}
                    photographyAllowed={monastery.sacredAccessProtocol?.photographyAllowed || "permitted"}
                    currentStatus={monastery.sacredAccessProtocol?.currentStatus || "open"}
                    virtualTourAvailable={monastery.virtualTourEnabled ?? ((monastery as any).virtualTour?.available ?? true)}
                  />
                </div>
              ))}
            </div>
            {filteredMonasteries.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-500 text-sm">
                  {t("explore.noResults")}
                </p>
                <button
                  onClick={() => {
                    setSelectedRegion("all");
                    setSelectedState("All States");
                    setSearchQuery("");
                  }}
                  className="btn-outline text-xs mt-3"
                >
                  {t("explore.resetFilters")}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
