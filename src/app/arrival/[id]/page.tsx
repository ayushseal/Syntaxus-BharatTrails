"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  VolumeX,
  Footprints,
  Shirt,
  RotateCw,
  MapPin,
  Phone,
  AlertCircle,
  Shield,
} from "lucide-react";
import monasteries from "@/data/monasteries.json";

export default function ArrivalPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const monastery = monasteries.find((m) => m.id === id);

  if (!monastery) {
    return (
      <div className="min-h-screen bg-forest-700 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h2 className="text-xl font-heading font-bold mb-2">Not Found</h2>
          <Link href="/" className="text-saffron-300 underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const photoIcons: Record<string, { icon: any; label: string; color: string }> = {
    permitted: { icon: Camera, label: "Photography Permitted", color: "text-forest-300" },
    "courtyard-only": { icon: Camera, label: "Courtyard Only", color: "text-saffron-300" },
    "exterior-only": { icon: Camera, label: "Exterior Only", color: "text-saffron-300" },
    "exterior-and-courtyard": { icon: Camera, label: "Exterior & Courtyard", color: "text-saffron-300" },
    "ground-floor-only": { icon: Camera, label: "Ground Floor Only", color: "text-saffron-300" },
    "not-permitted": { icon: CameraOff, label: "No Photography", color: "text-red-300" },
  };

  const photoInfo = photoIcons[monastery.sacredAccessProtocol.photographyAllowed] || photoIcons.permitted;
  const PhotoIcon = photoInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-700 via-forest-800 to-forest-900 text-white">
      {/* Minimal header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <Link
          href={`/monastery/${monastery.id}`}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Exit Arrival Mode
        </Link>
        <span className="text-[10px] text-white/40 uppercase tracking-wider">
          Offline Ready
        </span>
      </div>

      <div className="px-6 pb-8 max-w-md mx-auto">
        {/* Monastery name */}
        <div className="text-center mb-8">
          <p className="text-xs text-saffron-300 uppercase tracking-wider mb-1">
            You are arriving at
          </p>
          <h1 className="text-3xl font-heading font-bold">{monastery.name.en}</h1>
          <p className="text-sm text-white/50 mt-1">{monastery.name.hi}</p>
        </div>

        {/* Large photo rule */}
        <div className="text-center mb-8 py-6 bg-white/5 rounded-heritage border border-white/10">
          <PhotoIcon size={48} className={`mx-auto mb-3 ${photoInfo.color}`} />
          <p className={`text-xl font-heading font-bold ${photoInfo.color}`}>
            {photoInfo.label}
          </p>
        </div>

        {/* Quick rules grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/5 rounded-heritage p-4 text-center border border-white/10">
            <Footprints size={28} className="mx-auto mb-2 text-saffron-300" />
            <p className="text-xs font-medium">Remove Shoes</p>
            <p className="text-[10px] text-white/40 mt-1">Before prayer halls</p>
          </div>
          <div className="bg-white/5 rounded-heritage p-4 text-center border border-white/10">
            <VolumeX size={28} className="mx-auto mb-2 text-saffron-300" />
            <p className="text-xs font-medium">Maintain Silence</p>
            <p className="text-[10px] text-white/40 mt-1">In prayer areas</p>
          </div>
          <div className="bg-white/5 rounded-heritage p-4 text-center border border-white/10">
            <Shirt size={28} className="mx-auto mb-2 text-saffron-300" />
            <p className="text-xs font-medium">Modest Dress</p>
            <p className="text-[10px] text-white/40 mt-1">Cover shoulders & knees</p>
          </div>
          <div className="bg-white/5 rounded-heritage p-4 text-center border border-white/10">
            <RotateCw size={28} className="mx-auto mb-2 text-saffron-300" />
            <p className="text-xs font-medium">Walk Clockwise</p>
            <p className="text-[10px] text-white/40 mt-1">Around monastery & stupas</p>
          </div>
        </div>

        {/* Special notice */}
        {monastery.sacredAccessProtocol.specialNotice && (
          <div className="bg-saffron-500/20 border border-saffron-400/30 rounded-heritage p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-saffron-300 mt-0.5 shrink-0" />
              <p className="text-sm text-saffron-200">
                {monastery.sacredAccessProtocol.specialNotice}
              </p>
            </div>
          </div>
        )}

        {/* Visiting hours */}
        <div className="bg-white/5 rounded-heritage p-4 mb-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/40 uppercase">Hours Today</p>
              <p className="text-lg font-semibold">
                {monastery.visitingHours.open} – {monastery.visitingHours.close}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              monastery.sacredAccessProtocol.currentStatus === "open" ? "bg-green-400" : "bg-saffron-400"
            } animate-pulse-soft`} />
          </div>
        </div>

        {/* Monastery Contact & Emergency */}
        <div className="bg-white/5 rounded-heritage p-4 border border-white/10 space-y-3">
          {(monastery as any).contact && (
            <div className="border-b border-white/10 pb-3">
              <p className="text-[10px] text-saffron-300 font-semibold uppercase tracking-wider">Monastery Secretariat</p>
              <p className="text-xs text-white/90 font-medium mt-0.5">{(monastery as any).contact.address}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {(monastery as any).contact.phone && (
                  <a
                    href={`tel:${(monastery as any).contact.phone}`}
                    className="text-xs text-saffron-300 hover:underline flex items-center gap-1 font-semibold min-h-0"
                  >
                    <Phone size={12} />
                    {(monastery as any).contact.phone}
                  </a>
                )}
                {(monastery as any).contact.email && (
                  <a
                    href={`mailto:${(monastery as any).contact.email}`}
                    className="text-[11px] text-white/70 hover:underline truncate block min-h-0"
                  >
                    {(monastery as any).contact.email}
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Phone size={13} className="text-red-300" />
              <p className="text-xs font-semibold text-white/90">Local Emergency & Support</p>
            </div>
            <div className="space-y-1 text-xs text-white/70">
              {(monastery as any).contact?.emergency ? (
                <>
                  <p className="text-[11px]">🏥 {(monastery as any).contact.emergency.localHealthPost}</p>
                  <p className="text-[11px]">👮 {(monastery as any).contact.emergency.policeStation}</p>
                  <p className="text-[11px]">📞 {(monastery as any).contact.emergency.tourismHelpline}</p>
                </>
              ) : (
                <>
                  <p>Police: 100 / 112 · Ambulance: 102 / 108</p>
                  <p>Sikkim Tourism Helpline: 1800-345-8973</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Shield size={16} className="mx-auto mb-2 text-white/20" />
          <p className="text-[10px] text-white/30 italic">
            &ldquo;Every visit preserves more than it consumes.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
