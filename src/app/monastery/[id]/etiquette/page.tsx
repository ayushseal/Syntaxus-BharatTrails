"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Camera,
  CameraOff,
  Footprints,
  Shirt,
  VolumeX,
  RotateCw,
  Hand,
  Mountain,
  Calendar,
  Lock,
  Layers,
  Landmark,
  DoorClosed,
  Trees,
  Users,
  Shield,
} from "lucide-react";
import Header from "@/components/layout/Header";
import monasteries from "@/data/monasteries.json";
import { audioEngine } from "@/lib/audioService";

const iconMap: Record<string, any> = {
  "camera-off": CameraOff,
  camera: Camera,
  footprints: Footprints,
  shirt: Shirt,
  "volume-x": VolumeX,
  "rotate-cw": RotateCw,
  hand: Hand,
  layers: Layers,
  landmark: Landmark,
  mountain: Mountain,
  calendar: Calendar,
  lock: Lock,
  "door-closed": DoorClosed,
  trees: Trees,
  user: Users,
};

const severityColors: Record<string, string> = {
  dress: "from-forest-600 to-forest-700",
  photography: "from-saffron-500 to-saffron-600",
  silence: "from-blue-500 to-blue-600",
  movement: "from-forest-500 to-forest-600",
  respect: "from-maroon-700 to-maroon-800",
  access: "from-saffron-600 to-saffron-700",
};

const DEFAULT_ETIQUETTE_CARDS = [
  {
    title: "Sacred Footwear Protocol",
    description: "Remove footwear before entering the inner sanctum or prayer hall. Walk reverently on temple and heritage grounds.",
    category: "dress",
    icon: "footprints",
  },
  {
    title: "Photography Restrictions",
    description: "Photography of primary sanctums and sacred living rituals is restricted to protect cultural sanctity.",
    category: "photography",
    icon: "camera-off",
  },
  {
    title: "Quiet Reverence & Silence",
    description: "Please silence all digital devices and speak in soft tones to preserve meditative tranquility.",
    category: "silence",
    icon: "volume-x",
  },
  {
    title: "Modest Attire Standards",
    description: "Ensure shoulders and knees are covered as a sign of respect for local community traditions and customs.",
    category: "dress",
    icon: "shirt",
  },
  {
    title: "Clockwise Circumambulation",
    description: "Always circumambulate (walk around) sacred stupas, shrines, and sanctums in a clockwise direction.",
    category: "movement",
    icon: "rotate-cw",
  },
];

export default function EtiquettePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [currentCard, setCurrentCard] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const monastery = monasteries.find((m) => m.id === id);

  if (!monastery) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-50">
        <Header />
        <main className="flex-1 flex items-center justify-center pb-24">
          <div className="text-center">
            <h2 className="text-xl font-heading font-bold text-forest-700 mb-2">
              Not Found
            </h2>
            <Link href="/" className="btn-heritage">Return Home</Link>
          </div>
        </main>
      </div>
    );
  }

  const cards = (monastery.etiquette && monastery.etiquette.length > 0) ? monastery.etiquette : DEFAULT_ETIQUETTE_CARDS;
  const activeIndex = Math.min(currentCard, cards.length - 1);
  const card = cards[activeIndex] || cards[0];
  const allCompleted = cards.length > 0 && completed.size === cards.length;

  const handleComplete = (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
      if (newCompleted.size === cards.length) {
        audioEngine.playRitualBell(880, 3.5); // Grand celebration chime
      } else {
        audioEngine.playSingingBowl(288 + index * 30, 2.0); // Ascending harmonious tones
      }
    }
    setCompleted(newCompleted);
  };

  const goNext = () => {
    if (currentCard < cards.length - 1) setCurrentCard(currentCard + 1);
  };

  const goPrev = () => {
    if (currentCard > 0) setCurrentCard(currentCard - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        {/* Top bar */}
        <div className="px-4 py-3 bg-parchment-50 border-b border-parchment-200">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link
              href={`/heritage/${monastery.id}`}
              className="flex items-center gap-2 text-sm text-forest-700 font-medium min-h-0"
            >
              <ArrowLeft size={16} />
              {typeof monastery.name === "string" ? monastery.name : monastery.name?.en || monastery.id}
            </Link>
            <span className="text-xs text-stone-400">
              {completed.size} / {cards.length} understood
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 max-w-2xl mx-auto mt-4">
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  completed.has(i)
                    ? "bg-forest-500"
                    : i === activeIndex
                    ? "bg-saffron-400"
                    : "bg-parchment-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="px-4 max-w-2xl mx-auto mt-8">
          <div
            className={`rounded-heritage overflow-hidden shadow-heritage-lg bg-gradient-to-br ${
              severityColors[card.category] || "from-forest-600 to-forest-700"
            }`}
          >
            <div className="p-8 md:p-12 text-center text-white">
              {(() => {
                const Icon = iconMap[card.icon] || AlertCircle;
                return (
                  <Icon
                    size={56}
                    className="mx-auto mb-6 opacity-90"
                    strokeWidth={1.5}
                  />
                );
              })()}
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">
                {card.title}
              </h2>
              <p className="text-base text-white/85 leading-relaxed max-w-md mx-auto">
                {card.description}
              </p>
              <span className="inline-block mt-4 px-3 py-1 bg-white/10 rounded-full text-xs capitalize">
                {card.category}
              </span>
            </div>
          </div>

          {/* Understood checkbox */}
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => handleComplete(currentCard)}
              className={`flex items-center gap-2 px-5 py-3 rounded-heritage font-medium text-sm transition-all min-h-[48px] ${
                completed.has(currentCard)
                  ? "bg-forest-100 text-forest-700 border border-forest-300"
                  : "bg-parchment-100 text-stone-500 border border-parchment-300 hover:bg-parchment-200"
              }`}
            >
              <CheckCircle
                size={18}
                className={completed.has(currentCard) ? "text-forest-500" : "text-stone-300"}
              />
              {completed.has(currentCard) ? "Understood ✓" : "I understand this rule"}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={goPrev}
              disabled={currentCard === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-heritage text-sm font-medium 
                         text-stone-600 hover:bg-parchment-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-xs text-stone-400">
              {currentCard + 1} of {cards.length}
            </span>
            {currentCard < cards.length - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-heritage text-sm font-medium 
                           text-forest-700 hover:bg-forest-50 transition-all min-h-[44px]"
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <Link
                href={`/monastery/${monastery.id}`}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-heritage text-sm font-medium transition-all min-h-[44px] ${
                  allCompleted
                    ? "btn-heritage"
                    : "text-stone-400 cursor-not-allowed"
                }`}
              >
                <Shield size={14} />
                {allCompleted ? "Complete ✓" : "Complete all first"}
              </Link>
            )}
          </div>
        </div>

        {/* Completion message */}
        {allCompleted && (
          <div className="px-4 max-w-2xl mx-auto mt-8 animate-fade-in-up">
            <div className="bg-forest-50 border border-forest-200 rounded-heritage p-5 text-center">
              <CheckCircle size={32} className="text-forest-500 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-forest-700 mb-1">
                Respect Passport Milestone Earned!
              </h3>
              <p className="text-xs text-forest-600">
                You&apos;ve completed the etiquette guide for {monastery.name.en}. 
                This milestone has been added to your Respect Passport.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
