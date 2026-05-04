import React, { useRef, useEffect } from 'react';
import './Footer.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const Footer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth Scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Particle Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = 65; // 50-80
    const CONNECTION_DIST = 135; // 120-150px
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6, // velocity ~0.2-0.4px/frame
          vy: (Math.random() - 0.5) * 0.6,
        });
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 300);
    };

    window.addEventListener('resize', handleResize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      ctx.fillStyle = 'rgba(20, 184, 166, 0.6)'; // Teal #14b8a6 with opacity
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer className="footer-root">
      {/* Particle Canvas Layer */}
      <canvas ref={canvasRef} className="footer-particles" aria-hidden="true" />

      {/* Content Layer */}
      <div className="footer-content-row flex flex-col md:flex-row justify-between items-center md:items-start max-w-7xl mx-auto relative z-[2] gap-8 md:gap-0 w-full">
        
        {/* LEFT COLUMN */}
        <div className="footer-col-left flex-1 flex flex-col justify-center items-center md:items-start gap-1">
          <h3 className="footer-copyright m-0">© 2026 Priyanshu Upadhyay</h3>
          <p className="footer-roles m-0">
            AI PRACTITIONER &bull; ML DEVELOPER &bull; GENAI BUILDER
          </p>
        </div>

        {/* CENTER COLUMN */}
        <div className="footer-col-center flex-[1.5] flex flex-col justify-center items-center gap-2 text-center">
          <p className="footer-tagline m-0">
            Let's build something intelligent together.
          </p>
          <span className="footer-techstack">
            Built with React &bull; TypeScript &bull; Tailwind &bull; GSAP &bull; Three.js
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div className="footer-col-right flex-1 flex flex-col justify-center items-center md:items-end gap-1">
          <div className="footer-status-item m-0 p-0 flex items-center gap-2">
            <span className="footer-status-dot" aria-hidden="true">🟢</span>
            <span className="footer-status-label">OPEN TO INTERNSHIPS</span>
          </div>
          <div className="footer-status-item m-0 p-0 flex items-center gap-2">
            <span className="footer-status-dot" aria-hidden="true">🟢</span>
            <span className="footer-status-label">OPEN TO FREELANCE</span>
          </div>

          <button
            className="footer-back-to-top m-0 p-0 mt-3"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            BACK TO TOP <span className="btt-arrow">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
