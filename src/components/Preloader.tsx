import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Polar coordinate "donut" scatter — cubes spawn 25–45vw from center
  const initialPositions = useRef(Array.from({ length: 9 }).map(() => {
    const angle = Math.random() * Math.PI * 2;
    const radius = gsap.utils.random(25, 45);
    return {
      x: Math.cos(angle) * radius + 'vw',
      y: Math.sin(angle) * radius + 'vh',
    };
  })).current;

  useEffect(() => {
    if (!containerRef.current) return;

    document.body.style.overflow = 'hidden';

    const cubes = document.querySelectorAll('.cube');
    const sockets = document.querySelectorAll('.socket');

    // Initialize the P with GSAP (no CSS transform conflict)
    gsap.set('.preloader-p-text', { xPercent: -50, yPercent: -50, opacity: 0 });

    // Position cubes and sockets at their scattered spawn points
    cubes.forEach((cube, i) => {
      gsap.set(cube, {
        x: initialPositions[i].x,
        y: initialPositions[i].y,
        z: 20,
        xPercent: -50,
        yPercent: -50,
        transformStyle: 'preserve-3d'
      });
      gsap.set(sockets[i], {
        x: initialPositions[i].x,
        y: initialPositions[i].y,
        z: 20,
        xPercent: -50,
        yPercent: -50,
      });
    });

    const calculateGridX = (i: number) => (i % 3 - 1) * 80;
    const calculateGridY = (i: number) => (Math.floor(i / 3) - 1) * 80;

    const tl = gsap.timeline();

    // ── Phase 1: Extrude from debossed sockets ──
    tl.to('.cube', { z: 100, duration: 1, ease: 'power2.out', stagger: 0.05 });

    // ── Phase 2: Tumble and Assemble ──
    tl.to('.cube', {
      x: (index) => calculateGridX(index),
      y: (index) => calculateGridY(index),
      rotateX: 360, rotateY: 360, z: 0,
      duration: 1.5, ease: 'power3.inOut'
    });
    tl.addLabel('assembled');

    // ── Phase 3: P appears ON TOP of the fully assembled grid ──
    tl.addLabel('pReveal', '>');
    tl.to('.preloader-p-text', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 'pReveal');

    // ── Phase 5: FLIP Glide to Header .logo-p ──
    tl.addLabel('glide', '>+0.2');
    tl.add(() => {
      const targetP = document.querySelector('.logo-p');
      const preloaderP = document.querySelector('.preloader-p-text') as HTMLElement;

      if (!preloaderP) return;

      // Validation logging
      if (!targetP) {
        console.error(
          "PRELOADER: '.logo-p' is missing from the DOM. " +
          "Ensure <Header /> is mounted (even if opacity: 0) while the Preloader runs. " +
          "Using calibrated fallback."
        );
      } else {
        console.log('PRELOADER: Target .logo-p acquired. Calculating FLIP glide.');
      }

      const pRect = preloaderP.getBoundingClientRect();
      const pCenterX = pRect.left + pRect.width / 2;
      const pCenterY = pRect.top + pRect.height / 2;

      let deltaX: number, deltaY: number, scaleRatio: number;

      if (targetP) {
        // ── Center-to-Center FLIP Math ──
        const targetRect = targetP.getBoundingClientRect();
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        deltaX = targetCenterX - pCenterX;
        deltaY = targetCenterY - pCenterY;
        scaleRatio = targetRect.height / pRect.height;
      } else {
        // ── Calibrated Fallback ──
        deltaX = 40 - pRect.left;
        deltaY = 40 - pRect.top;
        scaleRatio = 32 / pRect.height;
      }

      // THE CINEMATIC FLIP GLIDE AND DISSOLVE
      const glideTl = gsap.timeline({
        onComplete: () => {
          // ── THE SWAP (strict sequence) ──
          
          // 1. Force scroll to absolute top while preloader still covers everything
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0; // Fallback for edge cases
          
          // 2. Make the app visible INSTANTLY — preloader (z:999999) still covers it
          if (onComplete) onComplete();

          // 3. Wait one frame for React to flush, then fade out the entire preloader
          requestAnimationFrame(() => {
            window.scrollTo(0, 0); // One more reset after React render
            
            gsap.to('.preloader-container', {
              opacity: 0,
              duration: 0.4,
              ease: 'power2.inOut',
              onComplete: () => {
                // 4. Only NOW unlock scrolling — page is guaranteed at top
                window.scrollTo(0, 0);
                document.body.style.overflow = 'unset';
                setIsVisible(false);
                
                // 5. Refresh ScrollTrigger so GSAP recalculates without the preloader
                import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
                  ScrollTrigger.refresh();
                });
              }
            });
          });
        }
      });

      // P text glides to the header
      glideTl.to(preloaderP, {
        x: `+=${deltaX}`,
        y: `+=${deltaY}`,
        scale: scaleRatio,
        transformOrigin: 'center center',
        duration: 1.2,
        ease: 'power3.inOut',
      });

      // The 3x3 cube grid remains visible during the glide, and dissolves right as it lands
      glideTl.to('.cube', {
        opacity: 0,
        scale: 0.5,
        rotationX: 45,
        rotationY: 45,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.05
      }, "-=0.6"); // Perfectly overlaps the end of the P transition
    }, 'glide');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="preloader-container"
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#161616',
        zIndex: 999999,
        perspective: '1500px'
      }}
    >
      {/* Debossed Socket Layer */}
      <div className="sockets-layer" style={{ position: 'absolute', inset: 0, top: '50%', left: '50%' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`socket-${i}`}
            className="socket"
            style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              backgroundColor: '#0a1a1a',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,128,128,0.3), 0 0 4px rgba(0,255,255,0.2)',
              borderRadius: '4px',
              border: '1px solid rgba(0,128,128,0.15)'
            }}
          />
        ))}
      </div>

      {/* Master Docking Wrapper — 3D context for the cubes only */}
      <div className="master-docking-wrapper" style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {/* 3D Cubes Grid */}
        <div
          className="cubes-grid-wrapper"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d'
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={`cube-${i}`}
              className="cube"
              style={{
                position: 'absolute',
                width: '80px',
                height: '80px',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="face front" style={faceStyle(0, 0, 40, 0, 0, '#161616')} />
              <div className="face back" style={faceStyle(0, 0, -40, 180, 0, '#00f5d4')} />
              <div className="face right" style={faceStyle(40, 0, 0, 0, 90, '#00f5d4')} />
              <div className="face left" style={faceStyle(-40, 0, 0, 0, -90, '#00f5d4')} />
              <div className="face top" style={faceStyle(0, -40, 0, 90, 0, '#00f5d4')} />
              <div className="face bottom" style={faceStyle(0, 40, 0, -90, 0, '#00f5d4')} />
            </div>
          ))}
        </div>
      </div>

      {/* The "P" — OUTSIDE the 3D wrapper so it lives in flat 2D coordinate space */}
      <div
        className="preloader-p-text"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 999999,
          pointerEvents: 'none',
          color: '#FFFFFF',
          fontSize: '8rem',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 500,
          margin: 0,
          lineHeight: 1
        }}
      >
        P
      </div>

      <style>{`
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          backface-visibility: hidden;
          border: 1px solid #008080;
        }
        .face.front {
          border: 1px solid #333;
        }
      `}</style>
    </div>
  );
};

const faceStyle = (tx: number, ty: number, tz: number, rx: number, ry: number, bg: string): React.CSSProperties => ({
  transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
  backgroundColor: bg
});

export default Preloader;
