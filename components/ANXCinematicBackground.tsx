'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';

interface ANXCinematicBackgroundProps {
  totalFrames?: number;
  imageDirectory?: string;
  framePrefix?: string;
  bgColor?: string;
}

export default function ANXCinematicBackground({
  totalFrames = 96,
  imageDirectory = '/frames/',
  framePrefix = 'anx_frame_',
  bgColor = '#08090B',
}: ANXCinematicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading & Asset State
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(0);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const prefersReducedMotion = useReducedMotion();

  // useScroll tracks global window scroll progress (0 -> 1 across the whole document)
  const { scrollYProgress } = useScroll();

  // Multi-pattern image preloader
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
        setLoadError(true);
        setIsLoaded(true);
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, imageDirectory, framePrefix]);

  // Procedural fallback visualizer if frames are missing
  const drawProceduralFallback = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const time = progress * Math.PI * 2;

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

        // Blending Vignette:
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
        radialGrad.addColorStop(0.72, 'rgba(8, 9, 11, 0.4)');
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

  // Hook Framer Motion scroll changes to direct Canvas updates via RAF
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number | null = null;

    const handleScrollUpdate = (latest: number) => {
      setScrollPercent(Math.round(latest * 100));
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
    <>
      {/* 1. INITIAL LOADING OVERLAY */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08090B] text-white">
          <div className="relative flex items-center justify-center w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/80 animate-spin" />
            <div
              className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent-cyan/80 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
            />
            <span className="font-mono text-sm tracking-widest font-black text-white/90">
              ANX
            </span>
          </div>

          <div className="flex flex-col items-center space-y-2 text-center px-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-mono">
              INITIALIZING DIGITAL WORKSPACE
            </p>
            <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-white/40 via-accent-cyan to-white transition-all duration-150 ease-out"
                style={{
                  width: `${Math.round((loadedCount / Math.max(1, totalFrames)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[11px] font-mono text-white/40 pt-1">
              {Math.min(loadedCount, totalFrames)} / {totalFrames} Frames Cached
            </p>
          </div>
        </div>
      )}

      {/* 2. FIXED FULLSCREEN BACKGROUND CANVAS (PERMANENTLY BEHIND THE WHOLE SITE) */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none canvas-blend-mask"
        />

        {/* Atmospheric overlays seamlessly blended */}
        <div className="absolute inset-0 radial-glow-silver pointer-events-none" />
        <div className="absolute inset-0 radial-glow-cyan pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none opacity-40" />

        {/* Global Progress Bar pinned at viewport top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-white/30 via-accent-cyan to-white/90 transition-all duration-75 ease-out"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        {/* Cinematic HUD Pill (Bottom-Right, stays throughout entire scroll) */}
        <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-[10px] font-mono text-white/60 tracking-wider">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SEQ: 3D_WORKSPACE</span>
          <span className="text-white/20">|</span>
          <span>FRAME: {String(currentFrameDisplay + 1).padStart(3, '0')}</span>
          <span className="text-white/20">|</span>
          <span className="text-accent-cyan">{scrollPercent}%</span>
        </div>
      </div>
    </>
  );
}
