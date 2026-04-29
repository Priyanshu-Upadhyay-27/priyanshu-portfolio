import React, { useState, useEffect, useCallback } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Lock body scroll while preloader is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Smooth progress increment from 0 → 100 over 2300ms
  useEffect(() => {
    const duration = 2300; // ms
    const interval = 20;  // update every 20ms for butter-smooth motion
    const steps = duration / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setProgress(100);

        // Wait 200ms after reaching 100, then trigger blast doors
        setTimeout(() => {
          setIsComplete(true);

          // After 1200ms reveal animation, unmount preloader
          setTimeout(() => {
            onComplete();
          }, 1200);
        }, 200);
      } else {
        setProgress(current);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center">

      {/* ── TOP BLAST DOOR PANEL ── */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-black z-[9998] transition-transform duration-[1200ms]"
        style={{
          transform: isComplete ? 'translateY(-100%)' : 'translateY(0%)',
          transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
        }}
      />

      {/* ── BOTTOM BLAST DOOR PANEL ── */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black z-[9998] transition-transform duration-[1200ms]"
        style={{
          transform: isComplete ? 'translateY(100%)' : 'translateY(0%)',
          transitionTimingFunction: 'cubic-bezier(0.85, 0, 0.15, 1)',
        }}
      />

      {/* ── SEAM GLOW (the horizontal light bleed between doors) ── */}
      <div
        className="absolute left-0 w-full h-[2px] z-[9999] transition-opacity duration-300 pointer-events-none"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.0) 10%, rgba(45,212,191,0.6) 50%, rgba(45,212,191,0.0) 90%, transparent 100%)',
          boxShadow: '0 0 30px 8px rgba(45,212,191,0.15)',
          opacity: isComplete ? 0 : 1,
        }}
      />

      {/* ── CENTER LOADER CONTENT ── */}
      <div
        className={`relative flex flex-col items-center z-[10000] transition-opacity duration-300 ${
          isComplete ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* The Track Container */}
        <div className="w-64 h-16 flex items-center relative overflow-hidden">

          {/* 1. The Glowing Laser Node (The spark) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
            style={{
              left: `${progress}%`,
              transition: 'left 150ms linear',
              width: '16px',
              height: '16px',
              marginLeft: '-8px',
            }}
          >
            {/* Core dot */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, #5eead4 0%, #2dd4bf 40%, rgba(45,212,191,0) 70%)',
                boxShadow: '0 0 20px 5px rgba(45,212,191,0.6), 0 0 60px 10px rgba(45,212,191,0.2)',
              }}
            />
            {/* Laser flare streaks */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: '-12px',
                width: '40px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.4) 30%, rgba(45,212,191,0.8) 50%, rgba(45,212,191,0.4) 70%, transparent 100%)',
                filter: 'blur(1px)',
              }}
            />
          </div>

          {/* 2. The Filled Progress Bar */}
          <div
            className="h-[1px] z-10 relative"
            style={{
              width: `${progress}%`,
              transition: 'width 150ms linear',
              background: 'linear-gradient(90deg, rgba(45,212,191,0.3) 0%, rgba(45,212,191,0.8) 100%)',
            }}
          />

          {/* 3. The Unfilled Track Line */}
          <div className="absolute inset-0 top-1/2 -translate-y-1/2 w-full z-0 h-[1px] bg-white/10" />
        </div>

        {/* 4. Percentage Counter */}
        <div className="flex items-center gap-3 mt-3">
          <span
            className="font-mono text-sm tracking-widest tabular-nums"
            style={{ color: 'rgba(45,212,191,0.9)' }}
          >
            {String(Math.round(progress)).padStart(3, '0')}
          </span>
          <span className="text-white/20 text-xs font-mono">/</span>
          <span className="text-white/20 text-xs font-mono">100</span>
        </div>

        {/* 5. The Processing Text */}
        <p
          className="font-mono text-xs tracking-[0.25em] uppercase mt-2"
          style={{ color: 'rgba(45,212,191,0.5)' }}
        >
          {progress < 100 ? 'PROCESSING_DATA...' : 'SEQUENCE_COMPLETE'}
        </p>
      </div>

      {/* ── AMBIENT SCAN LINES (subtle CRT / tech overlay) ── */}
      <div
        className="absolute inset-0 z-[9997] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />
    </div>
  );
};

export default Preloader;
