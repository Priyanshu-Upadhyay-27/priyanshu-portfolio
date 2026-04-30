import React, { useState, useEffect } from 'react';

export default function Preloader() {
  // phase 0: hidden, phase 1: ripple wave, phase 2: center lock, phase 3: camera dive
  const [phase, setPhase] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // DEV BYPASS: Session storage disabled for testing. 
    // Uncomment for production.
    // if (sessionStorage.getItem('portfolioLoaded')) {
    //   setShowPreloader(false);
    //   return;
    // }

    document.body.style.overflow = 'hidden';
    
    // Sequence the animation strictly
    const p1 = setTimeout(() => setPhase(1), 100);    // Start wave
    const p2 = setTimeout(() => setPhase(2), 2500);   // Lock center
    const p3 = setTimeout(() => setPhase(3), 3200);   // Zoom camera
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
    <div className={`fixed inset-0 z-[999999] bg-[#030303] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${phase >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      
      <style>{`
        @keyframes isometricRipple {
          0%, 100% { transform: translateZ(0px); }
          50% { transform: translateZ(50px); }
        }
        .animate-ripple {
          animation: isometricRipple 2s ease-in-out infinite;
        }
      `}</style>

      
      <div className="relative w-[320px] h-[320px]" style={{ perspective: '1500px' }}>
        <div 
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)]"
          style={{ 
            transformStyle: 'preserve-3d', 
            // The exact isometric angle, diving into the screen on phase 3
            transform: phase >= 3 ? 'scale(40) translateZ(300px)' : 'rotateX(60deg) rotateZ(-45deg) scale(1)' 
          }}
        >
          
          {Array.from({ length: 25 }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const isCenter = row === 2 && col === 2; 
            
            // Math for the negative delay wave
            const dist = Math.sqrt(Math.pow(row - 2, 2) + Math.pow(col - 2, 2));
            const waveDelay = `-${dist * 0.2}s`; 

            // Phase logic
            const isRippling = phase === 1;
            const isLocked = phase >= 2;
            
            return (
              <div 
                key={i}
                className="absolute w-[64px] h-[64px]"
                style={{
                  left: `${col * 64}px`,
                  top: `${row * 64}px`,
                  transformStyle: 'preserve-3d',
                }}
              >
                
                <div 
                  className={`relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isRippling ? 'animate-ripple' : ''}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    animationDelay: waveDelay,
                    transform: isLocked ? `translateZ(${isCenter ? '80px' : '0px'})` : undefined,
                    opacity: isLocked && !isCenter ? 0.05 : 1,
                  }}
                >
                  
                  <div 
                    className="absolute inset-0 backdrop-blur-md transition-colors duration-500"
                    style={{
                      transform: 'translateZ(30px)', // The thickness of the blocks
                      backgroundColor: isCenter ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isCenter ? 'rgba(45,212,191,0.8)' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: isCenter && isLocked ? '0 0 50px 10px rgba(45,212,191,0.6)' : 'none',
                    }}
                  />
                  
                  
                  <div 
                    className="absolute w-[64px] h-[30px] origin-top transition-colors duration-500"
                    style={{
                      top: '100%',
                      transform: 'rotateX(-90deg)',
                      backgroundColor: isCenter ? 'rgba(15,118,110,0.9)' : 'rgba(15,15,15,0.95)',
                      borderBottom: `1px solid ${isCenter ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  />

                  
                  <div 
                    className="absolute w-[30px] h-[64px] origin-left transition-colors duration-500"
                    style={{
                      left: '100%',
                      transform: 'rotateY(90deg)',
                      backgroundColor: isCenter ? 'rgba(13,148,136,0.7)' : 'rgba(8,8,8,0.98)',
                      borderRight: `1px solid ${isCenter ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className={`absolute bottom-12 transition-opacity duration-300 ${phase >= 2 ? 'opacity-0' : 'opacity-100'}`}>
        <p className="font-mono text-[10px] text-teal-500/50 tracking-[0.4em] uppercase">
          Processing Data Ripple
        </p>
      </div>

    </div>
  );
}
