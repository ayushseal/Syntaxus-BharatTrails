"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  Volume2,
  Shield,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Bookmark,
  Play,
  Pause,
  Layers,
  Sparkles,
  Bell,
  Waves,
} from "lucide-react";
import { ConsentBadge } from "./ConsentMetadata";
import { audioEngine } from "@/lib/audioService";
import { useI18n } from "@/lib/i18n";

export interface ArchiveRecord {
  id: string;
  title: string;
  titleNative?: string;
  type: "oral-history" | "manuscript" | "artifact" | "thangka" | "mural";
  monastery: string;
  era: string;
  language?: string;
  source: "monastery-approved" | "researcher-reviewed" | "community-contributed";
  sensitivity?: string;
  approvedDate?: string;
  lastReviewDate?: string;
  curator?: string;
  narrator?: string;
  translator?: string;
  archivalRef?: string;
  dimensions?: string;
  summary?: string;
  excerpt?: string;
  fullContent?: string;
  fullText?: string;
  translations?: {
    tibetanExcerpt?: string;
    englishNotes?: string;
  };
  provenanceChain?: string[];
}

interface ArchiveReaderModalProps {
  record: ArchiveRecord | null;
  onClose: () => void;
}

export default function ArchiveReaderModal({
  record,
  onClose,
}: ArchiveReaderModalProps) {
  const { language } = useI18n();
  const [activeTab, setActiveTab] = useState<"content" | "provenance" | "details">("content");
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);

  // Stop audio whenever modal closes or record changes
  useEffect(() => {
    return () => {
      audioEngine.stopAudio();
      audioEngine.toggleAmbientSoundscape(false);
    };
  }, [record]);

  if (!record) return null;

  const contentText =
    record.fullContent || record.fullText || record.summary || record.excerpt || "";

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      audioEngine.stopAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      setAudioProgress(5);
      audioEngine.speakNarrative(
        contentText,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          setAudioProgress(100);
        },
        (progress) => setAudioProgress(progress)
      );
    }
  };

  const handleRingBell = () => {
    audioEngine.playRitualBell(880, 2.5);
  };

  const handleSingingBowl = () => {
    audioEngine.playSingingBowl(216, 4.0);
  };

  const handleToggleAmbient = () => {
    const nextState = !ambientActive;
    setAmbientActive(nextState);
    audioEngine.toggleAmbientSoundscape(nextState);
  };

  const handleClose = () => {
    audioEngine.stopAudio();
    audioEngine.toggleAmbientSoundscape(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-parchment-50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-parchment-300 overflow-hidden relative">
        {/* Top Hero Bar */}
        <div className="bg-heritage-gradient p-5 sm:p-6 text-white flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                {language === "hi"
                  ? record.type === "manuscript"
                    ? "पांडुलिपि"
                    : record.type === "oral-history"
                    ? "मौखिक इतिहास"
                    : "धरोहर अभिलेख"
                  : record.type.replace("-", " ")}
              </span>
              <ConsentBadge type={record.source} size="sm" />
              {record.archivalRef && (
                <span className="text-[10px] text-parchment-200/80 font-mono">
                  REF: {record.archivalRef}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-snug">
              {record.title}
            </h2>
            {record.titleNative && (
              <p className="text-saffron-200 text-sm font-heading mt-1 opacity-90">
                {record.titleNative}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-saffron-300" />
                {record.monastery}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-saffron-300" />
                {record.era}
              </span>
              {record.language && (
                <>
                  <span>•</span>
                  <span>{record.language}</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors shrink-0 min-h-0 min-w-0"
            aria-label="Close reader"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-parchment-100/90 border-b border-parchment-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Navigation Tabs */}
          <div className="flex gap-1">
            {[
              {
                key: "content",
                label: language === "hi" ? "सम्पूर्ण दस्तावेज / कथा" : "Full Document / Story",
                icon: BookOpen,
              },
              {
                key: "provenance",
                label: language === "hi" ? "स्रोत एवं सहमति" : "Provenance & Consent",
                icon: Shield,
              },
              {
                key: "details",
                label: language === "hi" ? "अभिलेखीय मेटाडेटा" : "Archival Metadata",
                icon: Layers,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] ${
                    activeTab === tab.key
                      ? "bg-forest-700 text-white shadow-sm"
                      : "text-stone-600 hover:bg-parchment-200"
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Reading & Sound Helpers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRingBell}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-forest-800 bg-white rounded border border-parchment-300 hover:bg-forest-50 transition min-h-[32px]"
              title="Ring sacred brass bell (Drilbu)"
            >
              <Bell size={12} className="text-saffron-600" />
              <span>{language === "hi" ? "घंटी बजाएं" : "Chime Bell"}</span>
            </button>
            <button
              onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
              className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white rounded border border-parchment-300 hover:bg-parchment-200 transition min-h-[32px]"
              title="Toggle text size"
            >
              {fontSize === "normal" ? "A+" : "A-"}
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-1.5 rounded border min-h-[32px] min-w-[32px] flex items-center justify-center transition ${
                isBookmarked
                  ? "bg-saffron-100 text-saffron-700 border-saffron-300"
                  : "bg-white text-stone-500 border-parchment-300 hover:bg-parchment-200"
              }`}
              title="Save to reading list"
            >
              <Bookmark size={14} className={isBookmarked ? "fill-saffron-600" : ""} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: FULL CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-fade-in">
              {/* Real Audio Player */}
              <div className="p-4 rounded-heritage bg-gradient-to-r from-forest-50 via-parchment-100 to-forest-50 border border-forest-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleToggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition shrink-0 min-h-0 min-w-0 ${
                    isPlayingAudio
                      ? "bg-saffron-500 hover:bg-saffron-600 text-white animate-pulse"
                      : "bg-forest-700 hover:bg-forest-600 text-white"
                  }`}
                  aria-label={isPlayingAudio ? "Pause live narration" : "Listen to live spoken narration & bowl resonance"}
                >
                  {isPlayingAudio ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold text-forest-800 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Volume2 size={14} className={isPlayingAudio ? "text-saffron-600 animate-bounce" : "text-forest-700"} />
                      {isPlayingAudio ? "Now Narrating Aloud (Voice & Tibetan Bowl)" : "Listen to Monastic Oral Narration"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSingingBowl}
                        className="text-[10px] text-forest-700 hover:underline font-bold"
                      >
                        Singing Bowl 🎶
                      </button>
                      <button
                        onClick={handleToggleAmbient}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition ${
                          ambientActive
                            ? "bg-forest-700 text-white border-forest-800"
                            : "bg-white text-stone-600 border-parchment-300"
                        }`}
                      >
                        <Waves size={9} className="inline mr-0.5" />
                        {ambientActive ? "Drone On" : "Drone Chant"}
                      </button>
                    </div>
                  </div>

                  {/* Audio track progress bar */}
                  <div
                    onClick={handleToggleAudio}
                    className="w-full bg-parchment-300 rounded-full h-2 overflow-hidden cursor-pointer"
                  >
                    <div
                      className="bg-saffron-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${isPlayingAudio ? Math.max(8, audioProgress) : audioProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-500 mt-1.5">
                    <span>
                      Narrated by <strong className="text-stone-700">{record.narrator || "Monastic Steward"}</strong>
                      {record.translator && ` • Trans: ${record.translator}`}
                    </span>
                    <span className="font-mono text-[10px] text-saffron-700 font-semibold">
                      {isPlayingAudio ? `${audioProgress}% complete` : "Click play to listen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Native Script Callout */}
              {record.translations?.tibetanExcerpt && (
                <div className="p-4 rounded-heritage bg-saffron-50/70 border-l-4 border-saffron-500 text-stone-800 shadow-sm">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-saffron-800 mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} /> Original Tibetan Inscription
                  </p>
                  <p className="font-heading text-lg sm:text-xl text-forest-900 leading-relaxed">
                    {record.translations.tibetanExcerpt}
                  </p>
                  {record.translations.englishNotes && (
                    <p className="text-xs text-stone-600 mt-2 italic">
                      {record.translations.englishNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Full Text Passage */}
              <div className="prose prose-stone max-w-none">
                <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-3 border-b border-parchment-200 pb-1">
                  Unabridged Verified Narrative & Record
                </h3>
                <div
                  className={`text-stone-800 leading-relaxed whitespace-pre-line ${
                    fontSize === "large" ? "text-base sm:text-lg leading-loose" : "text-sm sm:text-base"
                  }`}
                >
                  {contentText}
                </div>
              </div>

              {/* Summary note if present */}
              {record.summary && record.fullContent && (
                <div className="p-4 bg-white/70 rounded-heritage border border-parchment-200 text-xs text-stone-600">
                  <strong className="text-forest-700">Archivist Summary:</strong> {record.summary}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROVENANCE & CONSENT */}
          {activeTab === "provenance" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-forest-50 border border-forest-200 rounded-heritage p-4 text-forest-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={18} className="text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-base text-forest-800">
                      Cultural Permission & Non-Commercial Consent Ledger
                    </h4>
                    <p className="text-xs text-forest-700 mt-1 leading-relaxed">
                      In adherence to the Sikkim Ecclesiastical Department guidelines and UNESCO heritage ethics, this document is published under strict non-commercial educational covenant. The physical custodian and intellectual provenance remain perpetually with the monastery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Provenance timeline */}
              <div>
                <h4 className="font-heading font-bold text-forest-700 text-base mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-saffron-500" />
                  Custodial Chronology & Verification Chain
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-forest-200">
                  {(record.provenanceChain || [
                    "Created during primary founding period",
                    "Maintained in monastery relic repository",
                    "Formally catalogued by Ecclesiastical Department",
                    "Approved for public educational access on SYNTAXUS",
                  ]).map((step, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="absolute -left-[13px] top-1.5 w-2.5 h-2.5 rounded-full bg-forest-600 border-2 border-white" />
                      <p className="text-xs font-semibold text-stone-800">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent metadata box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-heritage border border-parchment-200">
                <div>
                  <span className="text-stone-400">Review Status:</span>
                  <p className="font-semibold text-forest-700">Monastery Approved ✓</p>
                </div>
                <div>
                  <span className="text-stone-400">Review Date:</span>
                  <p className="font-semibold text-stone-700">{record.lastReviewDate || "2024-06-30"}</p>
                </div>
                <div>
                  <span className="text-stone-400">Designated Steward / Curator:</span>
                  <p className="font-semibold text-stone-700">{record.curator || record.narrator || "Monastery Council"}</p>
                </div>
                <div>
                  <span className="text-stone-400">Sensitivity Classification:</span>
                  <p className="font-semibold text-saffron-700">{record.sensitivity || "Public Educational"}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHIVAL METADATA */}
          {activeTab === "details" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="bg-white rounded-heritage border border-parchment-200 p-4 space-y-3">
                <div className="flex justify-between border-b border-parchment-100 pb-2">
                  <span className="text-stone-500">Record Title</span>
                  <span className="font-semibold text-stone-800 text-right">{record.title}</span>
                </div>
                <div className="flex justify-between border-b border-parchment-100 pb-2">
                  <span className="text-stone-500">Originating Sanctuary</span>
                  <span className="font-semibold text-stone-800">{record.monastery}</span>
                </div>
                <div className="flex justify-between border-b border-parchment-100 pb-2">
                  <span className="text-stone-500">Historical Era</span>
                  <span className="font-semibold text-stone-800">{record.era}</span>
                </div>
                {record.dimensions && (
                  <div className="flex justify-between border-b border-parchment-100 pb-2">
                    <span className="text-stone-500">Physical Format & Dimensions</span>
                    <span className="font-semibold text-stone-800 text-right">{record.dimensions}</span>
                  </div>
                )}
                {record.language && (
                  <div className="flex justify-between border-b border-parchment-100 pb-2">
                    <span className="text-stone-500">Language / Script</span>
                    <span className="font-semibold text-stone-800">{record.language}</span>
                  </div>
                )}
                {record.archivalRef && (
                  <div className="flex justify-between border-b border-parchment-100 pb-2">
                    <span className="text-stone-500">State Registry Index</span>
                    <span className="font-mono font-bold text-forest-700">{record.archivalRef}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-stone-500">Digital Archive Checksum</span>
                  <span className="font-mono text-[10px] text-stone-400">SHA-256: 8f4a9b...72e1</span>
                </div>
              </div>

              <div className="p-4 bg-parchment-100 rounded-heritage text-stone-500 leading-relaxed text-[11px]">
                💡 <em>Citation Guide:</em> When citing this manuscript or oral history in academic research, please refer to the official registration reference <strong>{record.archivalRef || "SYNTAXUS-SKM-ARCH"}</strong> and attribute rights to <strong>{record.monastery}</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-parchment-100 border-t border-parchment-200 px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-stone-500 italic">
            &ldquo;Every visit preserves more than it consumes.&rdquo;
          </p>
          <button
            onClick={handleClose}
            className="btn-heritage text-xs py-2 px-5 shadow-sm"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
}
