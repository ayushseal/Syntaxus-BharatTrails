import { CheckCircle, AlertCircle, Lock, ShieldCheck, BookOpen, Users, Compass, MapPin, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ConsentBadgeProps {
  type: "monastery-approved" | "researcher-reviewed" | "community-contributed";
  size?: "sm" | "md";
}

const badgeConfig: Record<string, { label: string; labelHi: string; icon: any; className: string }> = {
  "monastery-approved": {
    label: "Monastery Approved",
    labelHi: "संरक्षक द्वारा स्वीकृत",
    icon: ShieldCheck,
    className: "badge-approved",
  },
  "researcher-reviewed": {
    label: "Researcher Reviewed",
    labelHi: "शोधकर्ताओं द्वारा समीक्षित",
    icon: BookOpen,
    className: "bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 inline-flex items-center gap-1",
  },
  "community-contributed": {
    label: "Community Contributed",
    labelHi: "समुदाय द्वारा योगदान",
    icon: Users,
    className: "bg-parchment-200 text-stone-700 px-3 py-1 rounded-full text-xs font-semibold border border-parchment-300 inline-flex items-center gap-1",
  },
};

export function ConsentBadge({ type, size = "md" }: ConsentBadgeProps) {
  const { language } = useI18n();
  const config = badgeConfig[type] || badgeConfig["monastery-approved"];
  const Icon = config.icon;
  const displayLabel = language === "hi" ? config.labelHi : config.label;

  return (
    <span className={`${config.className} ${size === "sm" ? "text-[10px] px-2 py-0.5" : ""}`}>
      <Icon size={size === "sm" ? 10 : 12} />
      {displayLabel}
    </span>
  );
}

interface PermissionLabelProps {
  label: string;
  approvedBy?: string;
  approvedDate?: string;
  capturedBy?: string;
  captureDate?: string;
}

export function PermissionLabel({
  label,
  approvedBy,
  approvedDate,
  capturedBy,
  captureDate,
}: PermissionLabelProps) {
  return (
    <div className="bg-forest-50 border border-forest-200 rounded-heritage p-3 text-xs text-forest-800">
      <div className="flex items-start gap-2">
        <CheckCircle size={14} className="text-forest-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">{label}</p>
          {approvedBy && (
            <p className="mt-1 text-forest-600">Approved by: {approvedBy}</p>
          )}
          {approvedDate && (
            <p className="text-forest-600">Date: {approvedDate}</p>
          )}
          {capturedBy && (
            <p className="mt-1 text-forest-600">Captured by: {capturedBy}</p>
          )}
          {captureDate && (
            <p className="text-forest-600">Capture date: {captureDate}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface AccessStatusProps {
  status: string;
  photographyAllowed: string;
  interiorAccess: string;
  specialNotice?: string | null;
  lastUpdated?: string;
  updatedBy?: string;
  location?: { lat: number; lng: number };
  district?: string;
  state?: string;
  address?: string;
}

export function SacredAccessBanner({
  status,
  photographyAllowed,
  interiorAccess,
  specialNotice,
  lastUpdated = "Live Broadcast",
  updatedBy = "ASI & Monastery Curator Board",
  location,
  district,
  state,
  address,
}: AccessStatusProps) {
  const { language } = useI18n();
  const statusColors: Record<string, string> = {
    open: "bg-forest-50 border-forest-200 text-forest-900",
    restricted: "bg-saffron-50 border-saffron-200 text-saffron-900",
    closed: "bg-maroon-50 border-maroon-200 text-maroon-900",
  };

  const photoLabels: Record<string, string> = {
    permitted: "Photography Permitted",
    "courtyard-only": "Courtyard Photography Only",
    "exterior-only": "Exterior Photography Only",
    "exterior-and-courtyard": "Exterior & Courtyard Only",
    "ground-floor-only": "Ground Floor Only",
    "not-permitted": "No Photography",
  };

  const lat = location?.lat;
  const lng = location?.lng;
  const googleMapsUrl = (lat && lng)
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : undefined);

  return (
    <div
      className={`rounded-heritage border p-4 shadow-sm ${statusColors[status] || statusColors.open}`}
    >
      {specialNotice && (
        <div className="flex items-start gap-2 mb-3 p-2.5 bg-white/75 backdrop-blur-xs rounded-xl border border-forest-200/50">
          <AlertCircle size={15} className="text-saffron-600 mt-0.5 shrink-0" />
          <p className="text-xs md:text-sm font-medium">{specialNotice}</p>
        </div>
      )}
      
      {/* Natural Even-Spaced Metrics Row without Lines */}
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 text-xs">
        {/* 1. Status */}
        <div className="flex flex-col justify-center shrink-0">
          <p className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider mb-0.5">
            {language === "hi" ? "स्थिति" : "Status"}
          </p>
          <p className="capitalize flex items-center gap-1.5 font-bold text-forest-800 text-sm">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                status === "open"
                  ? "bg-forest-500 animate-pulse"
                  : status === "restricted"
                  ? "bg-saffron-500"
                  : "bg-maroon-700"
              }`}
            />
            {status}
          </p>
        </div>

        {/* 2. Photography */}
        <div className="flex flex-col justify-center shrink-0">
          <p className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider mb-0.5">
            {language === "hi" ? "फोटोग्राफी" : "Photography"}
          </p>
          <p className="font-medium text-stone-800 text-xs sm:text-[13px] whitespace-nowrap">
            {photoLabels[photographyAllowed] || photographyAllowed}
          </p>
        </div>

        {/* 3. Interior Access */}
        <div className="flex flex-col justify-center shrink-0">
          <p className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider mb-0.5">
            {language === "hi" ? "आंतरिक दर्शन" : "Interior"}
          </p>
          <p className="capitalize font-medium text-stone-800 text-xs sm:text-[13px] whitespace-nowrap">
            {interiorAccess}
          </p>
        </div>

        {/* 4. Updated */}
        <div className="flex flex-col justify-center shrink-0">
          <p className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider mb-0.5">
            {language === "hi" ? "अद्यतन" : "Updated"}
          </p>
          <p className="font-medium text-stone-800 text-xs sm:text-[13px] whitespace-nowrap">
            {lastUpdated}
          </p>
        </div>

        {/* 5. Google Maps Navigation */}
        <div className="flex flex-col items-start sm:items-end justify-center shrink-0">
          {googleMapsUrl ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Open exact location in Google Maps"
            >
              <Compass size={13} className="text-saffron-300" />
              <span>Google Maps ↗</span>
            </a>
          ) : null}
          {lat && lng && (
            <span className="text-[10px] text-stone-500 font-mono tracking-tight mt-1 flex items-center gap-1">
              <MapPin size={9} className="text-forest-600" />
              {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
            </span>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-forest-200/50 text-[10px] text-stone-500">
        <p className="opacity-75 flex items-center gap-1">
          <Lock size={9} className="inline" />
          Verified by {updatedBy}
        </p>
        {(district || state) && (
          <p className="font-medium text-forest-700 truncate max-w-[200px] sm:max-w-none">
            📍 {district ? `${district}, ` : ""}{state || ""}
          </p>
        )}
      </div>
    </div>
  );
}
