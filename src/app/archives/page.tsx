"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Volume2,
  Calendar,
  Shield,
  MapPin,
  FileText,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Layers,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { ConsentBadge } from "@/components/shared/ConsentMetadata";
import ArchiveReaderModal, { ArchiveRecord } from "@/components/shared/ArchiveReaderModal";
import monasteries from "@/data/monasteries.json";
import additionalArchives from "@/data/archives.json";
import { useI18n } from "@/lib/i18n";

type ArchiveCategory = "all" | "oral-history" | "manuscript" | "artifact" | "thangka";

// Gather all oral histories from all monasteries
const oralHistoriesFromMonasteries: ArchiveRecord[] = monasteries.flatMap((m) =>
  (m.oralHistories || []).map((story) => ({
    id: story.id,
    title: story.title,
    type: "oral-history" as const,
    monastery: m.name.en,
    era: story.era,
    language: story.language,
    source: story.source as any,
    sensitivity: (story as any).sensitivityLevel || "public",
    approvedDate: (story as any).approvedDate || "2024-05-15",
    lastReviewDate: (story as any).lastReviewDate || "2024-05-15",
    narrator: story.narrator,
    translator: (story as any).translator || undefined,
    excerpt: story.excerpt,
    fullContent: (story as any).fullText || story.excerpt || "",
    fullText: (story as any).fullText || story.excerpt || "",
    archivalRef: `SKM-OH-${m.id.toUpperCase()}-${story.id.toUpperCase()}`,
    provenanceChain: [
      `Recorded on-site at ${m.name.en} with elder monks`,
      `Verified by Monastery Heritage Board on ${(story as any).approvedDate || "2024-05-15"}`,
      `Digitized and indexed for public preservation`,
    ],
  }))
);

// Unified archive catalog
const completeArchiveCatalog: ArchiveRecord[] = [
  ...additionalArchives.map((a) => ({
    ...a,
    type: a.type as any,
    source: a.source as any,
  })),
  ...oralHistoriesFromMonasteries,
];

const categoryLabels: Record<ArchiveCategory, { label: string; count: number }> = {
  all: { label: "All Records", count: completeArchiveCatalog.length },
  "oral-history": {
    label: "Oral Histories",
    count: completeArchiveCatalog.filter((a) => a.type === "oral-history").length,
  },
  manuscript: {
    label: "Manuscripts",
    count: completeArchiveCatalog.filter((a) => a.type === "manuscript").length,
  },
  thangka: {
    label: "Thangkas & Murals",
    count: completeArchiveCatalog.filter((a) => a.type === "thangka" || a.type === "mural").length,
  },
  artifact: {
    label: "Sacred Artifacts",
    count: completeArchiveCatalog.filter((a) => a.type === "artifact").length,
  },
};

export default function ArchivesPage() {
  const { language, t } = useI18n();
  const [category, setCategory] = useState<ArchiveCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categoryLabelsMap: Record<ArchiveCategory, { label: string; count: number }> = {
    all: { label: language === "hi" ? "सभी अभिलेख" : "All Records", count: completeArchiveCatalog.length },
    "oral-history": {
      label: language === "hi" ? "मौखिक इतिहास" : "Oral Histories",
      count: completeArchiveCatalog.filter((a) => a.type === "oral-history").length,
    },
    manuscript: {
      label: language === "hi" ? "पांडुलिपियां" : "Manuscripts",
      count: completeArchiveCatalog.filter((a) => a.type === "manuscript").length,
    },
    thangka: {
      label: language === "hi" ? "भित्तिचित्र व थंगका" : "Thangkas & Murals",
      count: completeArchiveCatalog.filter((a) => a.type === "thangka" || a.type === "mural").length,
    },
    artifact: {
      label: language === "hi" ? "प्राचीन पुरावशेष" : "Sacred Artifacts",
      count: completeArchiveCatalog.filter((a) => a.type === "artifact").length,
    },
  };

  const filteredRecords = completeArchiveCatalog.filter((item) => {
    const matchesCategory =
      category === "all"
        ? true
        : category === "thangka"
        ? item.type === "thangka" || item.type === "mural"
        : item.type === category;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      (item.titleNative && item.titleNative.toLowerCase().includes(q)) ||
      item.monastery.toLowerCase().includes(q) ||
      (item.fullContent && item.fullContent.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.narrator && item.narrator.toLowerCase().includes(q)) ||
      (item.era && item.era.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 md:pt-7">
          {/* Header */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-saffron-600 uppercase tracking-wider bg-saffron-50 px-2.5 py-0.5 rounded border border-saffron-200">
              {language === "hi" ? "संरक्षण एवं स्रोत प्रमाण" : "Preservation & Provenance"}
            </span>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest-700 mt-1.5 mb-1">
              {t("archives.title")}
            </h1>
            <p className="text-xs md:text-sm text-stone-500 max-w-2xl leading-relaxed">
              {t("archives.subtitle")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-3.5">
            <div className="flex-1 flex items-center gap-3 px-3.5 py-1.5 bg-parchment-100/90 rounded-heritage border border-parchment-300 shadow-xs focus-within:ring-2 focus-within:ring-forest-400">
              <Search size={16} className="text-forest-700 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("archives.searchPlaceholder")}
                className="flex-1 bg-transparent text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none min-h-[34px]"
                id="archive-search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-stone-400 hover:text-stone-600 font-medium px-2 min-h-0 min-w-0"
                >
                  {language === "hi" ? "हटाएं" : "Clear"}
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
            {(Object.keys(categoryLabelsMap) as ArchiveCategory[]).map((key) => {
              const info = categoryLabelsMap[key];
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px] flex items-center gap-1.5 ${
                    category === key
                      ? "bg-forest-700 text-white shadow-xs font-bold"
                      : "bg-parchment-100 text-stone-600 hover:bg-parchment-200 border border-parchment-200"
                  }`}
                >
                  <span>{info.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      category === key ? "bg-forest-900/60 text-white" : "bg-parchment-200 text-stone-600"
                    }`}
                  >
                    {info.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Archive Records List */}
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-16 heritage-border bg-parchment-50 p-8">
                <BookOpen size={40} className="text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-heading font-bold text-stone-600 mb-1">
                  No Archive Records Found
                </h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Try adjusting your search keywords or switching category filters above.
                </p>
              </div>
            ) : (
              filteredRecords.map((record) => {
                const isExpanded = expandedId === record.id;
                const isOral = record.type === "oral-history";
                const isManuscript = record.type === "manuscript";
                const isArtifact = record.type === "artifact";
                const isThangka = record.type === "thangka" || record.type === "mural";

                return (
                  <article
                    key={record.id + record.monastery}
                    className="heritage-border bg-parchment-50/90 hover:bg-parchment-50 transition-all p-5 sm:p-6 shadow-sm hover:shadow-md border border-parchment-200 rounded-heritage"
                  >
                    {/* Top Row: Type & Consent Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isManuscript
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : isOral
                              ? "bg-forest-100 text-forest-800 border border-forest-200"
                              : isThangka
                              ? "bg-saffron-100 text-saffron-800 border border-saffron-200"
                              : "bg-purple-100 text-purple-800 border border-purple-200"
                          }`}
                        >
                          {language === "hi"
                            ? isManuscript
                              ? "पांडुलिपि"
                              : isOral
                              ? "मौखिक इतिहास"
                              : isThangka
                              ? "भित्तिचित्र / थंगका"
                              : "पुरावशेष"
                            : record.type.replace("-", " ")}
                        </span>
                        {record.archivalRef && (
                          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
                            {record.archivalRef}
                          </span>
                        )}
                      </div>
                      <ConsentBadge type={record.source} size="sm" />
                    </div>

                    {/* Title and Origin */}
                    <h3 className="font-heading font-bold text-forest-800 text-lg sm:text-xl leading-snug">
                      {record.title}
                    </h3>
                    {record.titleNative && (
                      <p className="text-xs text-saffron-700 font-heading font-medium mt-0.5 mb-2">
                        {record.titleNative}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 my-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-forest-600" />
                        <strong>{record.monastery}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-forest-600" />
                        {record.era}
                      </span>
                      {record.language && (
                        <>
                          <span>•</span>
                          <span>{record.language}</span>
                        </>
                      )}
                    </div>

                    {/* Excerpt or Full Preview */}
                    <div className="my-3 text-sm text-stone-700 leading-relaxed">
                      {isExpanded ? (
                        <div className="space-y-4 animate-fade-in pt-2 border-t border-parchment-200">
                          {record.translations?.tibetanExcerpt && (
                            <div className="p-3 bg-saffron-50 rounded border border-saffron-200 text-xs">
                              <span className="font-bold text-saffron-800 uppercase tracking-wider text-[10px] block mb-1">
                                {language === "hi" ? "मूल अभिलेख अंश" : "Tibetan Inscription"}
                              </span>
                              <p className="font-heading text-base text-stone-800">
                                {record.translations.tibetanExcerpt}
                              </p>
                            </div>
                          )}
                          <p className="whitespace-pre-line text-stone-800 leading-relaxed font-sans">
                            {record.fullContent || record.fullText || record.summary}
                          </p>
                        </div>
                      ) : (
                        <p className="line-clamp-2 text-stone-600">
                          {record.excerpt || record.summary || record.fullContent}
                        </p>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-parchment-200/80 pt-3 mt-4">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                        {record.narrator && (
                          <span>
                            {language === "hi" ? "वाचक: " : "Narrator: "}
                            <strong>{record.narrator}</strong>
                          </span>
                        )}
                        {record.curator && (
                          <span>
                            {language === "hi" ? "क्यूरेटर: " : "Curator: "}
                            <strong>{record.curator}</strong>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Inline Read Toggle */}
                        <button
                          onClick={() => toggleExpand(record.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900 bg-parchment-100 hover:bg-parchment-200 px-3 py-1.5 rounded transition min-h-0"
                        >
                          {isExpanded ? (
                            <>
                              {language === "hi" ? "संक्षिप्त करें" : "Collapse"} <ChevronUp size={13} />
                            </>
                          ) : (
                            <>
                              {language === "hi" ? "त्वरित पढ़ें" : "Quick Read"} <ChevronDown size={13} />
                            </>
                          )}
                        </button>

                        {/* Full Reader Modal Button */}
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="btn-heritage text-xs py-1.5 px-3.5 shadow-sm"
                        >
                          <Maximize2 size={12} />
                          {language === "hi" ? "सम्पूर्ण विवरण एवं ऑडियो" : "Full Reader & Audio"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Cultural Promise Note */}
          <div className="mt-10 bg-forest-50 border border-forest-200 rounded-heritage p-5 text-center shadow-sm">
            <Shield size={24} className="text-forest-600 mx-auto mb-2" />
            <h4 className="font-heading font-bold text-forest-800 text-sm mb-1">
              {language === "hi" ? "अभिलेखीय प्रामाणिकता एवं सहमति संरक्षित" : "Archival Provenance & Consent Guaranteed"}
            </h4>
            <p className="text-xs text-forest-700 max-w-xl mx-auto leading-relaxed">
              {language === "hi"
                ? "यहाँ संरक्षित प्रत्येक पांडुलिपि एवं मौखिक इतिहास संबंधित संरक्षक परिषदों द्वारा सत्यापित है। किसी भी गोपनीय अनुष्ठानिक सामग्री का निजीकरण सुरक्षित रखा गया है।"
                : "Every manuscript and oral history preserved here has been authenticated by the respective monastery council and the Sikkim Ecclesiastical Department. Restricted ritual secrets remain unrecorded and private."}
            </p>
          </div>
        </div>
      </main>

      {/* Full Document Reader Modal */}
      <ArchiveReaderModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
