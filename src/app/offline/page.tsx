"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Wifi,
  WifiOff,
  HardDrive,
  Trash2,
  RefreshCw,
  CheckCircle,
  MapPin,
  Volume2,
  Shield,
  Map,
  Phone,
} from "lucide-react";
import Header from "@/components/layout/Header";
import monasteries from "@/data/monasteries.json";
import { useI18n } from "@/lib/i18n";
import {
  getSavedPacks,
  saveMonasteryPack,
  removeMonasteryPack,
  getStorageEstimate,
  StoredPack,
} from "@/lib/offlineStore";

interface OfflinePack {
  monasteryId: string;
  name: string;
  district: string;
  size: string;
  downloaded: boolean;
  lastSync: string | null;
  contents: string[];
}

export default function OfflinePage() {
  const { language } = useI18n();
  const [offlineMode, setOfflineMode] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [storage, setStorage] = useState<{ usedMB: number; quotaMB: number }>({
    usedMB: 45,
    quotaMB: 500,
  });

  const [packs, setPacks] = useState<OfflinePack[]>(() =>
    monasteries.map((m) => ({
      monasteryId: m.id,
      name: typeof m.name === "string" ? m.name : m.name.en,
      district: m.district,
      size: m.offlinePackSize,
      downloaded: false,
      lastSync: null,
      contents: [
        "Monastery profile & history",
        "Etiquette cards & access rules",
        "Map tiles (offline cache)",
        "Emergency contacts & roads",
        "Oral histories (text format)",
        "Verified nearby services list",
      ],
    }))
  );

  // Load actual saved packs from IndexedDB on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await getSavedPacks();
        const savedIds = new Set(saved.map((s) => s.id));

        setPacks((prev) =>
          prev.map((p) => {
            const isSaved = savedIds.has(p.monasteryId);
            const savedItem = saved.find((s) => s.id === p.monasteryId);
            return {
              ...p,
              downloaded: isSaved,
              lastSync: savedItem ? savedItem.downloadedAt : p.lastSync,
            };
          })
        );

        const est = await getStorageEstimate();
        setStorage(est);
      } catch (err) {
        console.warn("IndexedDB load error:", err);
      }
    })();
  }, []);

  const downloadedPacks = packs.filter((p) => p.downloaded);
  const totalSizeMB = downloadedPacks.reduce((total, p) => {
    const num = parseInt(p.size);
    return total + (isNaN(num) ? 0 : num);
  }, 0);

  const handleDownload = async (monasteryId: string) => {
    setLoadingId(monasteryId);
    try {
      const monastery = monasteries.find((m) => m.id === monasteryId);
      if (!monastery) return;

      const packData: StoredPack = {
        id: monastery.id,
        name: typeof monastery.name === "string" ? monastery.name : monastery.name.en,
        district: monastery.district,
        size: monastery.offlinePackSize,
        downloadedAt: new Date().toISOString().split("T")[0],
        data: {
          monastery,
          etiquette: (monastery as any).etiquette || [],
          oralHistories: (monastery as any).oralHistories || [],
          cachedAt: Date.now(),
        },
      };

      await saveMonasteryPack(packData);

      setPacks((prev) =>
        prev.map((p) =>
          p.monasteryId === monasteryId
            ? {
                ...p,
                downloaded: true,
                lastSync: new Date().toISOString().split("T")[0],
              }
            : p
        )
      );

      const est = await getStorageEstimate();
      setStorage(est);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (monasteryId: string) => {
    try {
      await removeMonasteryPack(monasteryId);
      setPacks((prev) =>
        prev.map((p) =>
          p.monasteryId === monasteryId
            ? { ...p, downloaded: false, lastSync: null }
            : p
        )
      );
      const est = await getStorageEstimate();
      setStorage(est);
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        <div className="section-padding max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest-700 mb-2">
            {language === "hi" ? "सहेजे गए ऑफ़लाइन पैक्स" : "Saved Offline"}
          </h1>
          <p className="text-sm text-stone-500 mb-6">
            {language === "hi"
              ? "दूरस्थ घाटियों और नेटवर्क विहीन क्षेत्रों के लिए सत्यापित धरोहर सामग्री सीधे अपने व्यक्तिगत डिवाइस में सहेजें।"
              : "Download verified heritage content for remote valleys and regions with no cellular connectivity."}
          </p>

          {/* Offline mode toggle */}
          <div className="heritage-border bg-parchment-50 p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {offlineMode ? (
                  <WifiOff size={22} className="text-saffron-600 shrink-0" />
                ) : (
                  <Wifi size={22} className="text-forest-600 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-semibold text-forest-700">
                    {language === "hi" ? "ऑफ़लाइन मोड सिमुलेशन" : "Offline Mode Simulation"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {offlineMode
                      ? language === "hi"
                        ? "ब्राउज़र IndexedDB और सर्विस वर्कर से संचालित"
                        : "Operating strictly from cached IndexedDB & Service Worker"
                      : language === "hi"
                      ? "ऑनलाइन — पैक्स सहेजने के लिए तैयार"
                      : "Online — Ready to cache heritage packs"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={offlineMode}
                onClick={() => setOfflineMode(!offlineMode)}
                className={`relative inline-flex !min-h-[28px] !min-w-[52px] h-[28px] w-[52px] flex-shrink-0 cursor-pointer rounded-full p-[3px] transition-colors duration-200 ease-in-out focus:outline-none shadow-inner ${
                  offlineMode ? "bg-forest-600" : "bg-stone-300"
                }`}
                aria-label="Toggle offline mode"
              >
                <span
                  className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    offlineMode ? "translate-x-[24px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Direct Device Storage Info */}
          <div className="heritage-border bg-parchment-50 p-4 mb-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700 shrink-0">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-forest-700">
                  {language === "hi" ? "सीधे आपके व्यक्तिगत डिवाइस पर सुरक्षित" : "Stored Directly on Your Personal Device"}
                </h3>
                <p className="text-xs text-stone-500">
                  {downloadedPacks.length > 0
                    ? language === "hi"
                      ? `${downloadedPacks.length} धरोहर पैक आपके डिवाइस में ऑफ़लाइन उपयोग हेतु सहेजे गए हैं।`
                      : `${downloadedPacks.length} heritage pack${downloadedPacks.length > 1 ? "s" : ""} saved locally on your device for offline use.`
                    : language === "hi"
                    ? "ऑफ़लाइन उपयोग के लिए नीचे दिए गए धरोहर पैक्स को सहेजें।"
                    : "Download heritage packs below for 100% offline access in remote regions."}
                </p>
              </div>
            </div>
            {downloadedPacks.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-100 text-forest-800 text-xs font-bold rounded-full shrink-0">
                <CheckCircle size={14} className="text-forest-600" />
                {downloadedPacks.length} {language === "hi" ? "सहेजे गए" : "Saved"}
              </span>
            )}
          </div>

          {/* Downloaded packs */}
          {downloadedPacks.length > 0 && (
            <div className="mb-6 animate-fade-in">
              <h2 className="font-heading font-semibold text-forest-700 mb-3 text-lg">
                {language === "hi" ? "डाउनलोड किए गए पैक्स" : "Downloaded Packs"}
              </h2>
              <div className="space-y-3">
                {downloadedPacks.map((pack) => {
                  const mObj = monasteries.find((m) => m.id === pack.monasteryId);
                  const pName = typeof mObj?.name === "string" ? mObj.name : (language === "hi" && (mObj?.name as any)?.hi ? (mObj?.name as any).hi : (mObj?.name as any)?.en || pack.name);
                  const isExpanded = expandedPack === pack.monasteryId;
                  const monastery = mObj as any;

                  const packSections = [
                    { key: "profile", icon: MapPin, label: language === "hi" ? "प्रोफ़ाइल" : "Profile" },
                    { key: "etiquette", icon: Shield, label: language === "hi" ? "आचार संहिता" : "Etiquette" },
                    { key: "maps", icon: Map, label: language === "hi" ? "नक्शा" : "Offline Maps" },
                    { key: "emergency", icon: Phone, label: language === "hi" ? "आपातकालीन" : "Emergency" },
                    { key: "stories", icon: Volume2, label: language === "hi" ? "कथाएं" : "Stories" },
                  ];

                  return (
                    <div
                      key={pack.monasteryId}
                      className="heritage-border bg-forest-50/80 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={18} className="text-forest-600 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-forest-700">
                              {pName}
                            </h3>
                            <p className="text-[10px] text-forest-600">
                              {pack.district} · {monastery?.state || "India"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-forest-700 font-bold bg-white px-2 py-0.5 rounded border border-forest-200">
                          {pack.size}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 my-3">
                        {packSections.map((item) => (
                          <button
                            key={item.key}
                            onClick={() => {
                              if (isExpanded && activeSection === item.key) {
                                setExpandedPack(null);
                                setActiveSection(null);
                              } else {
                                setExpandedPack(pack.monasteryId);
                                setActiveSection(item.key);
                              }
                            }}
                            className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded font-medium transition-all cursor-pointer min-h-0 min-w-0 ${
                              isExpanded && activeSection === item.key
                                ? "bg-forest-700 text-white border border-forest-700 shadow-sm"
                                : "bg-white text-forest-700 border border-forest-200/60 hover:bg-forest-100 hover:border-forest-400"
                            }`}
                          >
                            <item.icon size={10} />
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Expanded content panel */}
                      {isExpanded && activeSection && monastery && (
                        <div className="bg-white rounded-xl border border-forest-200 p-4 mb-3 animate-fade-in">
                          {activeSection === "profile" && (
                            <div>
                              <h4 className="text-sm font-bold text-forest-700 mb-2">📜 {pName}</h4>
                              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                                <p>{typeof monastery.description === "string" ? monastery.description : (language === "hi" && monastery.description?.hi ? monastery.description.hi : monastery.description?.en || "Heritage monument of India.")}</p>
                                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                                  {monastery.sect && <div><span className="font-semibold text-forest-700">Tradition:</span> {monastery.sect}</div>}
                                  {monastery.founded && <div><span className="font-semibold text-forest-700">Founded:</span> {monastery.founded}</div>}
                                  {monastery.altitude && <div><span className="font-semibold text-forest-700">Altitude:</span> {monastery.altitude}</div>}
                                  {monastery.visitingHours && <div><span className="font-semibold text-forest-700">Hours:</span> {monastery.visitingHours.open} – {monastery.visitingHours.close}</div>}
                                  {monastery.visitingHours?.entryFee && <div><span className="font-semibold text-forest-700">Entry:</span> {monastery.visitingHours.entryFee.indian} (Indian) / {monastery.visitingHours.entryFee.foreign} (Foreign)</div>}
                                  {monastery.visitingHours?.bestTime && <div className="col-span-2"><span className="font-semibold text-forest-700">Best Time:</span> {monastery.visitingHours.bestTime}</div>}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeSection === "etiquette" && (
                            <div>
                              <h4 className="text-sm font-bold text-forest-700 mb-2">🛡️ Access Rules & Etiquette</h4>
                              {monastery.accessRules && monastery.accessRules.length > 0 ? (
                                <ul className="space-y-2">
                                  {monastery.accessRules.map((rule: any, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-stone-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                      <span className="text-amber-600 font-bold shrink-0">{rule.severity === "strict" ? "⚠️" : "ℹ️"}</span>
                                      <span>{rule.rule}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : monastery.etiquette && monastery.etiquette.length > 0 ? (
                                <ul className="space-y-2">
                                  {monastery.etiquette.map((et: any, i: number) => (
                                    <li key={i} className="text-xs text-stone-700 bg-forest-50 border border-forest-200 rounded-lg px-3 py-2">
                                      <span className="font-semibold text-forest-700">{et.title}:</span> {et.description}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-stone-500">Standard visiting etiquette applies. Please respect local customs and traditions.</p>
                              )}
                            </div>
                          )}

                          {activeSection === "maps" && (
                            <div>
                              <h4 className="text-sm font-bold text-forest-700 mb-2">🗺️ Location & Coordinates</h4>
                              <div className="space-y-2 text-xs text-stone-700">
                                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div><span className="font-semibold text-sky-800">Latitude:</span> {monastery.location?.lat || "N/A"}</div>
                                    <div><span className="font-semibold text-sky-800">Longitude:</span> {monastery.location?.lng || "N/A"}</div>
                                    <div><span className="font-semibold text-sky-800">State:</span> {monastery.state || "India"}</div>
                                    <div><span className="font-semibold text-sky-800">District:</span> {monastery.district || "N/A"}</div>
                                    {monastery.altitude && <div className="col-span-2"><span className="font-semibold text-sky-800">Altitude:</span> {monastery.altitude}</div>}
                                  </div>
                                </div>
                                {monastery.contact?.address && (
                                  <p className="text-[11px]"><span className="font-semibold text-forest-700">Address:</span> {monastery.contact.address}</p>
                                )}
                                <p className="text-[10px] text-stone-400 italic mt-1">Map tiles cached for offline viewing when service worker is active.</p>
                              </div>
                            </div>
                          )}

                          {activeSection === "emergency" && (
                            <div>
                              <h4 className="text-sm font-bold text-forest-700 mb-2">🚨 Emergency Contacts</h4>
                              <div className="space-y-2">
                                {monastery.contact?.phone && (
                                  <a href={`tel:${monastery.contact.phone}`} className="flex items-center gap-2 text-xs bg-forest-50 border border-forest-200 rounded-lg px-3 py-2 text-forest-700 font-medium" style={{textDecoration: "none"}}>
                                    <Phone size={14} className="text-forest-600 shrink-0" />
                                    <div>
                                      <div className="font-semibold">Monument Office</div>
                                      <div>{monastery.contact.phone}</div>
                                    </div>
                                  </a>
                                )}
                                {monastery.contact?.emergency?.localHealthPost && (
                                  <div className="flex items-start gap-2 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-800">
                                    <span className="text-red-500 font-bold shrink-0 mt-0.5">🏥</span>
                                    <div>
                                      <div className="font-semibold">Nearest Health Post</div>
                                      <div>{monastery.contact.emergency.localHealthPost}</div>
                                    </div>
                                  </div>
                                )}
                                {monastery.contact?.emergency?.policeStation && (
                                  <div className="flex items-start gap-2 text-xs bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800">
                                    <span className="text-blue-500 font-bold shrink-0 mt-0.5">🚔</span>
                                    <div>
                                      <div className="font-semibold">Police Station</div>
                                      <div>{monastery.contact.emergency.policeStation}</div>
                                    </div>
                                  </div>
                                )}
                                {monastery.contact?.emergency?.tourismHelpline && (
                                  <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                                    <span className="text-amber-500 font-bold shrink-0 mt-0.5">📞</span>
                                    <div>
                                      <div className="font-semibold">Tourism Helpline</div>
                                      <div>{monastery.contact.emergency.tourismHelpline}</div>
                                    </div>
                                  </div>
                                )}
                                {!monastery.contact?.emergency && (
                                  <div className="text-xs text-stone-500">
                                    <p>National Emergency: <strong>112</strong></p>
                                    <p>Tourism Helpline: <strong>1800-111-363</strong></p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {activeSection === "stories" && (
                            <div>
                              <h4 className="text-sm font-bold text-forest-700 mb-2">📖 Oral Histories & Stories</h4>
                              {monastery.oralHistories && monastery.oralHistories.length > 0 ? (
                                <div className="space-y-3">
                                  {monastery.oralHistories.map((story: any, i: number) => (
                                    <div key={i} className="bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                                      <h5 className="text-xs font-bold text-amber-900 mb-1">{story.title}</h5>
                                      <p className="text-[10px] text-amber-700 mb-2 italic">Narrated by {story.narrator} · {story.era}</p>
                                      <p className="text-xs text-stone-700 leading-relaxed">{story.fullText || story.excerpt}</p>
                                      {story.approvedBy && (
                                        <p className="text-[10px] text-forest-600 mt-2 font-medium">✅ Approved by: {story.approvedBy}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-stone-500">Oral histories for this site are being collected and will be available in a future update.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-forest-200/60 pt-2">
                        <span>{language === "hi" ? "सहेजा गया: " : "Saved: "}{pack.lastSync}</span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDownload(pack.monasteryId)}
                            className="flex items-center gap-1 text-forest-700 hover:underline min-h-0 min-w-0"
                          >
                            <RefreshCw size={11} className={loadingId === pack.monasteryId ? "animate-spin" : ""} />
                            {language === "hi" ? "सिंक" : "Sync"}
                          </button>
                          <button
                            onClick={() => handleRemove(pack.monasteryId)}
                            className="flex items-center gap-1 text-maroon-700 hover:underline min-h-0 min-w-0"
                          >
                            <Trash2 size={11} />
                            {language === "hi" ? "हटाएं" : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available packs */}
          <div>
            <h2 className="font-heading font-semibold text-forest-700 mb-3 text-lg">
              {language === "hi" ? "उपलब्ध ऑफ़लाइन पैक्स" : "Available Offline Packs"}
            </h2>
            <div className="space-y-3">
              {packs
                .filter((p) => !p.downloaded)
                .map((pack) => {
                  const mObj = monasteries.find((m) => m.id === pack.monasteryId);
                  const pName = typeof mObj?.name === "string" ? mObj.name : (language === "hi" && (mObj?.name as any)?.hi ? (mObj?.name as any).hi : (mObj?.name as any)?.en || pack.name);
                  return (
                    <div
                      key={pack.monasteryId}
                      className="heritage-border bg-parchment-50 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-stone-800">
                            {pName}
                          </h3>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {pack.district} · {(mObj as any)?.state || "India"} · {pack.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(pack.monasteryId)}
                          disabled={loadingId === pack.monasteryId}
                          className="btn-heritage text-xs py-2 px-4 shadow-sm"
                        >
                          <Download size={14} className={loadingId === pack.monasteryId ? "animate-bounce" : ""} />
                          {loadingId === pack.monasteryId
                            ? language === "hi"
                              ? "सहेज रहा है..."
                              : "Saving..."
                            : language === "hi"
                            ? "पैक सहेजें"
                            : "Save Pack"}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* What's included */}
          <div className="mt-8 heritage-border bg-parchment-50 p-5">
            <h3 className="font-heading font-semibold text-forest-700 mb-3">
              {language === "hi" ? "सिंटैक्सस ऑफ़लाइन पैक में क्या शामिल है?" : "What's in a SYNTAXUS Offline Pack?"}
            </h3>
            <ul className="space-y-2">
              {(language === "hi"
                ? [
                    "स्मारक प्रोफ़ाइल, इतिहास, परंपराएं और स्थापत्य विवरण",
                    "आचार संहिता कार्ड, मौन क्षेत्र और फोटोग्राफी नियम",
                    "आसपास के क्षेत्र के लिए ऑफ़लाइन वेक्टर मैप डेटा",
                    "आपातकालीन दूरभाष संख्या और निकटतम स्वास्थ्य केंद्र",
                    "सड़क मार्ग स्थिति और सत्यापित टैक्सी स्टैंड सूची",
                    "मौखिक इतिहास और ऑडियो ट्रांसक्रिप्ट",
                  ]
                : [
                    "Monastery profile, history, lineages, and architecture",
                    "Etiquette cards, silence zones, and photography permissions",
                    "Offline vector map data for the surrounding area",
                    "Emergency telephone numbers and nearest health posts",
                    "Road condition warnings and verified taxi junctions",
                    "Oral histories with audio transcripts",
                  ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                  <CheckCircle size={13} className="text-forest-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
