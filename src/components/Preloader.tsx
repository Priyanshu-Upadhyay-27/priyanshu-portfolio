import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [phase, setPhase] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // The Cinematic Timeline
    const p1 = setTimeout(() => setPhase(1), 100);    // Wave
    const p2 = setTimeout(() => setPhase(2), 2500);   // Center Lock
    const p3 = setTimeout(() => setPhase(3), 3000);   // Evaporate to Neon Wireframe
    const p4 = setTimeout(() => setPhase(4), 3400);   // Camera Fly-Through & Fade Out
    const end = setTimeout(() => {
      setShowPreloader(false);
      document.body.style.overflow = 'auto';
    }, 4500);

    return () => {
      clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4); clearTimeout(end);
    };
  }, []);

  if (!showPreloader) return null;

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 999999, backgroundColor: '#030303', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', 
      opacity: phase >= 4 ? 0 : 1, // Fade entire component on Phase 4
      transition: 'opacity 0.8s ease-in-out', 
      pointerEvents: phase >= 3 ? 'none' : 'auto' 
    }}>
      
      <style>{`
        @keyframes isometricRipple {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(40px); }
        }
        .data-stage { position: relative; width: 320px; height: 320px; perspective: 1500px; zIndex: 10; }
        .data-grid-wrapper {
          position: absolute; inset: 0; transform-style: preserve-3d;
          transition: transform 1s cubic-bezier(0.7, 0, 0.2, 1);
        }
        .data-cube-container { position: absolute; width: 64px; height: 64px; transform-style: preserve-3d; }
        .data-cube-animator {
          position: relative; width: 100%; height: 100%; transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .data-face { 
          position: absolute; 
          transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease; 
        }
        .data-face-top { inset: 0; transform: translateZ(30px); }
        .data-face-front { left: 0; top: 100%; width: 64px; height: 80px; transform-origin: top; transform: translateZ(30px) rotateX(-90deg); }
        .data-face-left { left: 0; top: 0; width: 80px; height: 64px; transform-origin: left; transform: translateZ(30px) rotateY(90deg); }
      `}</style>

      <div className="data-stage">
        <div className="data-grid-wrapper" style={{ 
          // Phase 4 shoots the camera directly through the transparent wireframes
          transform: phase >= 4 
            ? 'rotateX(60deg) rotateZ(-45deg) scale(20) translateZ(400px)' 
            : 'rotateX(60deg) rotateZ(-45deg) scale(1) translateZ(0px)' 
        }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5); const col = i % 5;
            const isCenter = row === 2 && col === 2; 
            const dist = Math.abs(row - 2) + Math.abs(col - 2);
            const delayInSeconds = dist * 0.15; 
            
            const isLocked = phase >= 2;
            const isWireframe = phase >= 3;

            const activeTransform = isLocked ? (isCenter ? 'translateZ(80px)' : 'translateZ(0px)') : undefined;
            
            // WIREFRAME STYLING LOGIC
            const neonCyan = 'rgba(34, 211, 238, 0.8)';
            const neonPurple = 'rgba(168, 85, 247, 0.8)';
            const wireColor = isCenter ? neonPurple : neonCyan;

            return (
              <div key={i} className="data-cube-container" style={{ left: `${col * 64}px`, top: `${row * 64}px` }}>
                <div 
                  className="data-cube-animator"
                  style={{
                    animation: phase === 1 ? `isometricRipple 2s ease-in-out -${delayInSeconds}s infinite` : 'none',
                    transform: activeTransform,
                  }}
                >
                  <div className="data-face data-face-top" style={{ 
                    backgroundColor: isWireframe ? 'transparent' : (isCenter ? (isLocked ? '#eab308' : '#14b8a6') : '#1f1f1f'), 
                    border: `1px solid ${isWireframe ? wireColor : (isCenter ? (isLocked ? '#fef08a' : '#5eead4') : '#333333')}`, 
                    boxShadow: isWireframe ? `0 0 15px ${wireColor} inset` : (isCenter && isLocked ? '0 0 80px 20px rgba(234, 179, 8, 0.5)' : 'none') 
                  }} />
                  <div className="data-face data-face-front" style={{ 
                    backgroundColor: isWireframe ? 'transparent' : (isCenter ? (isLocked ? '#ca8a04' : '#0f766e') : '#0a0a0a'), 
                    border: `1px solid ${isWireframe ? wireColor : (isCenter ? (isLocked ? '#facc15' : '#2dd4bf') : '#222222')}` 
                  }} />
                  <div className="data-face data-face-left" style={{ 
                    backgroundColor: isWireframe ? 'transparent' : (isCenter ? (isLocked ? '#a16207' : '#0d9488') : '#000000'), 
                    border: `1px solid ${isWireframe ? wireColor : (isCenter ? (isLocked ? '#facc15' : '#2dd4bf') : '#222222')}` 
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: '3rem', opacity: phase >= 2 ? 0 : 1, transition: 'opacity 0.3s', fontFamily: 'monospace', fontSize: '10px', color: 'rgba(20, 184, 166, 0.5)', letterSpacing: '0.4em', textTransform: 'uppercase', zIndex: 10 }}>
        Initializing Data Architecture
      </div>
    </div>
  );
}
