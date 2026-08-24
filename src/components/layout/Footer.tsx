"use client";

import React from "react";
import Link from "next/link";
import { HeritageEmblem } from "@/components/ui/BrandLogo";
import { useI18n } from "@/lib/i18n";
import { Compass, MapPin, Route, BookOpen, Download, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  const { language, t } = useI18n();

  return (
    <footer className="bg-forest-950 text-parchment-100 border-t border-forest-800/60 pt-12 pb-20 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-forest-800/60">
          {/* Col 1: Brand & Emblem */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <HeritageEmblem size="lg" />
              <div>
                <h3 className="font-heading font-extrabold text-white text-base md:text-lg tracking-wide uppercase leading-tight">
                  {language === "hi" ? "भारत धरोहर एवं पर्यटन एटलस" : "BHARAT HERITAGE & TOURISM ATLAS"}
                </h3>
                <p className="text-xs font-bold text-saffron-400 tracking-[0.2em] uppercase mt-0.5">
                  SYNTAXUS · AICTE PS ID 26202
                </p>
              </div>
            </div>
            <p className="text-xs text-parchment-300/80 max-w-md leading-relaxed">
              Open-access national platform for geospatial heritage exploration, 360° virtual preservation, and sustainable community empowerment across India's sacred sanctuaries and hidden gems.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold text-saffron-300 uppercase tracking-wider mb-3">
              Atlas Corridors
            </h4>
            <ul className="space-y-2 text-xs text-parchment-300/90 font-medium">
              <li>
                <Link href="/explore" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <MapPin size={12} className="text-saffron-400" /> All-India Map
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <Route size={12} className="text-saffron-400" /> National Circuits
                </Link>
              </li>
              <li>
                <Link href="/archives" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <BookOpen size={12} className="text-saffron-400" /> Digital Archives & Epigraphs
                </Link>
              </li>
              <li>
                <Link href="/offline" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <Download size={12} className="text-saffron-400" /> Offline Travel Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance & AICTE */}
          <div>
            <h4 className="font-heading text-xs font-bold text-saffron-300 uppercase tracking-wider mb-3">
              Governance & Custodians
            </h4>
            <ul className="space-y-2 text-xs text-parchment-300/90 font-medium">
              <li>
                <Link href="/curator" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <Shield size={12} className="text-saffron-400" /> Custodian & Curator Portal
                </Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-saffron-300 transition flex items-center gap-1.5">
                  <Sparkles size={12} className="text-saffron-400" /> Pilgrim Heritage Passport
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded-xl bg-forest-900/60 border border-forest-800 text-[11px] text-parchment-300">
              <span className="font-bold text-saffron-400">Problem Statement ID:</span> 26202
              <p className="text-[10px] text-parchment-400/80 mt-0.5">Empowering Local Artisans, Hotels & Heritage Stewards</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-parchment-400/80">
          <p>© {new Date().getFullYear()} BHARAT HERITAGE & TOURISM ATLAS. Built with pride by Team SYNTAXUS.</p>
          <p className="font-mono text-[10px]">v2.4.0 · 58 Verified Heritage Sites</p>
        </div>
      </div>
    </footer>
  );
}
