"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function HeritageEmblem({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-9 h-9 md:w-10 md:h-10";

  return (
    <div
      className={`${dim} relative rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md border border-saffron-400/60 ring-1 ring-saffron-500/20 group-hover:scale-105 group-hover:border-saffron-500 group-hover:shadow-heritage transition-all duration-300 shrink-0 overflow-hidden`}
    >
      <Image
        src="/images/brand/logo.png"
        alt="Bharat Heritage & Tourism Atlas Official Emblem"
        fill
        className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 36px, 48px"
        priority
      />
    </div>
  );
}

export default function BrandLogo({ size = "md", className = "", showText = true }: BrandLogoProps) {
  const { language } = useI18n();

  const titleEn = "BHARAT HERITAGE & TOURISM ATLAS";
  const titleHi = "भारत धरोहर एवं पर्यटन एटलस";
  const displayTitle = language === "hi" ? titleHi : titleEn;

  return (
    <Link href="/" className={`flex items-center gap-2.5 min-h-0 min-w-0 shrink-0 group ${className}`}>
      <HeritageEmblem size={size} />

      {showText && (
        <div className="flex flex-col justify-center select-none min-w-0">
          {/* TOP & BOLD: Bharat Heritage and Tourism Atlas */}
          <span className="text-[11px] sm:text-xs md:text-[13px] lg:text-[14px] font-heading font-black text-forest-900 leading-tight tracking-tight uppercase group-hover:text-forest-700 transition-colors whitespace-nowrap">
            {displayTitle}
          </span>

          {/* BOTTOM: Team Name SYNTAXUS */}
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] md:text-[10px] font-bold text-saffron-600 tracking-[0.18em] uppercase leading-none">
              SYNTAXUS
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
