import React, { useState, useEffect } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // Phase 0 = hidden, 1 = ripple, 2 = lock & glow, 3 = camera zoom, 4 = fade-out
  const [phase, setPhase] = useState(0);

  // ── Phase sequencer ──
  useEffect(() => {
    // Phase 0 → 1: blocks begin the fluid data ripple
    const t1 = setTimeout(() => setPhase(1), 100);

    // Phase 1 → 2: ripple stops, outer blocks drop, center ignites
    const t2 = setTimeout(() => setPhase(2), 2500);

    // Phase 2 → 3: violent camera zoom into center block
    const t3 = setTimeout(() => setPhase(3), 3300);

    // Phase 3 → 4: begin fade-out for unmount
    const t4 = setTimeout(() => setPhase(4), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // ── Lock body scroll & handle unmount ──
  useEffect(() => {
    if (phase < 4) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const t = setTimeout(() => onComplete(), 400);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ── Inject ripple keyframes ── */}
      <style>{`
        @keyframes dataRipple {
          0%, 100% { transform: translateZ(10px); }
          50% { transform: translateZ(60px); }
        }
      `}</style>

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
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* ── 3D Stage ── */}
      <div
        className="relative w-[400px] h-[400px]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)]"
          style={{
            transformStyle: 'preserve-3d',
            transform:
              phase >= 3
                ? 'scale(35) translateZ(250px)'
                : 'rotateX(60deg) rotateZ(-45deg) scale(1)',
          }}
        >
          {/* ── Volumetric 3D Cube Grid (5×5 isometric) ── */}
          {Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const isCenter = row === 2 && col === 2;

            // Radial distance from center for outward wave propagation
            const distanceFromCenter = Math.sqrt(
              Math.pow(row - 2, 2) + Math.pow(col - 2, 2)
            );
            const waveDelay = `${distanceFromCenter * 150}ms`;

            // Phase-driven animation / transform
            let animationStyle = '';
            let transformStyle = '';

            if (phase === 1) {
              // Phase 1: Continuous fluid sine-wave ripple
              animationStyle = 'dataRipple 2s ease-in-out infinite';
            } else if (phase >= 2) {
              // Phase 2 & 3: Lock into final position — center tall, others flat
              transformStyle = `translateZ(${isCenter ? '80px' : '0px'})`;
            } else {
              transformStyle = 'translateZ(0px)';
            }

            // Fixed physical depth of the 3D cube walls
            const blockDepth = 40;

            return (
              <div
                key={i}
                className="absolute w-16 h-16 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  left: `${col * 64}px`,
                  top: `${row * 64}px`,
                  transformStyle: 'preserve-3d',
                  animation: animationStyle,
                  animationDelay: phase === 1 ? waveDelay : '0ms',
                  transform: transformStyle,
                  opacity: phase >= 2 && !isCenter ? 0.1 : 1,
                }}
              >
                {/* ── Top face (frosted glass) ── */}
                <div
                  className="absolute inset-0 backdrop-blur-md"
                  style={{
                    transform: `translateZ(${blockDepth}px)`,
                    backgroundColor: isCenter
                      ? 'rgba(45,212,191,0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${
                      isCenter
                        ? 'rgba(45,212,191,0.8)'
                        : 'rgba(255,255,255,0.2)'
                    }`,
                    boxShadow:
                      isCenter && phase >= 2
                        ? '0 0 40px 10px rgba(45,212,191,0.5)'
                        : 'none',
                  }}
                />

                {/* ── Front wall (bottom edge extrusion) ── */}
                <div
                  className="absolute origin-top"
                  style={{
                    width: '64px',
                    height: `${blockDepth}px`,
                    top: '64px',
                    transform: 'rotateX(-90deg)',
                    backgroundColor: isCenter
                      ? 'rgba(15,118,110,0.8)'
                      : 'rgba(10,10,10,0.8)',
                    borderBottom: `1px solid ${
                      isCenter
                        ? 'rgba(45,212,191,0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                    borderRight: `1px solid ${
                      isCenter
                        ? 'rgba(45,212,191,0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                />

                {/* ── Right wall (side edge extrusion) ── */}
                <div
                  className="absolute origin-left"
                  style={{
                    width: `${blockDepth}px`,
                    height: '64px',
                    left: '64px',
                    transform: 'rotateY(90deg)',
                    backgroundColor: isCenter
                      ? 'rgba(13,148,136,0.6)'
                      : 'rgba(5,5,5,0.9)',
                    borderBottom: `1px solid ${
                      isCenter
                        ? 'rgba(45,212,191,0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                    borderRight: `1px solid ${
                      isCenter
                        ? 'rgba(45,212,191,0.3)'
                        : 'rgba(255,255,255,0.05)'
                    }`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Status label ── */}
      <div
        className={`absolute bottom-12 text-center transition-opacity duration-500 ${
          phase >= 3 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-mono">
          {phase < 1
            ? 'Initializing Latent Space'
            : phase < 2
            ? 'Processing Data Ripple'
            : 'Locking Target Vector'}
        </p>
      </div>
    </div>
  );
};

export default Preloader;
