"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Eye,
  BookOpen,
  Download,
  ArrowRight,
  Calendar,
  Shield,
  ChevronRight,
  Compass,
  Mountain,
  Heart,
  Route,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MonasteryCard from "@/components/monastery/MonasteryCard";
import fallbackMonasteries from "@/data/monasteries.json";
import fallbackTrails from "@/data/trails.json";
import { useI18n } from "@/lib/i18n";
import { searchHeritageMonuments } from "@/lib/searchEngine";

export default function HomePage() {
  const [monasteriesList, setMonasteriesList] = useState<any[]>(fallbackMonasteries);
  const [trailsList, setTrailsList] = useState<any[]>(fallbackTrails);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const { language, t } = useI18n();

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [sitesRes, circuitsRes] = await Promise.all([
          fetch("/api/heritage", { cache: "no-store" }),
          fetch("/api/circuits", { cache: "no-store" }),
        ]);
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          if (sitesData.data && sitesData.data.length > 0) {
            setMonasteriesList(sitesData.data);
          }
        }
        if (circuitsRes.ok) {
          const circuitsData = await circuitsRes.json();
          if (circuitsData.data && circuitsData.data.length > 0) {
            setTrailsList(circuitsData.data);
          }
        }
      } catch (e) {
        console.warn("Using fallback data on home page:", e);
      }
    }
    loadLiveData();
  }, []);

  const targetHeroIds = ["rumtek", "qutub", "lonar"];
  const heroMonasteries = targetHeroIds
    .map((id) => monasteriesList.find((m) => m.id === id))
    .filter(Boolean) as typeof monasteriesList;
  const currentHeroList = heroMonasteries.length > 0 ? heroMonasteries : monasteriesList.slice(0, 3);

  // Auto-advance hero carousel every 5 seconds
  useEffect(() => {
    if (heroPaused || currentHeroList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % currentHeroList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroPaused, currentHeroList.length]);

  // Resume auto-advance 8 seconds after manual dot click
  useEffect(() => {
    if (!heroPaused) return;
    const resume = setTimeout(() => setHeroPaused(false), 8000);
    return () => clearTimeout(resume);
  }, [heroPaused]);

  const filteredMonasteries = searchQuery
    ? searchHeritageMonuments(searchQuery, monasteriesList)
    : monasteriesList;

  const currentHero = currentHeroList[activeHeroIndex] || currentHeroList[0] || monasteriesList[0];
  const heroName = typeof currentHero?.name === "string" ? currentHero.name : (language === "hi" && currentHero?.name?.hi ? currentHero.name.hi : currentHero?.name?.en || currentHero?.id || "Monastery");


  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative h-[480px] md:h-[560px] overflow-hidden">
          {currentHeroList.map((monastery, index) => (
            <div
              key={monastery.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeHeroIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={monastery.heroImage || `/images/monasteries/${monastery.id}.png`}
                alt={typeof monastery.name === "string" ? monastery.name : monastery.name?.en || monastery.id}
                fill
                className={`object-cover transition-transform duration-[5000ms] ease-linear ${
                  index === activeHeroIndex ? "scale-110" : "scale-100"
                }`}
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-forest-900/40" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-2 drop-shadow-md">
                {heroName}
              </h2>
              <p className="text-white/85 text-sm md:text-base max-w-xl mb-6 drop-shadow-sm">
                {currentHero?.tagline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/heritage/${currentHero?.id}`}
                  className="btn-heritage shadow-lg"
                >
                  {t("home.exploreMonastery")}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Hero dots */}
            <div className="flex items-center gap-2 mt-6">
              {currentHeroList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveHeroIndex(index);
                    setHeroPaused(true);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 min-h-0 min-w-0 ${
                    index === activeHeroIndex
                      ? "w-8 bg-saffron-400"
                      : "w-3 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`View ${typeof currentHeroList[index]?.name === "string" ? currentHeroList[index].name : currentHeroList[index]?.name?.en || "slide"}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="relative -mt-7 px-4 md:px-6 max-w-3xl mx-auto z-10">
          <div className="glass-card shadow-heritage-lg p-2 border border-parchment-300">
            <div className="flex items-center gap-3 px-4">
              <Search size={20} className="text-forest-600 shrink-0" />
              <input
                type="text"
                placeholder={t("common.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 bg-transparent text-stone-800 placeholder:text-stone-400 
                           focus:outline-none text-sm font-medium min-h-[44px]"
                id="monastery-search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-stone-400 hover:text-stone-600 min-h-0 min-w-0 px-2 font-medium"
                >
                  {t("common.clear")}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions (5 Core Pillars) */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {[
              {
                icon: Compass,
                label: t("home.quickMap"),
                desc: t("home.quickMapDesc"),
                href: "/explore",
                color: "bg-forest-50/90 text-forest-800 border-forest-200 hover:bg-forest-100/90 hover:border-forest-400",
                iconColor: "text-forest-700",
              },
              {
                icon: Route,
                label: t("nav.plan"),
                desc: "Themed itineraries",
                href: "/plan",
                color: "bg-emerald-50/90 text-emerald-800 border-emerald-200 hover:bg-emerald-100/90 hover:border-emerald-400",
                iconColor: "text-emerald-700",
              },
              {
                icon: Eye,
                label: t("home.quickVirtual"),
                desc: t("home.quickVirtualDesc"),
                href: "/monastery/rumtek/virtual",
                color: "bg-saffron-50/90 text-saffron-800 border-saffron-200 hover:bg-saffron-100/90 hover:border-saffron-400",
                iconColor: "text-saffron-600",
              },
              {
                icon: BookOpen,
                label: t("home.quickOral"),
                desc: t("home.quickOralDesc"),
                href: "/archives",
                color: "bg-amber-50/90 text-amber-800 border-amber-200 hover:bg-amber-100/90 hover:border-amber-400",
                iconColor: "text-amber-700",
              },
              {
                icon: Download,
                label: t("home.quickOffline"),
                desc: t("home.quickOfflineDesc"),
                href: "/offline",
                color: "bg-parchment-100/90 text-stone-800 border-parchment-300 hover:bg-parchment-200 hover:border-stone-400",
                iconColor: "text-stone-700",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center text-center justify-center p-4 rounded-xl border shadow-xs 
                           hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-h-[105px] ${action.color}`}
              >
                <action.icon size={22} className={`mb-1.5 ${action.iconColor}`} />
                <span className="text-xs font-bold leading-snug">{action.label}</span>
                <span className="text-[10px] text-stone-500 font-medium mt-0.5">{action.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Monasteries Grid */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest-700">
                {t("home.sacredMonasteries")}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {filteredMonasteries.length} {t("home.verifiedMonasteries")}
              </p>
            </div>
            <Link
              href="/explore"
              className="text-sm text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1 group"
            >
              {t("home.viewMap")}
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonasteries.map((monastery) => (
              <MonasteryCard
                key={monastery.id}
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
            ))}
          </div>
        </section>

        {/* Heritage Trails */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-forest-700">
                {t("home.heritageTrails")}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {t("home.trailsDesc")}
              </p>
            </div>
            <Link
              href="/plan"
              className="text-sm text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1 group"
            >
              {t("home.planTrip")}
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trailsList.slice(0, 3).map((trail) => {
              const trailName = typeof trail.name === "string" ? trail.name : (language === "hi" && trail.name?.hi ? trail.name.hi : trail.name?.en || trail.id);
              const stopCount = trail.stops ? trail.stops.length : (trail.monasteries ? trail.monasteries.length : 4);
              return (
                <Link
                  key={trail.id}
                  href="/plan"
                  className="block heritage-border p-5 bg-parchment-50 hover:shadow-card-hover 
                             transition-all duration-300 hover:-translate-y-1 min-h-0 min-w-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-heading text-lg font-semibold text-forest-700">
                      {trailName}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        trail.difficulty === "Easy"
                          ? "bg-forest-50 text-forest-600 border border-forest-200"
                          : trail.difficulty === "Moderate"
                          ? "bg-saffron-50 text-saffron-600 border border-saffron-200"
                          : "bg-maroon-50 text-maroon-700 border border-maroon-200"
                      }`}
                    >
                      {trail.difficulty || "Moderate"}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 line-clamp-2">
                    {trail.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-stone-500 border-t border-parchment-200/80 pt-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-forest-600" />
                      {trail.distance || trail.totalDistance || "150 km"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-forest-600" />
                      {trail.duration || trail.estimatedTime || "3 Days"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mountain size={12} className="text-forest-600" />
                      {stopCount} stops
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Respect Passport Teaser */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="bg-heritage-gradient rounded-heritage p-6 md:p-8 text-white relative overflow-hidden shadow-heritage-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} className="text-saffron-300" />
                <span className="text-xs font-semibold text-saffron-300 uppercase tracking-wider">
                  {t("nav.passport")}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                {t("home.passportTitle")}
              </h2>
              <p className="text-white/80 text-sm max-w-lg mb-5 leading-relaxed">
                {t("home.passportDesc")}
              </p>
              <Link
                href="/passport"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 
                           hover:bg-white/20 rounded-heritage text-sm font-medium transition-all border border-white/20 backdrop-blur-sm"
              >
                {t("home.startJourney")}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Cultural Promise */}
        <section className="section-padding max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <Shield size={32} className="text-forest-600 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-forest-700 mb-3">
              {t("home.culturalPromiseTitle")}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">
              {t("home.culturalPromiseDesc")}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { number: "100%", label: t("home.stat1") },
                { number: "36", label: t("home.stat2") },
                { number: "300+", label: t("home.stat3") },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-parchment-100/60 border border-parchment-200">
                  <p className="text-2xl md:text-3xl font-heading font-bold text-saffron-600">
                    {stat.number}
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tagline Footer */}
        <section className="px-4 pb-8 text-center">
          <p className="font-heading text-lg text-forest-700 italic">
            &ldquo;{t("common.subTagline")}&rdquo;
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
