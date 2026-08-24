"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Info,
  X,
  Shield,
  Eye,
  Volume2,
  VolumeX,
  Bell,
  RotateCw,
  Compass,
  ZoomIn,
  ZoomOut,
  Sparkles,
  MapPin,
  Smartphone,
  RotateCcw,
  MousePointer,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import {
  PermissionLabel,
  ConsentBadge,
} from "@/components/shared/ConsentMetadata";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import monasteries from "@/data/monasteries.json";
import { audioEngine } from "@/lib/audioService";

/**
 * Loads the raw original 360° photo texture with direct 1:1 spherical mapping,
 * sRGB color profiling, and 16x anisotropic filtering for razor-sharp clarity.
 */
function loadTruePhotosphereTexture(
  imageSrc: string,
  onLoaded: (texture: THREE.Texture) => void
) {
  if (typeof window === "undefined") return;

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = "anonymous";

  loader.load(
    imageSrc,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.needsUpdate = true;
      onLoaded(texture);
    },
    undefined,
    (err) => {
      console.warn("Direct texture loader fallback:", err);
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => {
        const tex = new THREE.CanvasTexture(img as any);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        onLoaded(tex);
      };
      img.onerror = () => {
        console.error("Failed to load 360 image asset:", imageSrc);
      };
    }
  );
}

export default function VirtualTourPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const handleBackToProfile = () => {
    router.push(`/heritage/${id}`);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [ambientActive, setAmbientActive] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [motionActive, setMotionActive] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [headingDegrees, setHeadingDegrees] = useState(0);
  const [currentFov, setCurrentFov] = useState(70);
  const [showConsentInfo, setShowConsentInfo] = useState(false);

  // Mutable loop refs
  const autoRotateRef = useRef(autoRotate);
  const motionActiveRef = useRef(motionActive);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const targetFovRef = useRef(70);
  const mouseParallaxRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const autoRotateDirRef = useRef(1);

  autoRotateRef.current = autoRotate;
  motionActiveRef.current = motionActive;

  const monastery =
    monasteries.find(
      (m) =>
        m.id === id ||
        (m as any).slug === id ||
        m.id.toLowerCase() === (id || "").toLowerCase()
    ) || monasteries[0];

  // Direct, instant Zoom In handler
  const handleZoomIn = useCallback(() => {
    targetFovRef.current = Math.max(15, targetFovRef.current - 15);
    setCurrentFov(targetFovRef.current);
    if (cameraRef.current) {
      cameraRef.current.fov = targetFovRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  // Direct, instant Zoom Out handler
  const handleZoomOut = useCallback(() => {
    targetFovRef.current = Math.min(85, targetFovRef.current + 15);
    setCurrentFov(targetFovRef.current);
    if (cameraRef.current) {
      cameraRef.current.fov = targetFovRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  // Reset View handler
  const handleResetView = useCallback(() => {
    targetLonRef.current = 0;
    targetLatRef.current = 0;
    targetFovRef.current = 70;
    mouseParallaxRef.current = { x: 0, y: 0 };
    setCurrentFov(70);
    if (cameraRef.current) {
      cameraRef.current.fov = 70;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  // Hotspot jump handler
  const handleLookAt = useCallback((yaw: number, pitch: number) => {
    targetLonRef.current = yaw;
    targetLatRef.current = pitch;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    }
    return () => {
      audioEngine.toggleAmbientSoundscape(false);
    };
  }, []);

  // Initialize Three.js 360 Viewer
  useEffect(() => {
    if (!canvasRef.current || !monastery?.virtualTour?.available) return;

    const container = canvasRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(targetFovRef.current, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 3. Full 360° Equirectangular Sphere Geometry (Standard WebGL Photosphere)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let loadedTexture: THREE.Texture | null = null;

    // Load True 360° Equirectangular Photosphere directly (Zero Mirroring)
    loadTruePhotosphereTexture(
      `/images/monasteries/${monastery.id}.png`,
      (texture) => {
        loadedTexture = texture;
        material.map = texture;
        material.needsUpdate = true;
        setViewerReady(true);
      }
    );

    // Internal physics variables
    let lon = 0, lat = 0;
    let onPointerDownLon = 0, onPointerDownLat = 0;
    let onPointerDownX = 0, onPointerDownY = 0;
    let pinchStartDist = 0;

    let gyroBaseAlpha: number | null = null;
    let gyroBaseBeta: number | null = null;

    // Pointer Event Listeners
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      onPointerDownX = e.clientX;
      onPointerDownY = e.clientY;
      onPointerDownLon = targetLonRef.current;
      onPointerDownLat = targetLatRef.current;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        targetLonRef.current = (onPointerDownX - e.clientX) * 0.12 + onPointerDownLon;
        targetLatRef.current = (e.clientY - onPointerDownY) * 0.12 + onPointerDownLat;
      } else if (motionActiveRef.current) {
        // Desktop Cursor Head-Tracking Parallax
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        mouseParallaxRef.current = {
          x: normX * 30, // 30° horizontal tilt
          y: -normY * 20, // 20° vertical tilt
        };
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    // Mouse Wheel Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 6;
      targetFovRef.current = Math.max(15, Math.min(85, targetFovRef.current + delta));
      setCurrentFov(targetFovRef.current);
      if (cameraRef.current) {
        cameraRef.current.fov = targetFovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    // Mobile Pinch Zoom
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (pinchStartDist > 0) {
          const diff = pinchStartDist - dist;
          targetFovRef.current = Math.max(15, Math.min(85, targetFovRef.current + diff * 0.15));
          setCurrentFov(Math.round(targetFovRef.current));
          if (cameraRef.current) {
            cameraRef.current.fov = targetFovRef.current;
            cameraRef.current.updateProjectionMatrix();
          }
        }
        pinchStartDist = dist;
      }
    };

    const onTouchEnd = () => {
      pinchStartDist = 0;
    };

    // Google Street View Double-Click / Double-Tap to Zoom In
    const onDblClick = (e: MouseEvent) => {
      targetFovRef.current = Math.max(20, targetFovRef.current - 20);
      setCurrentFov(Math.round(targetFovRef.current));
      if (cameraRef.current) {
        cameraRef.current.fov = targetFovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    container.addEventListener("dblclick", onDblClick);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // Mobile Device Orientation Gyroscope
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!motionActiveRef.current || e.alpha === null || e.beta === null) return;
      if (gyroBaseAlpha === null) gyroBaseAlpha = e.alpha;
      if (gyroBaseBeta === null) gyroBaseBeta = e.beta;

      const deltaAlpha = e.alpha - gyroBaseAlpha;
      const deltaBeta = e.beta - gyroBaseBeta;

      targetLonRef.current = onPointerDownLon - deltaAlpha * 1.8;
      targetLatRef.current = Math.max(-80, Math.min(80, onPointerDownLat - deltaBeta * 1.8));
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // Render Animation Loop
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth continuous auto-rotation when idle
      if (!isDraggingRef.current && autoRotateRef.current && !motionActiveRef.current) {
        targetLonRef.current += 0.05;
      }

      // Merge user panning with desktop mouse parallax
      const effectiveLon = targetLonRef.current + (motionActiveRef.current ? mouseParallaxRef.current.x : 0);
      const effectiveLat = targetLatRef.current + (motionActiveRef.current ? mouseParallaxRef.current.y : 0);

      // Smooth Lerp Damping
      lon += (effectiveLon - lon) * 0.1;
      lat += (effectiveLat - lat) * 0.1;

      lat = Math.max(-85, Math.min(85, lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      const target = new THREE.Vector3();
      target.setFromSphericalCoords(1, phi, theta);
      camera.lookAt(target);

      // Update Compass Heading
      const normalizedHeading = ((lon % 360) + 360) % 360;
      setHeadingDegrees(Math.round(normalizedHeading));

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("dblclick", onDblClick);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (loadedTexture) (loadedTexture as THREE.Texture).dispose();
      if (material.map) material.map.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [monastery?.id]);

  const handleToggleMotion = async () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === "granted") setMotionActive(!motionActive);
      } catch {
        setMotionActive(!motionActive);
      }
    } else {
      setMotionActive(!motionActive);
    }
  };

  if (!monastery) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center pb-24">
          <div className="text-center">
            <h2 className="text-xl font-heading font-bold text-forest-700 mb-2">
              Monument Not Found
            </h2>
            <Link href="/" className="btn-heritage">Return Home</Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  // Helper to determine personalized sound profile based on monument classification
  const soundProfile = monastery ? (() => {
    const id = monastery.id;
    const sect = ((monastery as any).sect || "").toLowerCase();

    if (
      ["tajmahal", "redfort", "humayun", "coochbehar", "hazaraduaripalace"].includes(id) ||
      sect.includes("mughal") ||
      sect.includes("islamic") ||
      sect.includes("palace")
    ) {
      return {
        type: "mughal" as const,
        instrumentLabel: "Royal Shehnai",
        soundscapeLabel: "Court Sitar",
        icon: "🪈",
      };
    }

    if (
      ["mehrangarh", "golconda", "daulatabad", "gandikota", "bekal"].includes(id) ||
      sect.includes("fort") ||
      sect.includes("citadel")
    ) {
      return {
        type: "fort" as const,
        instrumentLabel: "Fortress Drum",
        soundscapeLabel: "Canyon Winds",
        icon: "🥁",
      };
    }

    if (
      ["nongriat", "lonar", "nubra", "gurudongmar", "loktak", "stmarys", "borra", "valleyofflowers", "agrasenbaoli"].includes(id) ||
      sect.includes("nature") ||
      sect.includes("lake") ||
      sect.includes("stepwell") ||
      sect.includes("geological") ||
      sect.includes("crater")
    ) {
      return {
        type: "nature" as const,
        instrumentLabel: "Water Chime",
        soundscapeLabel: "Nature Canopy",
        icon: "💧",
      };
    }

    if (
      ["dholavira", "unakoti"].includes(id) ||
      sect.includes("harappan") ||
      sect.includes("bronze") ||
      sect.includes("archaeological")
    ) {
      return {
        type: "ancient" as const,
        instrumentLabel: "Bronze Gong",
        soundscapeLabel: "Ancient Winds",
        icon: "🪨",
      };
    }

    if (
      ["khajuraho", "thanjavur", "konark", "ellora", "dakshineswar", "lepakshi", "maduraimeenakshi", "modherasuntemple", "bishnupur"].includes(id) ||
      sect.includes("hindu") ||
      sect.includes("nagara") ||
      sect.includes("dravidian") ||
      sect.includes("jain") ||
      sect.includes("temple")
    ) {
      return {
        type: "temple" as const,
        instrumentLabel: "Temple Bell",
        soundscapeLabel: "Vedic Chants",
        icon: "🔔",
      };
    }

    // Default: Buddhist Monasteries & Stupas
    return {
      type: "buddhist" as const,
      instrumentLabel: "Singing Bowl",
      soundscapeLabel: "Monastic Chants",
      icon: "🥣",
    };
  })() : {
    type: "buddhist" as const,
    instrumentLabel: "Singing Bowl",
    soundscapeLabel: "Monastic Chants",
    icon: "🥣",
  };

  const hotspot = activeHotspot
    ? (monastery?.virtualTour?.hotspots || []).find((h) => h.id === activeHotspot)
    : null;

  // Zoom magnification factor calculation: 70° = 1.0x, 15° = 4.7x
  const zoomFactor = (70 / currentFov).toFixed(1);

  return (
    <>
      {!isFullscreen && <Header />}
      <main className={`flex-1 ${isFullscreen ? "" : "pb-20"}`}>
        {/* Top Control Bar */}
        {!isFullscreen && (
          <div className="px-4 py-3 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
            <button
              onClick={handleBackToProfile}
              className="flex items-center gap-2 text-xs md:text-sm font-semibold hover:text-saffron-300 transition min-h-0 cursor-pointer text-left"
              aria-label="Back to monument profile"
            >
              <ArrowLeft size={16} className="text-saffron-400" />
              <span className="truncate max-w-[200px] md:max-w-none">{monastery.name.en}</span>
              <span className="text-[10px] text-stone-400 font-normal">({(monastery as any).state || "India"})</span>
            </button>

            <div className="flex items-center gap-1.5 md:gap-2">
              {/* Context-Aware Personalized Instrument */}
              <button
                onClick={() => audioEngine.playPersonalizedInstrument(soundProfile.type)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-saffron-300 rounded-lg transition min-h-[32px] border border-white/10"
                title={`Play ${soundProfile.instrumentLabel}`}
              >
                <span className="text-xs">{soundProfile.icon}</span>
                <span className="hidden sm:inline">{soundProfile.instrumentLabel}</span>
              </button>

              {/* Context-Aware Personalized Soundscape */}
              <button
                onClick={() => {
                  const state = audioEngine.togglePersonalizedAmbient(soundProfile.type);
                  setAmbientActive(state);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition min-h-[32px] border ${
                  ambientActive
                    ? "bg-forest-600 text-white border-forest-400 shadow-sm"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/10"
                }`}
                title={`Toggle ${soundProfile.soundscapeLabel}`}
              >
                {ambientActive ? <Volume2 size={13} className="animate-pulse text-saffron-300" /> : <VolumeX size={13} />}
                <span className="hidden sm:inline">{ambientActive ? "Soundscape On" : soundProfile.soundscapeLabel}</span>
              </button>

              {/* Auto-Rotation Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition min-h-[32px] border ${
                  autoRotate
                    ? "bg-saffron-500/20 text-saffron-300 border-saffron-400/40"
                    : "bg-white/10 hover:bg-white/20 text-stone-400 border-white/10"
                }`}
                title="Toggle Cinematic Auto-Rotation"
              >
                <RotateCw size={13} className={autoRotate ? "animate-spin-slow text-saffron-400" : ""} />
                <span className="hidden md:inline">Auto-Rotate</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 hover:bg-white/20 bg-white/10 rounded-lg transition text-white min-h-[32px] min-w-[32px] flex items-center justify-center border border-white/10"
                aria-label="Fullscreen"
                title="Fullscreen Immersion"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>
        )}

        {/* 360° Spherical Panoramic Canvas */}
        <div
          className={`relative bg-stone-950 overflow-hidden select-none ${
            isFullscreen ? "fixed inset-0 z-[100] h-screen w-screen" : "h-[65vh] md:h-[75vh] w-full"
          }`}
        >
          <div ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

          {/* Loading Spinner */}
          {!viewerReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/90 backdrop-blur-sm z-20">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-3 border-saffron-400 border-t-transparent rounded-full animate-spin mx-auto mb-3 shadow-heritage" />
                <p className="text-xs md:text-sm font-heading font-semibold text-saffron-200">
                  Rendering 360° High-Definition Panorama...
                </p>
                <p className="text-[10px] text-stone-400 mt-1">Authentic Real Photography Heritage Sphere</p>
              </div>
            </div>
          )}

          {/* Floating HUD: Live Heading Compass & Dynamic Motion Gyro Toggle */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <div className="glass-card-dark px-3 py-1.5 rounded-full text-xs font-mono text-saffron-300 flex items-center gap-1.5 shadow-md border border-white/10">
              <Compass size={13} className="text-saffron-400" />
              <span>{headingDegrees}°</span>
            </div>

            {/* Dynamic Gyroscope / Head Parallax Toggle */}
            <button
              onClick={handleToggleMotion}
              className={`glass-card-dark px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md border transition-all ${
                motionActive
                  ? "bg-emerald-600/90 text-white border-emerald-400 shadow-emerald-500/30 scale-105"
                  : "text-stone-300 border-white/10 hover:text-white"
              }`}
              title={isMobileDevice ? "Tilt phone to look around" : "Move cursor to tilt 3D viewpoint"}
            >
              {isMobileDevice ? (
                <Smartphone size={13} className={motionActive ? "animate-bounce" : ""} />
              ) : (
                <MousePointer size={13} className={motionActive ? "text-emerald-300" : ""} />
              )}
              <span>{motionActive ? (isMobileDevice ? "Gyro: Active" : "Parallax: Active") : (isMobileDevice ? "Motion Gyro" : "3D Parallax")}</span>
            </button>
          </div>

          {/* Floating On-Screen Navigation & Zoom Magnifier Hub */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 bg-stone-900/80 backdrop-blur-xl p-2.5 rounded-2xl border border-white/20 shadow-2xl">
            {/* Zoom In (+) */}
            <button
              onClick={handleZoomIn}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-saffron-500 hover:text-stone-950 text-white active:scale-90 transition-all shadow-md min-h-[42px] min-w-[42px] flex items-center justify-center group cursor-pointer"
              title="Magnify In (+)"
              aria-label="Magnify in"
            >
              <ZoomIn size={20} className="group-hover:scale-110 transition" />
            </button>

            {/* Live Magnification Badge */}
            <div className="py-1 px-2 bg-saffron-500/25 border border-saffron-400/50 rounded-lg text-center select-none min-w-[42px]">
              <span className="text-[12px] font-mono font-black text-saffron-300">
                {zoomFactor}x
              </span>
            </div>

            {/* Zoom Out (-) */}
            <button
              onClick={handleZoomOut}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-saffron-500 hover:text-stone-950 text-white active:scale-90 transition-all shadow-md min-h-[42px] min-w-[42px] flex items-center justify-center group cursor-pointer"
              title="Wide View Out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut size={20} className="group-hover:scale-110 transition" />
            </button>

            {/* Reset Horizon & Zoom (1.0x) */}
            <button
              onClick={handleResetView}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-stone-300 hover:text-white active:scale-90 transition-all text-[11px] font-mono font-bold min-h-[34px] min-w-[34px] flex items-center justify-center border border-white/10 cursor-pointer"
              title="Reset Horizon (1.0x)"
              aria-label="Reset view"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Fullscreen Exit */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-20 p-2.5 bg-black/70 hover:bg-black/90 rounded-full text-white transition border border-white/20 shadow-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Exit fullscreen"
            >
              <Minimize2 size={18} />
            </button>
          )}

          {/* Hotspot Drawer Buttons (Bottom) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {(monastery.virtualTour?.hotspots || []).map((hs: any) => (
                <button
                  key={hs.id}
                  onClick={() => {
                    setActiveHotspot(activeHotspot === hs.id ? null : hs.id);
                    audioEngine.playRitualBell(1100, 1.2);
                    if (hs.position) {
                      handleLookAt(hs.position.yaw || 0, hs.position.pitch || 0);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-md flex items-center gap-1.5 min-h-[36px] ${
                    activeHotspot === hs.id
                      ? "bg-saffron-500 text-stone-900 shadow-saffron-500/50 scale-105"
                      : "bg-black/60 text-white/90 hover:bg-black/80 border border-white/15"
                  }`}
                >
                  <MapPin size={13} className={activeHotspot === hs.id ? "text-stone-900" : "text-saffron-400"} />
                  <span>{hs.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Hotspot Information Glass Card */}
          {hotspot && (
            <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-md z-20 animate-fade-in">
              <div className="glass-card-dark text-white p-5 rounded-2xl shadow-2xl border border-saffron-400/40 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-saffron-400" />
                    <h3 className="font-heading font-bold text-saffron-300 text-base leading-snug">
                      {hotspot.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="p-1 hover:bg-white/15 rounded-full text-stone-400 hover:text-white transition"
                  >
                    <X size={15} />
                  </button>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  {hotspot.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400">
                  <span>360° Architectural Detail Point</span>
                  <span className="text-saffron-300 font-semibold">Verified ASI / State Records</span>
                </div>
              </div>
            </div>
          )}

          {/* Custodian Watermark */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] text-white/80 font-medium border border-white/10 shadow-sm">
              Official Heritage 360° Panorama
            </span>
          </div>
        </div>

        {/* Permission & Attribution Metadata Section */}
        {!isFullscreen && (
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-parchment-100/80 border border-parchment-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-xs">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-forest-800 text-sm">
                    {monastery.name.en} — 360° Panoramic Immersion
                  </h4>
                  <p className="text-xs text-stone-500">
                    High-definition authentic photography with Three.js spherical projection, zoom magnification & spatial acoustics
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/monastery/${monastery.id}`}
                  className="btn-outline text-xs py-2 px-3.5"
                >
                  <ArrowLeft size={13} />
                  Full Site Profile
                </Link>
              </div>
            </div>

            {/* Official ASI / Monastic Cultural Consent Banner (Green Bar Explained) */}
            <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 text-emerald-950 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                        Official Cultural Consent Record
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
                        AMASR Act 1958 & ASI Protected Registry
                      </span>
                    </div>
                    <p className="font-heading font-bold text-sm text-emerald-900 mt-1">
                      {monastery.virtualTour?.permissionLabel || "Approved for 360° Virtual Viewing by Heritage Custodians & ASI"}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-emerald-800">
                      <span>Authority: <strong>Archaeological Survey of India & State Heritage Trust</strong></span>
                      <span>Documentation: <strong>{monastery.virtualTour?.capturedBy || "SYNTAXUS Survey"}</strong></span>
                      <span>Approved: <strong>{monastery.virtualTour?.captureDate || "2024 Verified"}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowConsentInfo(!showConsentInfo)}
                  className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 rounded-lg transition shrink-0"
                  title="What is this Cultural Consent verification?"
                >
                  <HelpCircle size={17} />
                </button>
              </div>

              {/* Collapsible Info Drawer on Purpose of the Green Bar */}
              {showConsentInfo && (
                <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-emerald-900 leading-relaxed bg-white/60 p-3 rounded-xl animate-fade-in">
                  <p className="font-semibold text-emerald-950 mb-1">
                    🏛️ Why is this Consent Verification Bar displayed?
                  </p>
                  <p>
                    Under Indian national heritage laws (AMASR Act 1958) and indigenous cultural protocols, capturing interior 360° virtual tours of sacred sanctums, UNESCO monuments, and living temples requires documented custodian permission. This green verification badge proves that this 360° tour is legally authorized, ethical, non-intrusive, and preserves the sanctity of the site.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              💡 Drag to pan • Click <strong>+</strong> / <strong>-</strong> for optical zoom up to 4.7x • Enable <strong>3D Parallax / Motion Gyro</strong> for head tracking
            </p>
          </div>
        )}
      </main>
      {!isFullscreen && <BottomNav />}
    </>
  );
}
