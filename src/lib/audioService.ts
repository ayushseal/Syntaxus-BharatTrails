// Native Web Audio API + SpeechSynthesis engine for Personalized Sonic Heritage across India

export type SoundscapeType = "buddhist" | "temple" | "mughal" | "fort" | "nature" | "ancient";

export interface SoundProfile {
  type: SoundscapeType;
  instrumentName: string;
  instrumentIcon: string;
  soundscapeName: string;
  soundscapeIcon: string;
  description: string;
}

class HeritageAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private activeSoundscapeType: SoundscapeType | null = null;
  private activeOscillators: (OscillatorNode | AudioNode)[] = [];

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // 1. Tibetan Singing Bowl (Buddhist Monasteries & Stupas)
  playSingingBowl(freq = 216, duration = 4.5): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const harmonics = [
        { f: freq, gain: 0.35 },
        { f: freq * 2.76, gain: 0.18 },
        { f: freq * 5.4, gain: 0.08 },
        { f: freq * 8.9, gain: 0.04 },
      ];

      harmonics.forEach(({ f, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(2.5, now);
        lfoGain.gain.setValueAtTime(1.2, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn("Audio bowl synthesis error:", e);
    }
  }

  // 2. Brass Temple Ghanta / Bell (Hindu & Jain Temples)
  playTempleGhanta(freq = 1080, duration = 3.5): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const overtones = [
        { f: freq, gain: 0.4 },
        { f: freq * 1.5, gain: 0.2 },
        { f: freq * 2.2, gain: 0.1 },
        { f: freq * 3.1, gain: 0.05 },
      ];

      overtones.forEach(({ f, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now);

        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn("Temple Ghanta synthesis error:", e);
    }
  }

  // 3. Royal Shehnai / Sufi Flute Flourish (Mughal Palaces & Tombs)
  playShehnaiFlourish(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      // Pentatonic Raga notes (D5 -> F#5 -> A5 -> B5 -> D6)
      const notes = [587.33, 739.99, 880.0, 987.77, 1174.66];

      notes.forEach((freq, i) => {
        const start = now + i * 0.18;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, start);

        // Shehnai reedy filter
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq * 1.2, start);
        filter.Q.setValueAtTime(4.0, start);

        gainNode.gain.setValueAtTime(0.001, start);
        gainNode.gain.linearRampToValueAtTime(0.12, start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch (e) {
      console.warn("Shehnai synthesis error:", e);
    }
  }

  // 4. Fortress Nagada War Drum (Forts, Citadels & Canyons)
  playNagadaDrum(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Deep bass drop from 140Hz to 40Hz
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.8);

      gainNode.gain.setValueAtTime(0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn("Nagada drum synthesis error:", e);
    }
  }

  // 5. Subterranean Water Droplet Chime (Caves, Stepwells & Waterfalls)
  playWaterDroplet(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Ascending sweep simulating water drop impact
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      console.warn("Water droplet synthesis error:", e);
    }
  }

  // 6. Ancient Bronze Age Gong (Harappan & Archaeological Sites)
  playBronzeGong(freq = 180, duration = 3.5): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);

      gainNode.gain.setValueAtTime(0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Bronze gong synthesis error:", e);
    }
  }

  // Trigger personalized instrument sound based on monument type
  playPersonalizedInstrument(type: SoundscapeType): void {
    switch (type) {
      case "mughal":
        this.playShehnaiFlourish();
        break;
      case "fort":
        this.playNagadaDrum();
        break;
      case "temple":
        this.playTempleGhanta(1080, 3.5);
        break;
      case "buddhist":
        this.playSingingBowl(216, 4.5);
        break;
      case "nature":
        this.playWaterDroplet();
        break;
      case "ancient":
        this.playBronzeGong(180, 3.5);
        break;
      default:
        this.playSingingBowl(216, 4.0);
    }
  }

  // Toggle personalized ambient soundscape
  togglePersonalizedAmbient(type: SoundscapeType, enable?: boolean): boolean {
    const shouldPlay = enable !== undefined ? enable : !(this.isAmbientPlaying && this.activeSoundscapeType === type);

    // Stop current soundscape
    this.stopAmbient();

    if (!shouldPlay) {
      return false;
    }

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 2);
      this.ambientGain.connect(ctx.destination);

      if (type === "mughal") {
        // Mughal Garden Fountain & Tanpura D-A fifth chord
        [146.83, 220.0, 293.66].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.15, now);
          lfoGain.gain.setValueAtTime(0.6, now);
          lfo.connect(osc.frequency);
          lfo.start(now);

          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc, lfo);
        });
      } else if (type === "fort") {
        // Canyon Winds across battlements (Low-frequency wind drone)
        [65.41, 98.0, 130.81].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.08, now); // slow howling wind sweep
          lfoGain.gain.setValueAtTime(4.0, now);
          lfo.connect(osc.frequency);
          lfo.start(now);

          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc, lfo);
        });
      } else if (type === "temple") {
        // Sanctum Vedic Resonance (108Hz, 216Hz, 324Hz)
        [108, 216, 324].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.25, now);
          lfoGain.gain.setValueAtTime(0.8, now);
          lfo.connect(osc.frequency);
          lfo.start(now);

          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc, lfo);
        });
      } else if (type === "nature") {
        // Rainforest Canopy & River Stream harmonic shimmer
        [180, 240, 360, 480].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.35, now);
          lfoGain.gain.setValueAtTime(1.5, now);
          lfo.connect(osc.frequency);
          lfo.start(now);

          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc, lfo);
        });
      } else if (type === "ancient") {
        // Desert Sands & Ancient Whispers (Deep wind)
        [82.41, 123.47, 164.81].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc);
        });
      } else {
        // Monastic Chanting Chords (108Hz, 162Hz, 216Hz)
        [108, 162, 216].forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.2, now);
          lfoGain.gain.setValueAtTime(0.8, now);
          lfo.connect(osc.frequency);
          lfo.start(now);

          osc.connect(this.ambientGain!);
          osc.start(now);
          this.activeOscillators.push(osc, lfo);
        });
      }

      this.isAmbientPlaying = true;
      this.activeSoundscapeType = type;
      return true;
    } catch (e) {
      console.warn("Ambient audio error:", e);
      this.isAmbientPlaying = false;
      this.activeSoundscapeType = null;
      return false;
    }
  }

  stopAmbient(): void {
    this.activeOscillators.forEach((osc) => {
      try {
        (osc as any).stop?.();
        osc.disconnect();
      } catch {}
    });
    this.activeOscillators = [];
    this.isAmbientPlaying = false;
    this.activeSoundscapeType = null;
  }

  // Deprecated backwards-compatible wrapper
  toggleAmbientSoundscape(enable?: boolean): boolean {
    return this.togglePersonalizedAmbient("buddhist", enable);
  }

  playRitualBell(freq = 880, duration = 3.0): void {
    this.playTempleGhanta(freq, duration);
  }

  // Spoken oral history narration
  speakNarrative(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onProgress?: (percent: number) => void
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }

    this.stopAudio();
    this.playSingingBowl(216, 3.5);

    setTimeout(() => {
      const cleanText = text.replace(/[*_#`]/g, " ").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.includes("en-IN") || v.name.includes("India")) ||
        voices.find((v) => v.lang.includes("en-GB") || v.name.includes("Natural")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;

      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        onStart?.();
      };

      utterance.onboundary = (event) => {
        if (event.name === "word" && cleanText.length > 0) {
          const progress = Math.min(100, Math.round((event.charIndex / cleanText.length) * 100));
          onProgress?.(progress);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.playSingingBowl(288, 3.0);
        onEnd?.();
      };

      utterance.onerror = (err) => {
        this.isSpeaking = false;
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    }, 400);
  }

  stopAudio(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}

export const audioEngine = new HeritageAudioEngine();
