import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Footer.css';

const Footer: React.FC = () => {
  const bttRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const magnetBounds = 80; // px radius for magnetic pull

  // ── GSAP Magnetic Effect on Back-to-Top ──
  useEffect(() => {
    const btn = bttRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distX = e.clientX - btnCenterX;
      const distY = e.clientY - btnCenterY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < magnetBounds) {
        const strength = 1 - distance / magnetBounds;
        gsap.to(btn, {
          x: distX * strength * 0.4,
          y: distY * strength * 0.4,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ── GSAP Autonomous Pulse Animation ──
  useEffect(() => {
    if (!pulseRef.current) return;
    
    // Sweeping autonomous pulse
    gsap.to(pulseRef.current, {
      xPercent: 200, // Sweeps across the width
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  // ── GSAP Smooth Scroll to Top ──
  const scrollToTop = () => {
    const scrollProxy = { y: window.scrollY };
    gsap.to(scrollProxy, {
      y: 0,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => window.scrollTo(0, scrollProxy.y),
    });
  };

  return (
    <footer className="footer-root">
      
      {/* ── Autonomous CSS/GSAP Pulse ── */}
      <div 
        ref={pulseRef} 
        className="footer-pulse"
      />

      {/* ── Compact Horizontal Layout ── */}
      <div className="footer-content-row flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto relative z-10 gap-6 md:gap-0">
        
        {/* ── LEFT: Copyright ── */}
        <div className="footer-col-left flex-1 flex justify-start">
          <h3 className="footer-name m-0 text-sm md:text-base">© 2026 Priyanshu Upadhyay</h3>
        </div>

        {/* ── CENTER: Tech & Status ── */}
        <div className="footer-col-center flex-1 flex justify-center items-center gap-4">
          <span className="footer-techstack text-[0.55rem] md:text-xs">
            REACT &bull; GSAP &bull; THREE.JS
          </span>
          <span className="text-white/20">|</span>
          <div className="footer-status-item m-0 p-0 flex items-center gap-2">
            <span className="footer-status-dot w-1.5 h-1.5" />
            <span className="footer-status-label text-[0.55rem] md:text-xs">Open to Internships</span>
          </div>
        </div>

        {/* ── RIGHT: Back to Top ── */}
        <div className="footer-col-right flex-1 flex justify-end">
          <button
            ref={bttRef}
            className="footer-back-to-top m-0 p-0 text-xs"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            Back to Top <span className="btt-arrow">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
