"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mountain,
  Download,
  Camera,
  CameraOff,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MonasteryCardProps {
  id: string;
  name: { en: string; hi?: string } | any;
  tagline?: string;
  district?: string;
  sect?: string;
  altitude?: string;
  heroImage?: string;
  offlinePackSize?: string;
  photographyAllowed?: string;
  currentStatus?: string;
  virtualTourAvailable?: boolean;
}

export default function MonasteryCard({
  id,
  name,
  tagline,
  district,
  sect,
  altitude,
  heroImage,
  offlinePackSize = "12 MB",
  photographyAllowed = "permitted",
  currentStatus = "open",
  virtualTourAvailable = true,
}: MonasteryCardProps) {
  const { language } = useI18n();
  const displayName = typeof name === "string" ? name : (language === "hi" && name?.hi ? name.hi : name?.en || id);
  const secondaryName = typeof name === "string" ? "" : (language === "hi" ? name?.en : name?.hi);

  const photoIcon =
    photographyAllowed === "not-permitted" ? CameraOff : Camera;
  const PhotoIcon = photoIcon;

  return (
    <Link
      href={`/heritage/${id}`}
      onClick={() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("explore_view_mode", "list");
          sessionStorage.setItem("explore_scroll_target", id);
          sessionStorage.setItem("monastery_return_url", window.location.pathname || "/explore");
        }
      }}
      className="block min-h-0 min-w-0"
    >
      <article className="monastery-card group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <Image
            src={heroImage || `/images/monasteries/${id}.png`}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentStatus === "open"
                  ? "bg-forest-600/90 text-white"
                  : currentStatus === "restricted"
                  ? "bg-saffron-500/90 text-white"
                  : "bg-maroon-700/90 text-white"
              }`}
            >
              {currentStatus}
            </span>
          </div>


          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-heading text-xl font-bold leading-tight drop-shadow-md">
              {displayName}
            </h3>
            {secondaryName && (
              <p className="text-saffron-200/90 text-xs font-medium mt-0.5">
                {secondaryName}
              </p>
            )}
            <p className="text-white/80 text-xs mt-1 line-clamp-1">{tagline}</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <MapPin size={12} className="text-forest-600" />
              {district}
            </span>
            <span className="text-parchment-300">•</span>
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <Mountain size={12} className="text-forest-600" />
              {altitude}
            </span>

          </div>

          <div className="flex items-center justify-between border-t border-parchment-200/80 pt-3">
            <span className="text-xs font-semibold text-saffron-700 bg-saffron-50 px-2.5 py-0.5 rounded border border-saffron-200">
              {sect}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-stone-500 font-medium" title={photographyAllowed}>
                <PhotoIcon size={12} />
              </span>
              <span className="flex items-center gap-1 text-[10px] text-forest-700 font-semibold bg-forest-50 px-2 py-0.5 rounded">
                <Download size={10} />
                {offlinePackSize}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
