"use client";

import React from "react";
import { ParthStructuredResponse } from "@/lib/parth/parthEngine";
import { Sparkles, Compass } from "lucide-react";

interface ParthGeneralMessageProps {
  response: ParthStructuredResponse;
}

export default function ParthGeneralMessage({ response }: ParthGeneralMessageProps) {
  const content = response.direct_answer || response.raw_markdown || "";

  // Helper to format inline markdown (bold, italic, code)
  const formatInline = (text: string): React.ReactNode => {
    if (!text) return null;

    // Pattern to catch bold, italic, code
    const tokens: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        tokens.push(
          <strong key={match.index} className="font-bold text-forest-950">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith("*") && matchText.endsWith("*")) {
        tokens.push(
          <em key={match.index} className="italic text-stone-700">
            {matchText.slice(1, -1)}
          </em>
        );
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        tokens.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded bg-parchment-200 text-stone-800 font-mono text-[11px]">
            {matchText.slice(1, -1)}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.substring(lastIndex));
    }

    return tokens.length > 0 ? tokens : text;
  };

  // True Markdown Parser for Structured Blocks (Tables, Headings, Lists, Quotes, Paragraphs)
  const renderFormattedBlocks = (markdown: string) => {
    const lines = markdown.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // 1. Detect Markdown Table (lines with '|')
      if (line.startsWith("|") && line.endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          // First row is headers
          const headerCells = tableLines[0]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

          // Check if second row is separator (e.g. |---|---|)
          const isSeparator = /^\|(\s*:?-+:?\s*\|)+$/.test(tableLines[1]);
          const bodyStartIdx = isSeparator ? 2 : 1;

          const bodyRows = tableLines.slice(bodyStartIdx).map((rowStr) =>
            rowStr
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          blocks.push(
            <div key={`tbl-${i}`} className="my-3 overflow-x-auto rounded-xl border border-parchment-300 shadow-xs bg-white">
              <table className="min-w-full text-xs text-left divide-y divide-parchment-200">
                <thead className="bg-forest-900 text-parchment-100 font-serif">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 font-bold tracking-wide">
                        {formatInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment-200 text-stone-800">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white hover:bg-parchment-50" : "bg-parchment-50/60 hover:bg-parchment-100/60"}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 leading-relaxed">
                          {formatInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 2. Headings (#, ##, ###, ####)
      if (line.startsWith("#")) {
        const level = (line.match(/^#+/) || ["#"])[0].length;
        const headingText = line.replace(/^#+\s*/, "");

        if (level === 1 || level === 2) {
          blocks.push(
            <h3 key={`h-${i}`} className="font-serif font-bold text-sm text-forest-950 mt-3 mb-1.5 border-b border-parchment-200 pb-1">
              {formatInline(headingText)}
            </h3>
          );
        } else {
          blocks.push(
            <h4 key={`h-${i}`} className="font-serif font-bold text-xs text-forest-900 mt-2.5 mb-1 flex items-center gap-1.5">
              {formatInline(headingText)}
            </h4>
          );
        }
        i++;
        continue;
      }

      // 3. Blockquotes (> ...)
      if (line.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
          i++;
        }
        blocks.push(
          <div key={`q-${i}`} className="my-2 p-2.5 rounded-xl bg-amber-50/80 border-l-4 border-amber-600 text-[11px] text-amber-950 leading-relaxed space-y-1">
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{formatInline(ql)}</p>
            ))}
          </div>
        );
        continue;
      }

      // 4. Bullet & Numbered Lists
      const isBullet = /^\s*([•\-*]|\d+\.)\s+/.test(line);
      if (isBullet) {
        const listItems: { num?: string; text: string }[] = [];
        while (i < lines.length && /^\s*([•\-*]|\d+\.)\s+/.test(lines[i].trim())) {
          const l = lines[i].trim();
          const matchNum = l.match(/^(\d+)\.\s+(.*)/);
          if (matchNum) {
            listItems.push({ num: matchNum[1], text: matchNum[2] });
          } else {
            listItems.push({ text: l.replace(/^\s*([•\-*])\s+/, "") });
          }
          i++;
        }

        blocks.push(
          <ul key={`ul-${i}`} className="space-y-1.5 my-2 pl-1">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="flex items-start gap-2 text-stone-800 leading-relaxed text-xs">
                {item.num ? (
                  <span className="font-bold text-forest-800 shrink-0 text-[11px] min-w-[16px]">{item.num}.</span>
                ) : (
                  <span className="text-forest-600 font-bold shrink-0 mt-0.5">•</span>
                )}
                <span>{formatInline(item.text)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // 5. Horizontal divider (---)
      if (line === "---" || line === "***") {
        blocks.push(<hr key={`hr-${i}`} className="my-2.5 border-parchment-200" />);
        i++;
        continue;
      }

      // 6. Regular Paragraph
      blocks.push(
        <p key={`p-${i}`} className="text-stone-800 leading-relaxed my-1.5 text-xs">
          {formatInline(line)}
        </p>
      );
      i++;
    }

    return blocks;
  };

  return (
    <div className="space-y-2 text-xs animate-fade-in text-stone-800">
      {/* Title / Topic Badge if target_location exists and isn't generic */}
      {response.target_location && response.target_location !== "General Area" && response.target_location !== "Bharat Cultural Atlas" && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-forest-800 pb-1 border-b border-parchment-200">
          <Compass size={13} className="text-forest-600 shrink-0" />
          <span>{response.target_location}</span>
        </div>
      )}

      {/* Main Content Rendered with True Markdown Tables & Lists */}
      <div className="leading-relaxed">
        {renderFormattedBlocks(content)}
      </div>

      {/* Highlights / Specific Travel Details if provided */}
      {response.official_advisories && response.official_advisories.length > 0 && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-parchment-100/70 border border-parchment-200 space-y-1.5">
          <span className="font-bold text-[10px] text-forest-900 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={11} className="text-amber-600" />
            <span>Key Details & Practical Tips</span>
          </span>
          <div className="space-y-1 text-[11px] text-stone-700">
            {response.official_advisories.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-forest-600 font-bold shrink-0">•</span>
                <span>{formatInline(item)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtle Source Footer */}
      <div className="pt-1.5 text-[10px] text-stone-400 border-t border-parchment-200 flex items-center justify-between">
        <span>BharatTrails Cultural & Travel Guide</span>
        <span className="text-forest-700 font-medium">Powered by PARTH AI</span>
      </div>
    </div>
  );
}
