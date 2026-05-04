import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Footer.css';

const Footer: React.FC = () => {
  const bttRef = useRef<HTMLButtonElement>(null);
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
      <div className="footer-grid">
        {/* ── LEFT COLUMN ── */}
        <div className="footer-col-left">
          <h3 className="footer-name">© 2026 Priyanshu Upadhyay</h3>
          <p className="footer-descriptor">
            AI Practitioner &bull; ML Developer &bull; GenAI Builder
          </p>
        </div>

        {/* ── CENTER COLUMN ── */}
        <div className="footer-col-center">
          <p className="footer-cta">
            Let's build something intelligent together.
          </p>
          <p className="footer-techstack">
            Built with React &bull; TypeScript &bull; Tailwind &bull; GSAP &bull; Three.js
          </p>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="footer-col-right">
          <div className="footer-status-item">
            <span className="footer-status-dot" />
            <span className="footer-status-label">Open to Internships</span>
          </div>
          <div className="footer-status-item">
            <span className="footer-status-dot" style={{ animationDelay: '0.8s' }} />
            <span className="footer-status-label">Open to Freelance</span>
          </div>

          <button
            ref={bttRef}
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            Back to Top <span className="btt-arrow">↑</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Signature ── */}
      <div className="footer-divider">
        <span className="footer-bottom-text">
          Designed &amp; Engineered by Priyanshu
        </span>
      </div>
    </footer>
  );
};

export default Footer;
