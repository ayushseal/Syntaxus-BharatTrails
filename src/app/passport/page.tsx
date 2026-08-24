"use client";

import {
  Heart,
  BookOpen,
  Volume2,
  Shield,
  CheckCircle,
  MapPin,
  Eye,
  Star,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { useI18n } from "@/lib/i18n";

const milestones = [
  {
    id: "m1",
    title: "Rumtek Etiquette Completed",
    description: "Understood all 6 etiquette rules for Rumtek Monastery",
    type: "etiquette",
    icon: Shield,
    monastery: "Rumtek Monastery",
    completed: true,
    date: "2024-08-15",
  },
  {
    id: "m2",
    title: "The Flight from Tibet — Listened",
    description: "Listened to the oral history of the 16th Karmapa's journey",
    type: "oral-history",
    icon: Volume2,
    monastery: "Rumtek Monastery",
    completed: true,
    date: "2024-08-15",
  },
  {
    id: "m3",
    title: "Pemayangtse Etiquette Completed",
    description: "Understood all etiquette rules for Pemayangtse Monastery",
    type: "etiquette",
    icon: Shield,
    monastery: "Pemayangtse Monastery",
    completed: false,
    date: null,
  },
  {
    id: "m4",
    title: "The Three Lamas of Sikkim — Read",
    description: "Read the founding story of the first Chogyal",
    type: "oral-history",
    icon: BookOpen,
    monastery: "Pemayangtse Monastery",
    completed: true,
    date: "2024-08-16",
  },
  {
    id: "m5",
    title: "Virtual Tour — Rumtek Explored",
    description: "Completed the 360° virtual experience of Rumtek courtyard",
    type: "virtual-tour",
    icon: Eye,
    monastery: "Rumtek Monastery",
    completed: true,
    date: "2024-08-16",
  },
  {
    id: "m6",
    title: "Tashiding Etiquette Completed",
    description: "Understood all etiquette rules for Tashiding Monastery",
    type: "etiquette",
    icon: Shield,
    monastery: "Tashiding Monastery",
    completed: false,
    date: null,
  },
  {
    id: "m7",
    title: "Enchey Etiquette Completed",
    description: "Understood all etiquette rules for Enchey Monastery",
    type: "etiquette",
    icon: Shield,
    monastery: "Enchey Monastery",
    completed: false,
    date: null,
  },
  {
    id: "m8",
    title: "Sanga Choeling Etiquette Completed",
    description: "Understood all etiquette rules for Sanga Choeling",
    type: "etiquette",
    icon: Shield,
    monastery: "Sanga Choeling Monastery",
    completed: false,
    date: null,
  },
];

export default function PassportPage() {
  const { language, t } = useI18n();
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50">
      <Header />
      <main className="flex-1 pb-24">
        <div className="section-padding max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-heritage-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-heritage-lg">
              <Heart size={28} className="text-saffron-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest-700 mb-2">
              {t("passport.title")}
            </h1>
            <p className="text-sm text-stone-500">
              {t("passport.subtitle")}
            </p>
          </div>

          {/* Progress */}
          <div className="heritage-border bg-parchment-50 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-forest-700">
                {language === "hi" ? "सांस्कृतिक अध्ययन प्रगति" : "Learning Progress"}
              </span>
              <span className="text-sm font-bold text-saffron-500">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-parchment-200 rounded-full h-3">
              <div
                className="bg-heritage-gradient rounded-full h-3 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              {percentage}% {language === "hi" ? "सीखने के मील के पत्थर पूर्ण हुए" : "of available learning milestones completed"}
            </p>
          </div>

          {/* Distinction note */}
          <div className="bg-forest-50 border border-forest-200 rounded-heritage p-4 mb-6">
            <div className="flex items-start gap-3">
              <Star size={16} className="text-saffron-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-forest-700 mb-1">
                  {language === "hi" ? "यह अंक अर्जित करने का खेल नहीं है" : "This is not gamification"}
                </p>
                <p className="text-xs text-forest-600 leading-relaxed">
                  {language === "hi"
                    ? "मील के पत्थर संस्कृति सीखने, आचार संहिता समझने और मौखिक इतिहास सुनने से अर्जित होते हैं। उद्देश्य कोई खेल जीतना नहीं, बल्कि पवित्र स्थलों के प्रति आदर और सजगता है।"
                    : "Milestones are earned by learning — completing etiquette guides, reading oral histories, and understanding cultural context. The goal is respect, not achievement."}
                </p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.id}
                  className={`heritage-border p-4 flex items-start gap-4 transition-all ${
                    milestone.completed
                      ? "bg-parchment-50"
                      : "bg-parchment-100/50 opacity-70"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      milestone.completed
                        ? "bg-forest-100 text-forest-600"
                        : "bg-parchment-200 text-stone-400"
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold ${
                        milestone.completed ? "text-forest-700" : "text-stone-500"
                      }`}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {milestone.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-stone-400">
                      <span>{milestone.monastery}</span>
                      <span className="capitalize">{milestone.type.replace("-", " ")}</span>
                      {milestone.date && <span>{milestone.date}</span>}
                    </div>
                  </div>
                  {milestone.completed && (
                    <CheckCircle size={16} className="text-forest-500 shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
