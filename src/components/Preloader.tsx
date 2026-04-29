import React, { useState, useEffect, useMemo } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // Phase 0 = initializing, 1 = rising, 2 = zooming, 3 = complete
  const [phase, setPhase] = useState(0);

  // Pre-compute random heights so they don't change on re-render
  const blockHeights = useMemo(
    () => Array.from({ length: 25 }, () => Math.random() * 40 + 10),
    []
  );

  // ── Phase sequencer ──
  useEffect(() => {
    // Phase 0 → 1: blocks begin rising
    const t1 = setTimeout(() => setPhase(1), 100);

    // Phase 1 → 2: camera zoom begins
    const t2 = setTimeout(() => setPhase(2), 1600); // 100 + 1500

    // Phase 2 → 3: animation complete, reveal site
    const t3 = setTimeout(() => setPhase(3), 2400); // 1600 + 800

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // ── Lock body scroll until complete ──
  useEffect(() => {
    if (phase < 3) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Give the fade-out transition time to finish, then unmount
      const t = setTimeout(() => onComplete(), 700);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ── Ambient scan lines (subtle CRT / tech overlay) ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ── 3D Stage ── */}
      <div
        className="relative w-[300px] h-[300px]"
        style={{ perspective: '1000px' }}
      >
        <div
          className="absolute inset-0 transition-transform ease-[cubic-bezier(0.85,0,0.15,1)]"
          style={{
            transformStyle: 'preserve-3d',
            transform:
              phase >= 2
                ? 'scale(25) translateZ(200px)'
                : 'rotateX(60deg) rotateZ(-45deg) scale(1)',
            transitionDuration: '800ms',
          }}
        >
          {/* ── Data Blocks (5×5 grid) ── */}
          {Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const isCenter = i === 12;

            const translateZ =
              phase >= 1
                ? isCenter
                  ? '60px'
                  : `${blockHeights[i]}px`
                : '0px';

            const delay = `${(row + col) * 50}ms`;

            return (
              <div
                key={i}
                className="absolute w-12 h-12 border border-teal-500/30 transition-transform duration-1000 ease-out"
                style={{
                  left: `${col * 48}px`,
                  top: `${row * 48}px`,
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${translateZ})`,
                  transitionDelay: delay,
                  backgroundColor: isCenter
                    ? 'rgba(45, 212, 191, 0.2)'
                    : 'rgba(255, 255, 255, 0.02)',
                  boxShadow:
                    isCenter && phase >= 1
                      ? '0 0 20px rgba(45, 212, 191, 0.5)'
                      : 'none',
                }}
              >
                {/* 3D side — bottom face */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 origin-bottom"
                  style={{ transform: 'rotateX(-90deg) translateZ(48px)' }}
                />
                {/* 3D side — right face */}
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent to-black/50 origin-right"
                  style={{ transform: 'rotateY(90deg) translateZ(48px)' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Processing label ── */}
      <p
        className={`absolute bottom-12 font-mono text-xs tracking-[0.25em] uppercase transition-opacity duration-500 ${
          phase >= 2 ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ color: 'rgba(45,212,191,0.5)' }}
      >
        {phase < 1 ? 'INITIALIZING_MATRIX...' : 'CONSTRUCTING_DATA_BLOCKS...'}
      </p>
    </div>
  );
};

export default Preloader;
