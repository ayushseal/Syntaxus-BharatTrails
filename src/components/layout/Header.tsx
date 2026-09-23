"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Compass,
  MapPin,
  Route,
  BookOpen,
  Download,
  Menu,
  X,
  Globe,
  WifiOff,
  Shield,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";

import BrandLogo from "@/components/ui/BrandLogo";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Real connectivity check — navigator.onLine is unreliable on mobile
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        await fetch("/manifest.json", {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeout);
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 5000);

    const handleOnline = () => checkConnectivity();
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Compass },
    { href: "/explore", label: t("nav.explore"), icon: MapPin },
    { href: "/plan", label: t("nav.plan"), icon: Route },
    { href: "/geoshield", label: t("nav.geoshield") || "GeoShield", icon: ShieldAlert, badge: "Live" },
    { href: "/archives", label: t("nav.archives"), icon: BookOpen },
    { href: "/offline", label: t("nav.offline"), icon: Download },
  ];

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-parchment-300 shadow-xs backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-1.5 lg:gap-2 xl:gap-3">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-parchment-200 transition-colors lg:hidden min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X size={20} className="text-forest-700" />
              ) : (
                <Menu size={20} className="text-forest-700" />
              )}
            </button>

            <BrandLogo />
          </div>

          {/* Center: Structured Navigation Buttons */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-parchment-200/80 p-0.5 xl:p-1 rounded-full border border-parchment-300 shadow-inner backdrop-blur-sm shrink"
            aria-label="Desktop navigation"
          >
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 xl:px-3 py-1 xl:py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-1 min-h-[30px] whitespace-nowrap ${
                    isActive
                      ? "bg-forest-700 text-white shadow-sm font-bold scale-[1.02]"
                      : "text-stone-600 hover:text-forest-900 hover:bg-white/90"
                  }`}
                >
                  <Icon
                    size={12}
                    className={`transition-colors shrink-0 ${
                      isActive ? "text-saffron-300" : item.badge ? "text-[#145C45]" : "text-stone-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase shadow-xs shrink-0"
                      style={{
                        backgroundColor: "#145C45",
                        color: "#FFFFFF",
                        border: "1px solid #145C45",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Online Pill + Multi-Language Dropdown + Curator Portal */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Real online/offline indicator */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                isOnline
                  ? "bg-forest-50 text-forest-700 border-forest-200"
                  : "bg-saffron-50 text-saffron-700 border-saffron-300 animate-pulse"
              }`}
              title={isOnline ? "Connected to Internet" : "Running from Offline Cache"}
            >
              {isOnline ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              ) : (
                <WifiOff size={12} className="shrink-0" />
              )}
              <span className="hidden 2xl:inline">{isOnline ? t("common.online") : t("common.offline")}</span>
            </div>

            {/* Multi-Language Instant Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-white text-forest-800 hover:bg-parchment-100 transition-all shadow-xs border border-parchment-300 min-h-[32px]"
                aria-label="Select Language"
              >
                <Globe size={13} className="text-saffron-600 shrink-0" />
                <span>{currentLangObj.native}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 text-stone-400 ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-11 bg-white/95 backdrop-blur-md rounded-2xl border border-parchment-300 shadow-2xl p-2 w-56 animate-fade-in z-50 max-h-80 overflow-y-auto">
                  <div className="space-y-0.5">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as SupportedLanguage);
                          if (typeof window !== "undefined" && window.changeGoogleLanguage) {
                            window.changeGoogleLanguage(l.code);
                          }
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                          language === l.code
                            ? "bg-forest-700 text-white font-bold shadow-xs"
                            : "text-stone-700 hover:bg-parchment-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.native}</span>
                          <span className={`text-[10px] ${language === l.code ? "text-white/80" : "text-stone-400"}`}>
                            ({l.label})
                          </span>
                        </div>
                        {language === l.code && <Check size={14} className="text-saffron-300 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Curator link */}
            <Link
              href="/curator"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-maroon-800 text-white hover:bg-maroon-700 transition-all min-h-[30px] sm:min-h-[32px] shadow-sm hover:shadow-md border border-maroon-900 shrink-0 whitespace-nowrap"
            >
              <Shield size={12} className="text-saffron-300 shrink-0" />
              <span className="hidden xl:inline">Curator Portal</span>
              <span className="inline xl:hidden">Curator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden border-t border-parchment-200 bg-parchment-50/95 backdrop-blur-lg animate-fade-in shadow-2xl">
          <nav className="px-4 py-4 space-y-1.5" aria-label="Mobile navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                    isActive
                      ? "bg-forest-700 text-white shadow-sm"
                      : "text-stone-700 hover:bg-parchment-200"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-saffron-300" : item.badge ? "text-red-500" : "text-stone-400"}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-parchment-200 flex flex-col gap-2">
              <Link
                href="/passport"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:bg-parchment-200 transition-all min-h-[44px]"
              >
                <Sparkles size={18} className="text-saffron-600" />
                <span>{t("nav.passport")}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
