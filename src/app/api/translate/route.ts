import { NextRequest, NextResponse } from "next/server";

// In-memory LRU cache to prevent redundant external API requests
const translationCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, targetLang = "hi", sourceLang = "en" } = body;

    if (text) {
      const cacheKey = `${sourceLang}_${targetLang}_${text.trim()}`;
      if (translationCache.has(cacheKey)) {
        return NextResponse.json({
          success: true,
          translation: translationCache.get(cacheKey),
          cached: true,
        });
      }

      // MyMemory free public API (100% free, no API key required)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`;

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SyntaxusAtlas/1.0)" },
      });

      if (res.ok) {
        const data = await res.json();
        const translatedText =
          data.responseData?.translatedText || text;

        translationCache.set(cacheKey, translatedText);

        return NextResponse.json({
          success: true,
          translation: translatedText,
          cached: false,
        });
      }

      return NextResponse.json({ success: true, translation: text });
    }

    if (Array.isArray(texts)) {
      const results: string[] = [];
      for (const item of texts) {
        const cacheKey = `${sourceLang}_${targetLang}_${item.trim()}`;
        if (translationCache.has(cacheKey)) {
          results.push(translationCache.get(cacheKey)!);
          continue;
        }

        try {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            item
          )}&langpair=${sourceLang}|${targetLang}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            const translated = data.responseData?.translatedText || item;
            translationCache.set(cacheKey, translated);
            results.push(translated);
          } else {
            results.push(item);
          }
        } catch {
          results.push(item);
        }
      }

      return NextResponse.json({ success: true, translations: results });
    }

    return NextResponse.json(
      { error: "Missing text or texts array" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: error.message || "Translation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const tl = searchParams.get("tl") || "hi";
  const sl = searchParams.get("sl") || "en";

  if (!q) {
    return NextResponse.json({ error: "Missing query text" }, { status: 400 });
  }

  const cacheKey = `${sl}_${tl}_${q.trim()}`;
  if (translationCache.has(cacheKey)) {
    return NextResponse.json({
      success: true,
      translation: translationCache.get(cacheKey),
      cached: true,
    });
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      q
    )}&langpair=${sl}|${tl}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const translated = data.responseData?.translatedText || q;
      translationCache.set(cacheKey, translated);
      return NextResponse.json({ success: true, translation: translated });
    }
    return NextResponse.json({ success: true, translation: q });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
