"use client";

import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { DisasterEvent, SafePoint } from "@/lib/geoshield/types";
import { ActiveLayersState } from "./LayerController";
import { Shield, Info, ChevronDown, ChevronUp } from "lucide-react";

interface GeoShieldMapProps {
  events: DisasterEvent[];
  alerts?: any[];
  safePoints: SafePoint[];
  heritageSites: any[];
  layers: ActiveLayersState;
  selectedSiteId: string | null;
  selectedEventId: string | null;
  evaluatedRoute?: any;
  scenario?: string; // 'india_live' | 'nepal' | 'japan' | 'morocco' | 'libya' | 'greece' | 'brazil'
  onSelectSite?: (site: any) => void;
  onSelectEvent?: (event: DisasterEvent) => void;
  onSelectSafePoint?: (sp: SafePoint) => void;
}

// Pure math circle generator for Green Safe Sanctuaries
function createGeoJsonCircle(centerLng: number, centerLat: number, radiusKm: number = 12, points: number = 32): [number, number][] {
  const coords: [number, number][] = [];
  const kmInLat = 1 / 110.574;
  const kmInLng = 1 / (111.320 * Math.cos(centerLat * (Math.PI / 180)));
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const lng = centerLng + (radiusKm * kmInLng) * Math.cos(theta);
    const lat = centerLat + (radiusKm * kmInLat) * Math.sin(theta);
    coords.push([lng, lat]);
  }
  return coords;
}

export default function GeoShieldMap({
  events,
  safePoints,
  heritageSites,
  layers,
  selectedSiteId,
  selectedEventId,
  evaluatedRoute,
  scenario = "india_live",
  onSelectSite,
  onSelectEvent,
  onSelectSafePoint,
}: GeoShieldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const activePopupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(true);

  // Initialize MapLibre with Esri Topo and NASA GPM (Zero API key required)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const maplibreglModule = await import("maplibre-gl");
        const maplibregl = (maplibreglModule as any).default || maplibreglModule;

        if (!isMounted || !mapContainerRef.current) return;

        const initialCenter: [number, number] = [79.2, 24.5];
        const initialZoom = 4.8;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              "esri-topo": {
                type: "raster",
                tiles: [
                  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
                ],
                tileSize: 256,
                attribution: "Tiles &copy; Esri &mdash; Topographic Relief Map",
              },
              "nasa-gpm-precipitation": {
                type: "raster",
                tiles: [
                  "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
                ],
                tileSize: 256,
                attribution: "&copy; NASA GIBS / GPM IMERG Precipitation",
              },
            },
            layers: [
              {
                id: "esri-topo-layer",
                type: "raster",
                source: "esri-topo",
                minzoom: 0,
                maxzoom: 19,
              },
              {
                id: "nasa-gpm-layer",
                type: "raster",
                source: "nasa-gpm-precipitation",
                minzoom: 0,
                maxzoom: 9,
                paint: {
                  "raster-opacity": 0.45,
                },
              },
            ],
          },
          center: initialCenter,
          zoom: initialZoom,
          maxPitch: 60,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          mapRef.current = map;
          setMapLoaded(true);
        });
      } catch (e) {
        console.error("Map initialization failed:", e);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Scenario Switching & Pan/Zoom to Region
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    switch (scenario) {
      case "japan":
        map.flyTo({ center: [136.9066, 37.3916], zoom: 9.2, speed: 1.2, curve: 1.4 });
        break;
      case "morocco":
        map.flyTo({ center: [-8.4116, 31.1107], zoom: 8.8, speed: 1.2, curve: 1.4 });
        break;
      case "libya":
        map.flyTo({ center: [22.6367, 32.7634], zoom: 9.8, speed: 1.2, curve: 1.4 });
        break;
      case "greece":
        map.flyTo({ center: [28.0269, 36.1428], zoom: 9.5, speed: 1.2, curve: 1.4 });
        break;
      case "brazil":
        map.flyTo({ center: [-51.2177, -30.0346], zoom: 9.2, speed: 1.2, curve: 1.4 });
        break;
      case "nepal":
        map.flyTo({ center: [85.3521, 28.1824], zoom: 9.2, speed: 1.2, curve: 1.4 });
        break;
      default:
        // India Live
        map.flyTo({ center: [79.2, 24.5], zoom: 5.2, speed: 1.2, curve: 1.4 });
        break;
    }
  }, [scenario, mapLoaded]);

  // Handle Focus on specific site or event with interactive flyTo and Popup
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (activePopupRef.current) {
      activePopupRef.current.remove();
      activePopupRef.current = null;
    }

    if (selectedSiteId) {
      const site = heritageSites.find((s) => s.id === selectedSiteId);
      if (site) {
        const rawLat = site.location?.lat ?? site.latitude;
        const rawLng = site.location?.lng ?? site.longitude;
        const lat = typeof rawLat === "string" ? parseFloat(rawLat) : rawLat;
        const lng = typeof rawLng === "string" ? parseFloat(rawLng) : rawLng;

        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 12.5,
            speed: 1.4,
            essential: true,
          });

          // Check if affected by any active event
          let riskStatus = "All Clear (Normal Status)";
          let statusColor = "#15803d";
          for (const ev of events) {
            if (Array.isArray(ev.affected_heritage_ids) && ev.affected_heritage_ids.includes(site.id)) {
              riskStatus = `${ev.severity} ALERT: ${ev.title}`;
              statusColor = ev.severity === "RED" ? "#dc2626" : ev.severity === "ORANGE" ? "#ea580c" : "#d97706";
              break;
            }
          }

          import("maplibre-gl").then((maplibreglModule) => {
            const maplibregl = (maplibreglModule as any).default || maplibreglModule;
            const siteName = site.name?.en || site.name_en || site.id;
            const state = site.state || site.district || "India";

            const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
              .setLngLat([lng, lat])
              .setHTML(`
                <div style="font-family: system-ui, sans-serif; padding: 6px 4px; min-width: 200px;">
                  <div style="font-size: 10px; font-weight: 800; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.05em;">
                    🏛️ Monument Risk Status
                  </div>
                  <div style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 2px;">
                    ${siteName}
                  </div>
                  <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">
                    ${state}
                  </div>
                  <div style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; background-color: #f3f4f6; color: ${statusColor}; border: 1px solid #e5e7eb;">
                    ${riskStatus}
                  </div>
                </div>
              `)
              .addTo(mapRef.current);

            activePopupRef.current = popup;
          });
        }
      }
    } else if (selectedEventId) {
      const ev = events.find((e) => e.id === selectedEventId);
      if (ev && ev.centroid_lat && ev.centroid_lng) {
        mapRef.current.flyTo({
          center: [ev.centroid_lng, ev.centroid_lat],
          zoom: 9.5,
          essential: true,
        });
      }
    }
  }, [selectedSiteId, selectedEventId, heritageSites, events, mapLoaded]);

  // Render Explicit RED, YELLOW, and GREEN Spatial Zones
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Toggle NASA GPM Precipitation Layer Opacity
    if (map.getLayer("nasa-gpm-layer")) {
      map.setPaintProperty("nasa-gpm-layer", "raster-opacity", layers.precipitation ? 0.6 : 0.0);
    }

    // 1. Filter events matching current scenario
    const visibleEvents = events.filter((e) => {
      if (scenario === "india_live") return e.country === "India";
      if (scenario === "nepal") return e.country === "Nepal";
      if (scenario === "japan") return e.country === "Japan";
      if (scenario === "morocco") return e.country === "Morocco";
      if (scenario === "libya") return e.country === "Libya";
      if (scenario === "greece") return e.country === "Greece";
      if (scenario === "brazil") return e.country === "Brazil";
      return true;
    });

    // 2. RED DANGER ZONES (High Severity / Evacuation)
    const redFeatures = visibleEvents
      .filter((e) => e.severity === "RED" && e.geometry)
      .map((e) => ({
        type: "Feature",
        properties: {
          id: e.id,
          title: e.title,
          severity: "RED",
          hazard_type: e.hazard_type,
          label: "RED ZONE: Active Danger & Evacuation",
          color: "#ef4444",
        },
        geometry: e.geometry,
      }));

    // 3. YELLOW/ORANGE ADVISORY ZONES (Monitoring & Precaution Buffer)
    const yellowFeatures = visibleEvents
      .filter((e) => (e.severity === "ORANGE" || e.severity === "YELLOW") && e.geometry)
      .map((e) => ({
        type: "Feature",
        properties: {
          id: e.id,
          title: e.title,
          severity: e.severity,
          hazard_type: e.hazard_type,
          label: "YELLOW ZONE: Precautionary Advisory & Buffer",
          color: e.severity === "ORANGE" ? "#f97316" : "#eab308",
        },
        geometry: e.geometry,
      }));

    // 4. GREEN SANCTUARY ZONES (Verified Safe Tourism Corridors)
    const visibleSafePoints = safePoints.filter((sp) => {
      if (scenario === "india_live") return sp.country === "India";
      if (scenario === "nepal") return sp.country === "Nepal";
      if (scenario === "japan") return sp.country === "Japan";
      if (scenario === "morocco") return sp.country === "Morocco";
      if (scenario === "libya") return sp.country === "Libya";
      if (scenario === "greece") return sp.country === "Greece";
      if (scenario === "brazil") return sp.country === "Brazil";
      return true;
    });

    const greenFeatures = visibleSafePoints.map((sp) => ({
      type: "Feature",
      properties: {
        id: sp.id,
        name: sp.name,
        point_type: sp.point_type,
        label: "GREEN ZONE: Verified Safe Sanctuary & Staging Area",
        color: "#10b981",
      },
      geometry: {
        type: "Polygon",
        coordinates: [createGeoJsonCircle(sp.longitude, sp.latitude, 12)],
      },
    }));

    // --- Add or Update RED ZONE Source & Layers ---
    const redGeoJson = { type: "FeatureCollection", features: redFeatures };
    if (map.getSource("hazard-red-src")) {
      (map.getSource("hazard-red-src") as any).setData(redGeoJson);
    } else {
      map.addSource("hazard-red-src", { type: "geojson", data: redGeoJson });
      map.addLayer({
        id: "hazard-red-fill",
        type: "fill",
        source: "hazard-red-src",
        paint: {
          "fill-color": "#ef4444",
          "fill-opacity": 0.38,
        },
      });
      map.addLayer({
        id: "hazard-red-line",
        type: "line",
        source: "hazard-red-src",
        paint: {
          "line-color": "#b91c1c",
          "line-width": 3.5,
        },
      });
    }

    // --- Add or Update YELLOW ZONE Source & Layers ---
    const yellowGeoJson = { type: "FeatureCollection", features: yellowFeatures };
    if (map.getSource("hazard-yellow-src")) {
      (map.getSource("hazard-yellow-src") as any).setData(yellowGeoJson);
    } else {
      map.addSource("hazard-yellow-src", { type: "geojson", data: yellowGeoJson });
      map.addLayer({
        id: "hazard-yellow-fill",
        type: "fill",
        source: "hazard-yellow-src",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.30,
        },
      });
      map.addLayer({
        id: "hazard-yellow-line",
        type: "line",
        source: "hazard-yellow-src",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
          "line-dasharray": [3, 1],
        },
      });
    }

    // --- Add or Update GREEN ZONE Source & Layers ---
    const greenGeoJson = { type: "FeatureCollection", features: layers.safePoints ? greenFeatures : [] };
    if (map.getSource("sanctuary-green-src")) {
      (map.getSource("sanctuary-green-src") as any).setData(greenGeoJson);
    } else {
      map.addSource("sanctuary-green-src", { type: "geojson", data: greenGeoJson });
      map.addLayer({
        id: "sanctuary-green-fill",
        type: "fill",
        source: "sanctuary-green-src",
        paint: {
          "fill-color": "#10b981",
          "fill-opacity": 0.22,
        },
      });
      map.addLayer({
        id: "sanctuary-green-line",
        type: "line",
        source: "sanctuary-green-src",
        paint: {
          "line-color": "#059669",
          "line-width": 2.0,
          "line-dasharray": [4, 2],
        },
      });
    }

    // Click handler for Red and Yellow hazard zones
    const handleZoneClick = (e: any) => {
      if (e.features && e.features[0]) {
        const evId = e.features[0].properties.id;
        const matched = events.find((ev) => ev.id === evId);
        if (matched && onSelectEvent) {
          onSelectEvent(matched);
        }
      }
    };

    map.on("click", "hazard-red-fill", handleZoneClick);
    map.on("click", "hazard-yellow-fill", handleZoneClick);

    // 5. Evaluated Route Line Layer
    if (evaluatedRoute?.recommended_route?.geometry && layers.routes) {
      const routeGeoJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { risk: evaluatedRoute.recommended_route.risk_score },
            geometry: evaluatedRoute.recommended_route.geometry,
          },
        ],
      };

      if (map.getSource("evaluated-route-src")) {
        (map.getSource("evaluated-route-src") as any).setData(routeGeoJson);
      } else {
        map.addSource("evaluated-route-src", { type: "geojson", data: routeGeoJson });
        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "evaluated-route-src",
          paint: { "line-color": "#ffffff", "line-width": 6 },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "evaluated-route-src",
          paint: { "line-color": "#10b981", "line-width": 4, "line-dasharray": [1, 0.5] },
        });
      }
    } else if (map.getSource("evaluated-route-src")) {
      (map.getSource("evaluated-route-src") as any).setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }, [events, safePoints, evaluatedRoute, layers, scenario, mapLoaded, onSelectEvent]);

  // Render HTML Marker Elements (Heritage Sites & Safe Points)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    import("maplibre-gl").then((maplibreglModule) => {
      const maplibregl = (maplibreglModule as any).default || maplibreglModule;

      // 1. Heritage Site Markers with GeoShield Risk Badges (for India)
      if (layers.heritage && scenario === "india_live") {
        heritageSites.forEach((site) => {
          const rawLat = site.location?.lat ?? site.latitude;
          const rawLng = site.location?.lng ?? site.longitude;
          const lat = typeof rawLat === "string" ? parseFloat(rawLat) : rawLat;
          const lng = typeof rawLng === "string" ? parseFloat(rawLng) : rawLng;
          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

          let siteSeverity = "GREEN";
          for (const ev of events) {
            if (Array.isArray(ev.affected_heritage_ids) && ev.affected_heritage_ids.includes(site.id)) {
              siteSeverity = ev.severity;
              break;
            }
          }

          const siteName = site.name?.en || site.name_en || site.id;
          const el = document.createElement("div");
          el.className = "cursor-pointer group flex flex-col items-center select-none";

          const isAlerted = siteSeverity !== "GREEN";
          const isSelected = selectedSiteId === site.id;

          const badgeColor =
            siteSeverity === "RED"
              ? "bg-red-600 text-white ring-red-300 shadow-red-500/50"
              : siteSeverity === "ORANGE"
              ? "bg-amber-600 text-white ring-amber-300 shadow-amber-500/50"
              : siteSeverity === "YELLOW"
              ? "bg-amber-500 text-stone-950 ring-amber-200"
              : "bg-forest-800 text-white ring-forest-300/40";

          if (isAlerted || isSelected) {
            // Prominent visual star for sites intersecting active warnings or selected
            el.innerHTML = `
              <div class="relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg ring-2 transition-transform duration-200 group-hover:scale-125 ${badgeColor}">
                <span class="text-xs">🏛️</span>
                <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-1 ring-white animate-ping"></span>
              </div>
              <div class="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-stone-900 shadow-md border ${
                siteSeverity === "RED" ? "border-red-400" : "border-amber-400"
              } whitespace-nowrap max-w-[130px] truncate">
                ${siteName}
              </div>
            `;
          } else {
            // Softened secondary element — compact dot icon, label reveals on hover
            el.innerHTML = `
              <div class="relative flex items-center justify-center w-5 h-5 rounded-full shadow-sm ring-1 ring-forest-400/50 bg-forest-800/80 text-white opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:scale-125">
                <span class="text-[9px]">🏛️</span>
              </div>
              <div class="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-stone-900/90 text-stone-100 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-[120px] truncate">
                ${siteName}
              </div>
            `;
          }

          el.addEventListener("click", () => {
            if (onSelectSite) onSelectSite(site);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // 2. Safe Point Markers (Shelters / Hospitals)
      if (layers.safePoints) {
        const visibleSafePoints = safePoints.filter((sp) => {
          if (scenario === "india_live") return sp.country === "India";
          if (scenario === "nepal") return sp.country === "Nepal";
          if (scenario === "japan") return sp.country === "Japan";
          if (scenario === "morocco") return sp.country === "Morocco";
          if (scenario === "libya") return sp.country === "Libya";
          if (scenario === "greece") return sp.country === "Greece";
          if (scenario === "brazil") return sp.country === "Brazil";
          return true;
        });

        visibleSafePoints.forEach((sp) => {
          const lat = typeof sp.latitude === "string" ? parseFloat(sp.latitude) : sp.latitude;
          const lng = typeof sp.longitude === "string" ? parseFloat(sp.longitude) : sp.longitude;
          if (isNaN(lat) || isNaN(lng)) return;

          const el = document.createElement("div");
          el.className = "cursor-pointer group flex flex-col items-center select-none";
          el.innerHTML = `
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700/90 text-white shadow-md ring-1 ring-emerald-300 transition-transform duration-200 group-hover:scale-125">
              <span class="text-[10px]">⛑️</span>
            </div>
            <div class="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950/95 text-emerald-200 border border-emerald-700 shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none max-w-[120px] truncate">
              Safe Shelter: ${sp.name}
            </div>
          `;

          el.addEventListener("click", () => {
            if (onSelectSafePoint) onSelectSafePoint(sp);
            // Open informative shelter popup
            new maplibregl.Popup({ offset: 25, closeButton: true })
              .setLngLat([lng, lat])
              .setHTML(`
                <div style="font-family: system-ui, sans-serif; padding: 6px 4px; min-width: 190px;">
                  <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">
                    ⛑️ Verified Safe Shelter / Staging
                  </div>
                  <div style="font-size: 13px; font-weight: 700; color: #064e3b; margin-top: 2px;">
                    ${sp.name}
                  </div>
                  <div style="font-size: 11px; color: #374151; margin-top: 4px;">
                    Type: <strong>${sp.point_type}</strong>
                  </div>
                  <div style="font-size: 11px; color: #374151;">
                    Capacity: <strong>${sp.capacity || "Emergency Staging"}</strong>
                  </div>
                  <div style="font-size: 11px; color: #059669; font-weight: 700; margin-top: 4px;">
                    📞 Helpline: ${sp.contact || "112"}
                  </div>
                </div>
              `)
              .addTo(map);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
      }
    });
  }, [layers, scenario, heritageSites, safePoints, events, mapLoaded, onSelectSite, onSelectSafePoint]);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-2xl overflow-hidden shadow-lg border border-stone-800 bg-stone-900">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* On-Map Interactive Visual Legend - Sleek intelligence styling */}
      <div
        className={`absolute top-3 left-3 z-20 rounded-xl p-2 shadow-xl pointer-events-auto max-w-[240px] select-none text-white border border-slate-700/80 backdrop-blur-md transition-all ${
          legendCollapsed ? "cursor-pointer hover:border-slate-500 bg-slate-950/85" : "space-y-1.5 p-2.5 bg-slate-950/95"
        }`}
        style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.75)" }}
        onClick={legendCollapsed ? () => setLegendCollapsed(false) : undefined}
      >
        <div className={`flex items-center justify-between gap-2 ${!legendCollapsed ? "pb-1 border-b border-slate-800" : ""}`}>
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
            <Shield size={13} className="text-emerald-400 shrink-0" />
            <span className="font-bold text-white truncate">Risk & Safety Zones</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLegendCollapsed(!legendCollapsed);
            }}
            className="p-0.5 rounded transition-colors hover:bg-slate-800 text-slate-300"
            title={legendCollapsed ? "Expand Legend" : "Collapse Legend"}
          >
            {legendCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>

        {!legendCollapsed && (
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3.5 h-3.5 rounded-xs bg-red-600 border border-red-400 inline-block shadow-xs shrink-0"></span>
              <div>
                <strong style={{ color: "#f87171", fontWeight: 700 }}>Red Zone:</strong>
                <span style={{ color: "#ffffff", fontWeight: 600, marginLeft: "4px" }}>Critical Danger & Evac</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3.5 h-3.5 rounded-xs bg-amber-500 border border-amber-300 inline-block shadow-xs shrink-0"></span>
              <div>
                <strong style={{ color: "#fde047", fontWeight: 700 }}>Yellow Zone:</strong>
                <span style={{ color: "#ffffff", fontWeight: 600, marginLeft: "4px" }}>Advisory & Buffer</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 border border-emerald-300 inline-block shadow-xs shrink-0"></span>
              <div>
                <strong style={{ color: "#34d399", fontWeight: 700 }}>Green Zone:</strong>
                <span style={{ color: "#ffffff", fontWeight: 600, marginLeft: "4px" }}>Safe Sanctuary / Staging</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs pt-1.5 border-t border-slate-700">
              <span className="text-sm">⛑️</span>
              <span style={{ color: "#6ee7b7", fontWeight: 700 }}>Verified Safe Shelters</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sm">🏛️</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>59 Monasteries & Regional Sites</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] pt-1.5 border-t border-slate-700">
              <Info size={11} className="text-indigo-400 shrink-0" />
              <span style={{ color: "#cbd5e1", fontWeight: 600 }}>Esri Topo Basemap • NASA GPM Radar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
