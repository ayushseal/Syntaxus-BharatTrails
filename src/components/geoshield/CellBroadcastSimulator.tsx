"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Volume2, VolumeX, Radio } from "lucide-react";

interface CellBroadcastSimulatorProps {
  headline?: string;
  instruction?: string;
  source?: string;
  severity?: string;
  onClose: () => void;
}

export default function CellBroadcastSimulator({
  headline = "EMERGENCY ALERT / राष्ट्रीय आपातकालीन चेतावनी",
  instruction = "Heavy rainfall and active landslide warning along NH-58 Chamoli-Joshimath corridor. Restrict vehicular movement past 19:00 hrs. Check in at nearest verified relief shelter or dial 112.",
  source = "National Disaster Management Authority (NDMA / C-DOT)",
  severity = "ORANGE ALERT",
  onClose,
}: CellBroadcastSimulatorProps) {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const pulseIntervalRef = useRef<any>(null);

  // Play standard EAS dual-tone siren (853 Hz & 960 Hz) on mount
  useEffect(() => {
    if (muted) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      gainRef.current = gain;

      // Authentic EAS / WEA tone frequencies
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(853, ctx.currentTime);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(960, ctx.currentTime);

      // Safe audible gain
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      // Pulsing EAS alarm: 500ms tone, 250ms silence
      let isHigh = true;
      pulseIntervalRef.current = setInterval(() => {
        if (!gain || !ctx || ctx.state === "closed") return;
        isHigh = !isHigh;
        gain.gain.setValueAtTime(isHigh ? 0.2 : 0.001, ctx.currentTime);
      }, 450);
    } catch (err) {
      console.warn("[CellBroadcastSimulator] Web Audio playback policy prevented autoplay:", err);
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      try {
        if (osc1Ref.current) osc1Ref.current.stop();
        if (osc2Ref.current) osc2Ref.current.stop();
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
          audioCtxRef.current.close();
        }
      } catch {}
    };
  }, [muted]);

  const handleClose = () => {
    if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    try {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-red-500 rounded-2xl shadow-2xl overflow-hidden text-white animate-scale-up">
        {/* Urgent Warning Header Banner */}
        <div className="bg-red-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={18} className="animate-pulse text-white" />
            <span className="text-xs font-black tracking-widest uppercase">
              WIRELESS EMERGENCY ALERT (WEA)
            </span>
          </div>
          <button
            onClick={() => setMuted(!muted)}
            className="p-1 rounded hover:bg-red-700 transition-colors text-white/90"
            title={muted ? "Unmute alarm sound" : "Mute alarm sound"}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Mandatory Simulation Banner */}
        <div className="bg-amber-400 text-stone-950 px-4 py-1.5 text-[11px] font-bold text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
          <AlertTriangle size={14} className="shrink-0" />
          <span>DEMO / SIMULATION ONLY — Not an actual carrier Cell Broadcast</span>
        </div>

        {/* Alert Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 shrink-0">
              <AlertTriangle size={28} />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500 text-white tracking-wider mb-1">
                {severity}
              </span>
              <h3 className="text-lg font-bold leading-snug">{headline}</h3>
            </div>
          </div>

          <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700 text-sm leading-relaxed text-stone-200">
            {instruction}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
            <span>Authoritative Source: <strong className="text-stone-300">{source}</strong></span>
            <span>Channel: 4370 (CAP 1.2)</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-stone-950 font-bold hover:bg-stone-200 transition-colors shadow-md text-sm"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
