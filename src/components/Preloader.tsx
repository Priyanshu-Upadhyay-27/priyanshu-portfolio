import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [phase, setPhase] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // DEV BYPASS: Session storage disabled for testing. 
    // Uncomment for production deployment.
    // if (sessionStorage.getItem('portfolioLoaded')) {
    //   setShowPreloader(false);
    //   return;
    // }

    document.body.style.overflow = 'hidden';
    
    // Strict cinematic timeline
    const p1 = setTimeout(() => setPhase(1), 100);    // Start diamond wave
    const p2 = setTimeout(() => setPhase(2), 2500);   // Abyss Drop & Center Lock
    const p3 = setTimeout(() => setPhase(3), 3200);   // Camera Hyper-Dive
    const end = setTimeout(() => {
      setShowPreloader(false);
      // sessionStorage.setItem('portfolioLoaded', 'true');
      document.body.style.overflow = 'auto';
    }, 4000);

    return () => {
      clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(end);
    };
  }, []);

  if (!showPreloader) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 999999, 
      backgroundColor: '#030303', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden', 
      opacity: phase >= 3 ? 0 : 1, 
      transition: 'opacity 0.8s ease-in', // Perfectly synced to the 800ms dive
      pointerEvents: phase >= 3 ? 'none' : 'auto' 
    }}>
      
      <style>{`
        @keyframes isometricRipple {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(40px); }
        }
        .data-stage {
          position: relative;
          width: 320px;
          height: 320px;
          perspective: 1500px;
        }
        .data-grid-wrapper {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .data-cube-container {
          position: absolute;
          width: 64px;
          height: 64px;
          transform-style: preserve-3d;
        }
        .data-cube-animator {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          /* Removed hardcoded transition so we can control it inline via React */
        }
        .data-face {
          position: absolute;
          transition: background-color 0.5s, border-color 0.5s, box-shadow 0.5s;
        }
        .data-face-top {
          inset: 0;
          transform: translateZ(30px);
        }
        .data-face-front {
          left: 0;
          top: 100%;
          width: 64px;
          height: 80px; 
          transform-origin: top;
          transform: translateZ(30px) rotateX(-90deg);
        }
        .data-face-left {
          left: 0;
          top: 0;
          width: 80px; 
          height: 64px;
          transform-origin: left;
          transform: translateZ(30px) rotateY(90deg);
        }
      `}</style>

      <div className="data-stage">
        <div className="data-grid-wrapper" style={{ 
          transform: phase >= 3 
            ? 'rotateX(60deg) rotateZ(-45deg) scale(8) translateZ(100px)' 
            : 'rotateX(60deg) rotateZ(-45deg) scale(1) translateZ(0px)' 
        }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const isCenter = row === 2 && col === 2; 
            
            // MATH FOR GEOMETRIC DIAMOND WAVE PATTERN
            const dist = Math.abs(row - 2) + Math.abs(col - 2);
            // Delay in seconds
            const delayInSeconds = dist * 0.15; 
            
            // NEURAL PULSE LOGIC
            const isLocked = phase >= 2;
            
            // Phase 3 calculates a cascading delay based on distance from center
            const dissolveDelay = phase >= 3 ? `${dist * 80}ms` : '0ms';
            
            let activeTransform = undefined;
            if (phase === 2) activeTransform = 'translateZ(0px)';
            if (phase >= 3) activeTransform = 'translateZ(-100px) scale(0)'; // Shatter to nothing

            return (
              <div key={i} className="data-cube-container" style={{ left: `${col * 64}px`, top: `${row * 64}px` }}>
                <div 
                  className="data-cube-animator"
                  style={{
                    animation: phase === 1 
                      ? `isometricRipple 2s ease-in-out -${delayInSeconds}s infinite` 
                      : 'none',
                    transform: activeTransform,
                    opacity: phase >= 3 ? 0 : 1,
                    // The magic happens here: smooth transition with a cascading delay
                    transition: `transform 0.6s cubic-bezier(0.85, 0, 0.15, 1) ${dissolveDelay}, opacity 0.5s ease-out ${dissolveDelay}`,
                  }}
                >
                  
                  <div className="data-face data-face-top" style={{ 
                    backgroundColor: isCenter ? (isLocked ? '#eab308' : '#14b8a6') : '#1f1f1f',
                    border: `1px solid ${isCenter ? (isLocked ? '#fef08a' : '#5eead4') : '#333333'}`,
                    boxShadow: isCenter && isLocked ? '0 0 80px 20px rgba(234, 179, 8, 0.5)' : 'none'
                  }} />
                  
                  <div className="data-face data-face-front" style={{ 
                    backgroundColor: isCenter ? (isLocked ? '#ca8a04' : '#0f766e') : '#0a0a0a',
                    border: `1px solid ${isCenter ? (isLocked ? '#facc15' : '#2dd4bf') : '#222222'}`
                  }} />
                  
                  <div className="data-face data-face-left" style={{ 
                    backgroundColor: isCenter ? (isLocked ? '#a16207' : '#0d9488') : '#000000',
                    border: `1px solid ${isCenter ? (isLocked ? '#facc15' : '#2dd4bf') : '#222222'}`
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '3rem', 
        opacity: phase >= 2 ? 0 : 1, 
        transition: 'opacity 0.3s', 
        fontFamily: 'monospace', 
        fontSize: '10px', 
        color: 'rgba(20, 184, 166, 0.5)', 
        letterSpacing: '0.4em', 
        textTransform: 'uppercase' 
      }}>
        Initializing Data Architecture
      </div>
    </div>
  );
}
