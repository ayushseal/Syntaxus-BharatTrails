"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
    changeGoogleLanguage: (lang: string) => void;
  }
}

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Define the global init function
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,bn,ta,te,mr,gu,kn,ml,pa,or",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Helper to switch language seamlessly
    window.changeGoogleLanguage = function (langCode: string) {
      if (typeof window === "undefined") return;

      const hostname = window.location.hostname;
      const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

      if (langCode === "en") {
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        if (!isLocal) {
          document.cookie = `googtrans=; path=/; domain=.${hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (select) {
          select.value = "en";
          select.dispatchEvent(new Event("change"));
        } else {
          window.location.reload();
        }
        return;
      }

      const cookieVal = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieVal}; path=/;`;
      if (!isLocal) {
        document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname};`;
      }

      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change"));
      } else {
        window.location.reload();
      }
    };

    // Actively enforce permanent hiding of Google Translate banner frame & hover tooltips
    const enforceNoBanner = () => {
      const banners = document.querySelectorAll<HTMLElement>(
        ".goog-te-banner-frame, iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[class*='goog-te-banner'], .VIpgJd-ZVi9od-OR9Gof-OQwWgc"
      );
      banners.forEach((b) => {
        b.style.setProperty("display", "none", "important");
        b.style.setProperty("visibility", "hidden", "important");
        b.style.setProperty("height", "0px", "important");
        b.style.setProperty("width", "0px", "important");
        b.style.setProperty("top", "-99999px", "important");
        b.style.setProperty("position", "absolute", "important");
      });

      const tooltip = document.getElementById("goog-gt-tt");
      if (tooltip) tooltip.remove();

      if (document.body && document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.setProperty("top", "0px", "important");
        document.body.style.setProperty("position", "static", "important");
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }
    };

    const observer = new MutationObserver(() => {
      enforceNoBanner();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    const interval = setInterval(enforceNoBanner, 150);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
