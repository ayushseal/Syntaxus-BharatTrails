"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";

export type SupportedLanguage =
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "or"
  | string;

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
];

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, fallback?: string) => string;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  dynamicTranslate: (text: string) => string;
}

const dictionaries: Record<string, any> = { en, hi };
const clientMemoryCache = new Map<string, string>();

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (path: string, fallback?: string) => fallback || path,
  translateText: async (text: string) => text,
  dynamicTranslate: (text: string) => text,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [, setRerender] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("syntaxus_lang");
    if (saved) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("syntaxus_lang", lang);

      if (window.changeGoogleLanguage) {
        window.changeGoogleLanguage(lang);
      } else {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (select) {
          select.value = lang;
          select.dispatchEvent(new Event("change"));
        }
      }
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    const dict = dictionaries[language] || dictionaries.en;
    let current = dict;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let enCurrent = dictionaries.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === "object" && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === "string" ? enCurrent : fallback || path;
      }
    }
    return typeof current === "string" ? current : fallback || path;
  };

  // Asynchronous on-the-fly translator using free backend API
  const translateText = useCallback(
    async (text: string, targetLang?: string): Promise<string> => {
      const target = targetLang || language;
      if (!text || target === "en") return text;

      const cacheKey = `tr_${target}_${text.trim()}`;
      if (clientMemoryCache.has(cacheKey)) {
        return clientMemoryCache.get(cacheKey)!;
      }

      // Check localStorage cache
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          clientMemoryCache.set(cacheKey, stored);
          return stored;
        }
      }

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: target, sourceLang: "en" }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.translation) {
            clientMemoryCache.set(cacheKey, data.translation);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(cacheKey, data.translation);
              } catch {}
            }
            return data.translation;
          }
        }
      } catch (err) {
        console.warn("Dynamic translation request error:", err);
      }
      return text;
    },
    [language]
  );

  // Synchronous dynamic translate hook for render cycles
  const dynamicTranslate = useCallback(
    (text: string): string => {
      if (!text || language === "en") return text;
      const cacheKey = `tr_${language}_${text.trim()}`;

      if (clientMemoryCache.has(cacheKey)) {
        return clientMemoryCache.get(cacheKey)!;
      }

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(cacheKey);
        if (stored) {
          clientMemoryCache.set(cacheKey, stored);
          return stored;
        }

        // Trigger background fetch and re-render when done
        fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: language, sourceLang: "en" }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.translation) {
              clientMemoryCache.set(cacheKey, data.translation);
              try {
                localStorage.setItem(cacheKey, data.translation);
              } catch {}
              setRerender((r) => r + 1);
            }
          })
          .catch(() => {});
      }

      return text;
    },
    [language]
  );

  return (
    <I18nContext.Provider
      value={{ language, setLanguage, t, translateText, dynamicTranslate }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
