'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ANXCinematicScrollProps {
  /**
   * Total number of frames in the sequence. Default: 96
   */
  totalFrames?: number;
  /**
   * Base directory containing the image sequence.
   * By default: '/frames/'
   */
  imageDirectory?: string;
  /**
   * Frame file prefix. Defaults to 'anx_frame_'
   */
  framePrefix?: string;
  /**
   * Background hex color for canvas blending. Defaults to '#08090B'
   */
  bgColor?: string;
  /**
   * Callback when "GET YOUR WEBSITE" / primary CTA is clicked
   */
  onGetWebsite?: () => void;
  /**
   * Callback when "DISCUSS META ADS" / secondary CTA is clicked
   */
  onDiscussMetaAds?: () => void;
}

export default function ANXCinematicScroll({
  totalFrames = 96,
  imageDirectory = '/frames/',
  framePrefix = 'anx_frame_',
  bgColor = '#08090B',
  onGetWebsite,
  onDiscussMetaAds,
}: ANXCinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading & Asset State
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(0);
  const [activeSegment, setActiveSegment] = useState<string>('01 // INITIALIZATION');

  // Interactive controls
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [cinemaMode, setCinemaMode] = useState<boolean>(false);

  const prefersReducedMotion = useReducedMotion();

  // Framer Motion useScroll bound to the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Numeric scroll progress indicator (0 - 100%)
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  // Transform layers for 4 distinct scroll story beats:
  // 0% Scroll: HERO HEADLINE (Centered)
  const opacity0 = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.24], [1, 1, 0.2, 0]);
  const y0 = useTransform(scrollYProgress, [0, 0.08, 0.22], [0, 0, -35]);
  const scale0 = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // 30% Scroll: FEATURE / MESSAGE #1 (Left-aligned) -> Separating into 3D components
  const opacity30 = useTransform(scrollYProgress, [0.22, 0.28, 0.38, 0.46], [0, 1, 1, 0]);
  const y30 = useTransform(scrollYProgress, [0.22, 0.28, 0.38, 0.46], [40, 0, 0, -40]);
  const x30 = useTransform(scrollYProgress, [0.22, 0.28, 0.44], [-20, 0, 0]);

  // 60% Scroll: FEATURE / MESSAGE #2 (Right-aligned) -> Exploded digital composition
  const opacity60 = useTransform(scrollYProgress, [0.52, 0.58, 0.68, 0.76], [0, 1, 1, 0]);
  const y60 = useTransform(scrollYProgress, [0.52, 0.58, 0.68, 0.76], [40, 0, 0, -40]);
  const x60 = useTransform(scrollYProgress, [0.52, 0.58, 0.74], [20, 0, 0]);

  // 90% Scroll: CTA / FINAL MESSAGE (Centered) -> Reassembling into final architecture
  const opacity90 = useTransform(scrollYProgress, [0.82, 0.88, 1], [0, 1, 1]);
  const y90 = useTransform(scrollYProgress, [0.82, 0.88, 1], [35, 0, 0]);
  const scale90 = useTransform(scrollYProgress, [0.82, 0.92], [0.96, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const pct = Math.round(latest * 100);
      setScrollPercent(pct);

      if (pct < 22) {
        setActiveSegment('00 // DIGITAL ADVANTAGE');
      } else if (pct < 50) {
        setActiveSegment('01 // DECONSTRUCTING UI');
      } else if (pct < 80) {
        setActiveSegment('02 // ATTENTION & ADS ENGINE');
      } else {
        setActiveSegment('03 // SYNTHESIZED SYSTEM');
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Robust multi-format frame preloader
  useEffect(() => {
    let isCancelled = false;
    let successfulLoads = 0;
    let failedLoads = 0;

    const cleanDir = imageDirectory.endsWith('/') ? imageDirectory : `${imageDirectory}/`;

    const tryLoadImage = (index: number): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const paddedIndex = String(index).padStart(3, '0');
        const candidateUrls = [
          `${cleanDir}${framePrefix}${paddedIndex}.webp`,
          `${cleanDir}${framePrefix}${index}.webp`,
          `${cleanDir}${framePrefix}${paddedIndex}.jpg`,
          `${cleanDir}${framePrefix}${index}.jpg`,
          `${cleanDir}ezgif-frame-${paddedIndex}.jpg`,
        ];

        let candidateAttempt = 0;

        const attemptNext = () => {
          if (candidateAttempt >= candidateUrls.length) {
            resolve(null);
            return;
          }
          const img = new Image();
          const src = candidateUrls[candidateAttempt];
          candidateAttempt++;

          img.onload = () => resolve(img);
          img.onerror = () => attemptNext();
          img.src = src;
        };

        attemptNext();
      });
    };

    const loadAll = async () => {
      const promises: Promise<HTMLImageElement | null>[] = [];
      for (let i = 0; i < totalFrames; i++) {
        promises.push(
          tryLoadImage(i).then((img) => {
            if (!isCancelled) {
              if (img) successfulLoads++;
              else failedLoads++;
              setLoadedCount(successfulLoads + failedLoads);
            }
            return img;
          })
        );
      }

      const results = await Promise.all(promises);
      if (isCancelled) return;

      const validImages = results.filter((img): img is HTMLImageElement => img !== null);

      if (validImages.length >= Math.min(10, totalFrames / 2)) {
        setImages(results.map((img, i) => img || validImages[i % validImages.length]));
        setIsLoaded(true);
      } else {
        console.warn(
          `ANXCinematicScroll: ${validImages.length}/${totalFrames} frames loaded. Fallback activated.`
        );
        setLoadError(true);
        setIsLoaded(true);
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, imageDirectory, framePrefix]);

  // Fallback 3D workspace canvas generator
  const drawProceduralFallback = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const time = progress * Math.PI * 2;

      // Ambient matrix grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 44;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const layers = [
        { title: 'RESPONSIVE VIEWPORT [NEXT.JS 14]', color: 'rgba(56, 189, 248, 0.85)', maxSpread: 220 },
        { title: 'META ADVANTAGE+ ACQUISITION MATRIX', color: 'rgba(0, 129, 251, 0.85)', maxSpread: 340 },
        { title: 'HIGH-CONVERSION CORE ARCHITECTURE', color: 'rgba(226, 230, 236, 0.9)', maxSpread: 140 },
      ];

      const explosionIntensity = Math.sin(progress * Math.PI);

      layers.forEach((layer, idx) => {
        const angle = (idx * (2 * Math.PI)) / layers.length + time * 0.2;
        const spreadX = Math.cos(angle) * layer.maxSpread * explosionIntensity;
        const spreadY = Math.sin(angle) * (layer.maxSpread * 0.45) * explosionIntensity;

        const cardW = Math.min(width * 0.65, 520);
        const cardH = cardW * 0.56;
        const cardX = centerX - cardW / 2 + spreadX;
        const cardY = centerY - cardH / 2 + spreadY;

        ctx.save();
        ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
        ctx.rotate((explosionIntensity * (idx - 1) * 8 * Math.PI) / 180);
        ctx.translate(-(cardX + cardW / 2), -(cardY + cardH / 2));

        ctx.fillStyle = 'rgba(19, 22, 28, 0.72)';
        ctx.strokeStyle = idx === 1 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        const r = 12;
        ctx.roundRect(cardX, cardY, cardW, cardH, [r]);
        ctx.fill();
        ctx.stroke();

        // Title bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(cardX, cardY, cardW, 36);

        ['#FF5F56', '#FFBD2E', '#27C93F'].forEach((dotColor, dotIdx) => {
          ctx.beginPath();
          ctx.arc(cardX + 20 + dotIdx * 14, cardY + 18, 4, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        });

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '11px monospace';
        ctx.fillText(layer.title, cardX + 70, cardY + 22);

        // Skeleton bars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fillRect(cardX + 20, cardY + 54, cardW * 0.4, 18);
        ctx.fillRect(cardX + 20, cardY + 82, cardW * 0.9, 8);

        ctx.fillStyle = layer.color;
        ctx.fillRect(cardX + cardW - 120, cardY + 52, 100, 24);
        ctx.fillStyle = '#08090B';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(idx === 1 ? 'META ROAS 4.8x' : 'EDGE ACTIVE', cardX + cardW - 112, cardY + 68);

        ctx.restore();
      });
    },
    [bgColor]
  );

  // High-performance canvas drawing loop with contain fit and #08090B seamless blending
  const renderFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Fill base canvas with pure dark background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      if (loadError || images.length === 0) {
        drawProceduralFallback(ctx, displayWidth, displayHeight, progress);
        ctx.restore();
        return;
      }

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.min(
        images.length - 1,
        Math.floor(clampedProgress * (images.length - 1))
      );
      setCurrentFrameDisplay(frameIndex);

      const img = images[frameIndex];
      if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // "contain" scaling calculation to preserve aspect ratio across mobile & desktop
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const screenRatio = displayWidth / displayHeight;

        let drawW: number;
        let drawH: number;

        if (screenRatio > imgRatio) {
          drawH = displayHeight;
          drawW = displayHeight * imgRatio;
        } else {
          drawW = displayWidth;
          drawH = displayWidth / imgRatio;
        }

        const drawX = (displayWidth - drawW) / 2;
        const drawY = (displayHeight - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Seamless Edge Blending Vignette:
        // Softly feathered radial fade ensuring zero visible boundary between image and background
        const maxRadius = Math.max(drawW, drawH) * 0.62;
        const radialGrad = ctx.createRadialGradient(
          displayWidth / 2,
          displayHeight / 2,
          maxRadius * 0.42,
          displayWidth / 2,
          displayHeight / 2,
          maxRadius
        );
        radialGrad.addColorStop(0, 'rgba(8, 9, 11, 0)');
        radialGrad.addColorStop(0.72, 'rgba(8, 9, 11, 0.38)');
        radialGrad.addColorStop(1, bgColor);

        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        // Edge perimeter letterbox safety blends
        if (drawY > 0) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, displayWidth, drawY + 2);
          ctx.fillRect(0, drawY + drawH - 2, displayWidth, displayHeight - (drawY + drawH) + 2);
        }
        if (drawX > 0) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, drawX + 2, displayHeight);
          ctx.fillRect(drawX + drawW - 2, 0, displayWidth - (drawX + drawW) + 2, displayHeight);
        }
      }

      ctx.restore();
    },
    [images, loadError, drawProceduralFallback, bgColor]
  );

  // Scroll listener mapped via RAF
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number | null = null;

    const handleScrollUpdate = (latest: number) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        renderFrame(latest);
      });
    };

    renderFrame(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on('change', handleScrollUpdate);

    const handleResize = () => {
      renderFrame(scrollYProgress.get());
    };
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isLoaded, scrollYProgress, renderFrame]);

  useEffect(() => {
    if (prefersReducedMotion && isLoaded) {
      renderFrame(0.5);
    }
  }, [prefersReducedMotion, isLoaded, renderFrame]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-[#08090B] text-white overflow-visible select-none"
    >
      {/* 1. LOADING SCREEN OVERLAY */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090B] text-white transition-opacity duration-700">
          <div className="relative flex items-center justify-center w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/80 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent-cyan/80 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
            />
            <div className="absolute inset-4 rounded-full border-t border-white/20 animate-pulse" />
            <span className="font-mono text-sm tracking-widest font-black text-white/90">
              ANX
            </span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center px-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60 font-mono">
              INITIALIZING DIGITAL WORKSPACE
            </p>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-white/30 via-accent-cyan to-white transition-all duration-150 ease-out"
                style={{
                  width: `${Math.round((loadedCount / Math.max(1, totalFrames)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[11px] font-mono text-white/40 pt-1">
              {Math.min(loadedCount, totalFrames)} / {totalFrames} Frames Cached ({Math.round((loadedCount / Math.max(1, totalFrames)) * 100)}%)
            </p>
          </div>
        </div>
      )}

      {/* 2. THE STICKY CANVAS CONTAINER */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none canvas-blend-mask"
        />

        {/* Ambient atmospheric layers */}
        <div className="absolute inset-0 radial-glow-silver pointer-events-none" />
        <div className="absolute inset-0 radial-glow-cyan pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none opacity-40" />

        {/* Top-Right Interactive Controls Pill */}
        <div className="absolute top-20 right-6 hidden md:flex items-center gap-2 pointer-events-auto z-20">
          <button
            type="button"
            onClick={() => setCinemaMode(!cinemaMode)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border backdrop-blur-md transition-all ${
              cinemaMode
                ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {cinemaMode ? '● CINEMA HUD' : '○ STANDARD VIEW'}
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider border bg-white/[0.03] border-white/10 text-white/60 hover:text-white backdrop-blur-md transition-all"
          >
            {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
          </button>
        </div>

        {/* Live Cinematic HUD Pill (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-mono text-white/70 tracking-wider z-20">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/40">MODE:</span>
          <span>ANX_ENHANCED_V2</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">FRAME:</span>
          <span className="text-white font-bold">{String(currentFrameDisplay + 1).padStart(3, '0')}</span>
          <span className="text-white/20">|</span>
          <span className="text-accent-cyan font-bold">{scrollPercent}%</span>
        </div>

        {/* Live Stage Breadcrumb (Bottom-Left) */}
        <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-mono text-white/60 tracking-widest uppercase z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          <span>{activeSegment}</span>
        </div>

        {/* Scroll Progress Bar at the absolute top of sticky viewport */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-white/30 via-accent-cyan to-white/90 transition-all duration-75 ease-out"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>
      </div>

      {/* 3. SCROLL-SYNCED TEXT OVERLAYS */}
      <div className={`relative z-10 -mt-[100vh] w-full pointer-events-none transition-opacity duration-300 ${cinemaMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
        
        {/* =========================================================
            SECTION 1: 0% SCROLL - HERO HEADLINE (Centered)
            ========================================================= */}
        <div className="h-screen w-full flex items-center justify-center px-6">
          <motion.div
            style={{ opacity: opacity0, y: y0, scale: scale0 }}
            className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/70">
                FRAME-ENHANCED 3D SCROLLYTELLING
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/90 leading-[1.04] drop-shadow-2xl">
              BUILD YOUR <br />
              <span className="bg-gradient-to-b from-white via-silver-light to-silver-dark bg-clip-text text-transparent">
                DIGITAL ADVANTAGE.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl font-light tracking-wide leading-relaxed">
              ANX Venture Technology — Websites that work for your business.
            </p>

            {/* Scroll Cue */}
            <div className="mt-10 flex flex-col items-center gap-2 text-white/30 text-xs font-mono uppercase tracking-widest">
              <span>Scroll to deconstruct</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 h-2 rounded-full bg-white/70"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="h-[20vh]" />

        {/* =========================================================
            SECTION 2: 30% SCROLL - FEATURE #1 (Left Aligned)
            → Product begins expanding / separating
            ========================================================= */}
        <div className="h-screen w-full flex items-center justify-start px-6 md:px-16 lg:px-24">
          <motion.div
            style={{ opacity: opacity30, y: y30, x: x30 }}
            className="max-w-2xl text-left pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-accent-cyan">
                01 // SEPARATING 3D INTERFACES
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white/90 leading-[1.08]">
              YOUR VISION. <br />
              <span className="text-white/40">OUR DEVELOPMENT.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-xl">
              High-performance responsive interfaces separating into precision-crafted 3D
              components. Built on Next.js 14, engineered for sub-second TTFB, and structured
              for instantaneous responsive fluidity.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold font-mono text-white/90">0.38s</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">
                  Avg. Interaction Speed
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-white/90">99.8%</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">
                  Lighthouse Core Vitals
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="h-[20vh]" />

        {/* =========================================================
            SECTION 3: 60% SCROLL - FEATURE #2 (Right Aligned)
            → Product fully exploded, internal components visible
            ========================================================= */}
        <div className="h-screen w-full flex items-center justify-end px-6 md:px-16 lg:px-24">
          <motion.div
            style={{ opacity: opacity60, y: y60, x: x60 }}
            className="max-w-2xl text-right flex flex-col items-end pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#0081FB]">
                02 // META ADS ENGINE EXPLODED
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white/90 leading-[1.08]">
              TURN ATTENTION <br />
              <span className="text-white/40">INTO OPPORTUNITY.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-white/60 font-light leading-relaxed max-w-xl">
              Website development. Meta Ads. Digital growth. An exploded digital composition
              dissecting creative velocity, Conversions API attribution, and algorithmic scaling
              to turn cold impressions into enterprise revenue.
            </p>

            <div className="mt-8 flex flex-wrap justify-end gap-3 max-w-md">
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
                  Target ROAS
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">4.8x+</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left backdrop-blur-md">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block">
                  Media Managed
                </span>
                <span className="text-xl font-bold font-mono text-white/90">$12M+</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="h-[20vh]" />

        {/* =========================================================
            SECTION 4: 90% SCROLL - CTA / FINAL MESSAGE (Centered)
            → Product smoothly reassembles into final architecture
            ========================================================= */}
        <div className="h-screen w-full flex items-center justify-center px-6">
          <motion.div
            style={{ opacity: opacity90, y: y90, scale: scale90 }}
            className="max-w-3xl mx-auto text-center flex flex-col items-center pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/80">
                Components Smoothly Reassembled
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/90 leading-[1.04]">
              LET&apos;S BUILD <br />
              <span className="bg-gradient-to-r from-white via-silver-light to-accent-cyan bg-clip-text text-transparent">
                WHAT&apos;S NEXT.
              </span>
            </h2>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-xl font-light tracking-wide leading-relaxed">
              Equip your brand with modern web architectures and proven Meta advertising funnels
              engineered for exponential performance.
            </p>

            {/* Functional CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (onGetWebsite) onGetWebsite();
                  else {
                    const el = document.getElementById('contact-enquiry');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#08090B] font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-silver-light hover:shadow-silver-glow active:scale-95 cursor-pointer"
              >
                GET YOUR WEBSITE
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onDiscussMetaAds) onDiscussMetaAds();
                  else {
                    const el = document.getElementById('contact-enquiry');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] text-white/90 border border-white/20 font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/40 active:scale-95 cursor-pointer backdrop-blur-md"
              >
                DISCUSS META ADS
              </button>
            </div>

            <p className="mt-6 text-xs font-mono text-white/40">
              Direct response within 24 business hours &bull; High-intent partnerships
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
