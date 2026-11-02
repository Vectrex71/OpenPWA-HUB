import React, { useEffect, useRef } from 'react';

export const DynamicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Smooth interpolation (lerp) for liquid, organic motion
    const animate = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* 1. Base Neumorphic Ambient Wash */}
      <div className="absolute inset-0 bg-[#e6ecf4]" />

      {/* 2. Soft Ambient Color Blooms (Organic Atmospheric Depth) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-sky-400/15 blur-[120px] animate-pulse duration-[8000ms]" />
      <div className="absolute top-[35%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-400/12 blur-[130px] animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[-10%] right-[15%] w-[650px] h-[650px] rounded-full bg-cyan-400/12 blur-[140px] animate-pulse duration-[9000ms]" />

      {/* 3. Starres Punkt-Muster (Precision Dot Matrix Grid) */}
      <div
        className="absolute inset-0 opacity-45 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle, #64748b 1.2px, transparent 1.2px), radial-gradient(circle, #94a3b8 0.8px, transparent 0.8px)',
          backgroundSize: '24px 24px, 48px 48px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* 4. Fein strukturiertes Tech-Gitternetz (Subtle Isometric Accent Lines) */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      {/* 5. Dynamischer Mouseover Spotlight Schein (folgt dem Mauszeiger geschmeidig) */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none will-change-transform transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle at center, rgba(14, 165, 233, 0.22) 0%, rgba(99, 102, 241, 0.12) 35%, rgba(168, 85, 247, 0.05) 55%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'translate3d(-400px, -400px, 0)',
        }}
      />

      {/* 6. Feiner Vignetten-Rahmen für Tiefenwirkung */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(184,196,214,0.35)]" />
    </div>
  );
};
