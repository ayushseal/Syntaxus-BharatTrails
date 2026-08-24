"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Mountain,
  Calendar,
  Camera,
  CameraOff,
  Eye,
  Download,
  BookOpen,
  Shield,
  ChevronRight,
  Users,
  Home as HomeIcon,
  AlertCircle,
  Volume2,
  Footprints,
  RotateCw,
  VolumeX,
  Hand,
  Shirt,
  Lock,
  Layers,
  Landmark,
  DoorClosed,
  Trees,
  Maximize2,
  Phone,
  PhoneCall,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Building,
  Send,
  Sparkles,
  Compass,
  Navigation,
} from "lucide-react";
import Header from "@/components/layout/Header";
import {
  ConsentBadge,
  PermissionLabel,
  SacredAccessBanner,
} from "@/components/shared/ConsentMetadata";
import ArchiveReaderModal, { ArchiveRecord } from "@/components/shared/ArchiveReaderModal";
import { HeritageSite } from "@/lib/repository/types";
import { audioEngine } from "@/lib/audioService";
import fallbackMonasteries from "@/data/monasteries.json";
import additionalArchives from "@/data/archives.json";
import { useI18n } from "@/lib/i18n";

type Tab = "story" | "plan" | "virtual" | "preservation";

export default function HeritageSiteProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { language, t } = useI18n();
  const { slug } = params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("story");
  const [selectedArchive, setSelectedArchive] = useState<ArchiveRecord | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  // Synchronously initialize site data so there is 0ms waiting screen
  const fallbackItem = (fallbackMonasteries as any[]).find(
    (m) => m.id === slug || m.slug === slug || m.id.toLowerCase() === slug.toLowerCase()
  );

  const [site, setSite] = useState<HeritageSite | null>(() => {
    if (!fallbackItem) return null;
    return {
      id: fallbackItem.id,
      slug: fallbackItem.id,
      name: fallbackItem.name,
      tagline: fallbackItem.tagline || `${fallbackItem.name.en} Heritage Space`,
      siteType: fallbackItem.id.includes("fort")
        ? "FORT"
        : fallbackItem.id.includes("temple")
        ? "TEMPLE"
        : fallbackItem.id.includes("stupa")
        ? "STUPA"
        : fallbackItem.id.includes("cave")
        ? "CAVE"
        : "MONASTERY",
      contentStatus: "PUBLISHED",
      state: fallbackItem.state || "India",
      district: fallbackItem.district || "District",
      region: fallbackItem.region || "Northern Frontiers",
      location: fallbackItem.location || { lat: 28.6139, lng: 77.209 },
      altitude: fallbackItem.altitude || "500m",
      address:
        fallbackItem.contact?.address ||
        `${fallbackItem.name.en}, ${fallbackItem.district || ""}, ${fallbackItem.state || ""}`,
      sect: fallbackItem.sect || "Ancient Tradition",
      founded: fallbackItem.founded || "Historical Antiquity",
      steward: fallbackItem.contact?.steward || "Archaeological Survey of India",
      asiCode: fallbackItem.asiCode || `ASI-${fallbackItem.id}`,
      virtualTourEnabled: fallbackItem.virtualTourEnabled !== false,
      heroImage: fallbackItem.heroImage || `/images/monasteries/${fallbackItem.id}.png`,
      description: fallbackItem.description,
      visitingHours: fallbackItem.visitingHours || { open: "06:00", close: "18:00" },
      contact: fallbackItem.contact || {},
      sacredAccessProtocol: fallbackItem.sacredAccessProtocol || {
        photographyAllowed: "permitted",
        interiorAccess: "open",
        currentStatus: "open",
      },
      nearbyServices: fallbackItem.nearbyServices || [],
      oralHistories: fallbackItem.oralHistories || [],
    } as HeritageSite;
  });

  const [loading, setLoading] = useState(!fallbackItem);

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await fetch(`/api/heritage/${slug}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setSite(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("API fetch failed, utilizing cached dataset:", e);
      }
      setLoading(false);
    }

    loadSite();
  }, [slug]);

  const handleBack = () => {
    if (typeof window !== "undefined") {
      const returnUrl = sessionStorage.getItem("monastery_return_url") || "/explore";
      router.push(returnUrl);
    } else {
      router.push("/explore");
    }
  };

  const handleCopyAddress = (addressText: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(addressText);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleToggleVoice = (story: any) => {
    if (playingStoryId === story.id) {
      audioEngine.stopAudio();
      setPlayingStoryId(null);
    } else {
      setPlayingStoryId(story.id);
      audioEngine.speakNarrative(
        `${story.title}. Narrated by ${story.narrator}. ${story.fullText}`,
        () => setPlayingStoryId(story.id),
        () => setPlayingStoryId(null)
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-3 border-forest-700 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-stone-500">
              {language === "hi" ? "धरोहर विवरण तैयार किया जा रहा है..." : "Loading Heritage Archive..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-50">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-forest-700 mb-2">
              Heritage Site Not Found
            </h2>
            <p className="text-sm text-stone-500 mb-4">The requested cultural landmark does not exist in the database.</p>
            <Link href="/explore" className="btn-heritage">
              Return to Explore
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const oralHistoriesList = site.oralHistories || [];
  const visitingHours = site.visitingHours || { open: "06:00", close: "18:00" };
  const protocol = site.sacredAccessProtocol || {
    photographyAllowed: "permitted",
    interiorAccess: "open",
    currentStatus: "open",
  };
  const sourcesList = site.sources || [];
  const categoriesList = site.categories || [];
  const relationsList = site.relations || [];

  // Related archives
  const relatedArchives: ArchiveRecord[] = additionalArchives
    .filter((a) => a.monastery.toLowerCase().includes(site.name.en.toLowerCase().split(" ")[0]))
    .map((a) => ({
      ...a,
      type: a.type as any,
      source: a.source as any,
    }));

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "story", label: language === "hi" ? "इतिहास एवं गाथा" : "Story & History", icon: BookOpen },
    { key: "plan", label: language === "hi" ? "दर्शन व योजना" : "Plan Visit", icon: Calendar },
    { key: "virtual", label: language === "hi" ? "360° आभासी दर्शन" : "360° Virtual", icon: Eye },
    { key: "preservation", label: language === "hi" ? "स्रोत एवं प्रमाण" : "Sources & Provenance", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        {/* Hero */}
        <div className="relative h-64 md:h-80">
          <Image
            src={site.heroImage || `/images/monasteries/${site.id}.png`}
            alt={typeof site.name === "string" ? site.name : site.name?.en || site.id}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/50 backdrop-blur-md text-white text-sm font-medium hover:bg-black/75 transition min-h-0 cursor-pointer shadow-lg border border-white/15 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
              {language === "hi" ? "वापस" : "Back"}
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] bg-saffron-500/90 text-white font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                {site.siteType.replace("_", " ")}
              </span>
              {categoriesList.map((cat) => (
                <span key={cat.id} className="text-[11px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white drop-shadow-md">
              {language === "hi" && site.name.hi ? site.name.hi : site.name.en}
            </h1>
            {site.name.hi && <p className="text-sm text-white/90 mt-0.5 font-heading">{language === "hi" ? site.name.en : site.name.hi}</p>}

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {site.district}, {site.state}
              </span>
              <span className="flex items-center gap-1">
                <Mountain size={12} />
                {site.altitude}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {language === "hi" ? "स्थापना काल " : "Founded "}{site.founded}
              </span>
              {site.asiCode && (
                <span className="bg-black/40 px-2 py-0.5 rounded text-[10px] font-mono text-saffron-300 border border-saffron-400/30">
                  {site.asiCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Sacred Access Banner with Integrated Location & Google Maps Redirection */}
        <div className="px-4 md:px-6 max-w-5xl mx-auto -mt-3 relative z-10">
          <SacredAccessBanner
            status={protocol.currentStatus || "open"}
            photographyAllowed={protocol.photographyAllowed || "permitted"}
            interiorAccess={protocol.interiorAccess || "open"}
            specialNotice={protocol.specialNotice}
            location={site.location}
            district={site.district}
            state={site.state}
            address={site.address}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-30 glass-card border-b border-parchment-200 mt-4 shadow-xs">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap
                               border-b-2 transition-all min-h-[48px] ${
                                 activeTab === tab.key
                                   ? "border-forest-700 text-forest-700 bg-forest-50/40 font-bold"
                                   : "border-transparent text-stone-500 hover:text-stone-800"
                               }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
          {/* TAB 1: STORY & HISTORY */}
          {activeTab === "story" && (
            <div className="space-y-8 animate-fade-in">
              <div className="heritage-card p-6 bg-white border border-parchment-300 rounded-2xl shadow-xs">
                <h2 className="text-xl font-heading font-bold text-forest-800 mb-2">
                  {site.tagline}
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed font-sans">
                  {site.description.en}
                </p>
                {site.description.hi && (
                  <p className="text-xs text-stone-500 mt-3 italic border-t border-parchment-200 pt-3">
                    {site.description.hi}
                  </p>
                )}
              </div>

              {/* Oral Histories & Voice Engine */}
              {oralHistoriesList.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-bold text-forest-800 flex items-center gap-2">
                      <Volume2 size={20} className="text-saffron-600" />
                      Live Oral Histories & Spoken Narratives ({oralHistoriesList.length})
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      Voice Engine Ready
                    </span>
                  </div>
                  <div className="space-y-4">
                    {oralHistoriesList.map((story) => (
                      <div
                        key={story.id}
                        className="bg-white p-5 shadow-xs hover:shadow-md transition-all rounded-2xl border border-parchment-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-heading font-bold text-forest-900 text-base">
                              {story.title}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Narrated by <strong>{story.narrator}</strong> · Era: <strong>{story.era || "Living Tradition"}</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleToggleVoice(story)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                              playingStoryId === story.id
                                ? "bg-red-600 text-white animate-pulse"
                                : "bg-saffron-100 text-saffron-900 hover:bg-saffron-200"
                            }`}
                          >
                            {playingStoryId === story.id ? (
                              <>
                                <VolumeX size={14} />
                                <span>Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={14} />
                                <span>Listen Audio</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-stone-700 leading-relaxed italic bg-parchment-50 p-3 rounded-xl border border-parchment-200 my-3">
                          &ldquo;{story.fullText}&rdquo;
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                          <span>Custodian Authority: {story.approvedBy || "Curator Board"}</span>
                          <span>Verified: {story.approvedDate || "2024"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Monuments Graph */}
              {relationsList.length > 0 && (
                <div>
                  <h3 className="text-lg font-heading font-bold text-forest-800 flex items-center gap-2 mb-4">
                    <Compass size={20} className="text-forest-600" />
                    Historically & Geographically Related Sites
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {relationsList.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/heritage/${rel.relatedSiteSlug || rel.relatedSiteId}`}
                        className="group bg-white p-4 rounded-2xl border border-parchment-300 hover:border-forest-600 shadow-xs hover:shadow-md transition flex items-center gap-3"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={rel.relatedSiteImage || `/images/monasteries/${rel.relatedSiteId}.png`}
                            alt={rel.relatedSiteName || "Related site"}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider block">
                            {rel.relationType.replace("_", " ")} {rel.distanceKm ? `(${rel.distanceKm} km)` : ""}
                          </span>
                          <h4 className="font-heading font-bold text-forest-900 text-xs truncate group-hover:text-forest-700">
                            {rel.relatedSiteName}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {rel.description || "Connected Heritage Node"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PLAN VISIT */}
          {activeTab === "plan" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visiting Hours & Entry Fees */}
                <div className="heritage-card p-6 bg-white border border-parchment-300 rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-forest-800 text-base flex items-center gap-2">
                    <Clock size={18} className="text-saffron-600" />
                    Visiting Timings & Entry Protocol
                  </h3>

                  <div className="grid grid-cols-2 gap-3 bg-parchment-50 p-4 rounded-xl border border-parchment-200">
                    <div>
                      <span className="text-[11px] text-stone-500 block">Daily Opening</span>
                      <span className="text-sm font-bold text-forest-800">{visitingHours.open || "06:00 AM"}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">Daily Closing</span>
                      <span className="text-sm font-bold text-forest-800">{visitingHours.close || "06:00 PM"}</span>
                    </div>
                  </div>

                  {visitingHours.entryFee && (
                    <div className="space-y-2 border-t border-parchment-200 pt-3">
                      <span className="text-xs font-semibold text-stone-700">Entry Ticketing:</span>
                      <div className="flex justify-between text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-parchment-200">
                        <span>Indian National Visitors:</span>
                        <span className="font-bold text-forest-800">{visitingHours.entryFee.indian || "Standard"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-parchment-200">
                        <span>International Tourists:</span>
                        <span className="font-bold text-forest-800">{visitingHours.entryFee.foreign || "Standard"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custodian & Emergency Contacts */}
                <div className="heritage-card p-6 bg-white border border-parchment-300 rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-heading font-bold text-forest-800 text-base flex items-center gap-2">
                    <PhoneCall size={18} className="text-saffron-600" />
                    Custodian & Emergency Helpline
                  </h3>

                  <div className="space-y-2.5 text-xs text-stone-700">
                    <div className="flex items-center justify-between p-2.5 bg-parchment-50 rounded-xl border border-parchment-200">
                      <span className="text-stone-500">Official Steward:</span>
                      <span className="font-bold text-forest-800">{site.steward}</span>
                    </div>

                    {site.contact.phone && (
                      <div className="flex items-center justify-between p-2.5 bg-parchment-50 rounded-xl border border-parchment-200">
                        <span className="text-stone-500">Phone Helpline:</span>
                        <a href={`tel:${site.contact.phone}`} className="font-bold text-forest-700 hover:underline">
                          {site.contact.phone}
                        </a>
                      </div>
                    )}

                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1 text-red-900">
                      <span className="font-bold text-[11px] block">Emergency Services (24x7):</span>
                      <p className="text-[11px]">Local Police & Medical Post: <strong>112 / 108</strong></p>
                      <p className="text-[11px]">Incredible India Tourism Helpline: <strong>1800-11-1363</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nearby Services */}
              {site.nearbyServices && site.nearbyServices.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-parchment-300 shadow-xs">
                  <h3 className="font-heading font-bold text-forest-800 text-base mb-4 flex items-center gap-2">
                    <Building size={18} className="text-forest-600" />
                    Approved Accommodations, Certified Guides & Transport
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {site.nearbyServices.map((srv, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-parchment-50 border border-parchment-200">
                        <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider block">
                          {srv.type} · {srv.distance}
                        </span>
                        <h4 className="font-bold text-forest-900 text-xs mt-0.5">{srv.name}</h4>
                        <span className="badge-approved text-[10px] mt-2 inline-flex">
                          ✓ Tourism Department Approved
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 360 VIRTUAL TOUR */}
          {activeTab === "virtual" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center border-4 border-stone-800 group">
                <Image
                  src={site.heroImage || `/images/monasteries/${site.id}.png`}
                  alt={`${site.name.en} 360 panorama`}
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-10 text-center p-6 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-saffron-500/90 text-white flex items-center justify-center mx-auto mb-3 shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform">
                    <Eye size={28} />
                  </div>
                  <h3 className="text-white font-heading font-bold text-xl drop-shadow-md">
                    Interactive 360° Spherical Tour
                  </h3>
                  <p className="text-xs text-white/80 mt-1 mb-5 leading-relaxed">
                    Ultra-High DPI photogrammetry capture authorized by {site.steward}.
                  </p>
                  <Link
                    href={`/monastery/${site.id}/virtual`}
                    className="btn-saffron text-xs py-3 px-8 rounded-xl font-bold shadow-lg inline-flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <Eye size={16} />
                    <span>{language === "hi" ? "360° VR मोड में प्रवेश करें" : "Enter 360° VR Mode"}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOURCES & PROVENANCE (Institutional Credibility) */}
          {activeTab === "preservation" && (
            <div className="space-y-6 animate-fade-in">
              <div className="heritage-card p-6 bg-white border border-parchment-300 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-parchment-200 mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-forest-800 text-lg">
                      Academic Citations & Provenance Registry
                    </h3>
                    <p className="text-xs text-stone-500">
                      All historical information, architectural dating, and access rules are verified against official gazetteers and repositories.
                    </p>
                  </div>
                  <span className="badge-approved text-xs">
                    <Shield size={13} />
                    Verified Provenance
                  </span>
                </div>

                <div className="space-y-3">
                  {sourcesList.length > 0 ? (
                    sourcesList.map((src) => (
                      <div key={src.id} className="p-4 rounded-xl bg-parchment-50 border border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-mono">
                              {src.sourceType}
                            </span>
                            <h4 className="font-bold text-forest-900 text-xs">{src.title}</h4>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{src.citation}</p>
                          <span className="text-[10px] text-stone-400 mt-0.5 block">Publisher: {src.publisher}</span>
                        </div>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline-heritage text-xs py-1.5 px-3 flex items-center gap-1 shrink-0 self-start sm:self-center"
                          >
                            <span>Verify Source</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-mono">
                          ASI
                        </span>
                        <h4 className="font-bold text-forest-900 text-xs">Archaeological Survey of India & Ministry of Culture</h4>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        National Inventory of Protected Monuments under Ancient Monuments and Archaeological Sites and Remains Act (AMASR 1958).
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Manuscripts & Archival Glass Plates */}
              {relatedArchives.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-parchment-300 shadow-xs">
                  <h3 className="font-heading font-bold text-forest-800 text-base mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-forest-600" />
                    Digitized Manuscripts & Historical Glass Plates ({relatedArchives.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedArchives.map((arc) => (
                      <div
                        key={arc.id}
                        onClick={() => setSelectedArchive(arc)}
                        className="cursor-pointer p-4 rounded-xl bg-parchment-50 border border-parchment-200 hover:border-forest-600 transition flex items-center gap-3"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={(arc as any).thumbnail || (arc as any).fullImage || "/images/archives/default.jpg"} alt={arc.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-forest-900 text-xs truncate">{arc.title}</h4>
                          <p className="text-[11px] text-stone-500 truncate">{arc.era} · {(arc as any).medium || arc.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Archive Modal */}
      {selectedArchive && (
        <ArchiveReaderModal
          record={selectedArchive}
          onClose={() => setSelectedArchive(null)}
        />
      )}
    </div>
  );
}
