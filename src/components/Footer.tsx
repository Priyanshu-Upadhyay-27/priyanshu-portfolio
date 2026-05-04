import React, { useRef, useEffect } from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth Scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Autonomous Particle Web Animation Loop (Match Contact Section)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let dots: { x: number, y: number, vx: number, vy: number }[] = [];
    const DOT_COUNT = 200; // Match Contact section density
    let pulseX = -300; // Start the pulse off-screen

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const initDots = () => {
      dots = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
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
      initDots();
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 300);
    };

    window.addEventListener('resize', handleResize);
    resize();

    const draw = () => {
      // Create a fading trail effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.5)';
      ctx.fillRect(0, 0, width, height);

      // Advance pulse position
      pulseX += 3; // Speed of the pulse moving right
      if (pulseX > width + 300) {
        pulseX = -300; // Reset after it goes off screen
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        // Calculate pulse effect for this dot
        const distToPulse = Math.abs(dot.x - pulseX);
        const pulseEffect = Math.max(0, 1 - distToPulse / 200);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5 + (pulseEffect * 1.5), 0, Math.PI * 2);
        
        const dotAlpha = 0.4 + (pulseEffect * 0.6);
        ctx.fillStyle = `rgba(20, 184, 166, ${dotAlpha})`;
        ctx.fill();

        // Check distance to other dots to form a web
        for (let j = i + 1; j < dots.length; j++) {
          const otherDot = dots[j];
          const ddx = otherDot.x - dot.x;
          const ddy = otherDot.y - dot.y;
          const distToDot = Math.sqrt(ddx * ddx + ddy * ddy);

          // Connecting distance from Contact section
          if (distToDot < 80) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            const baseOpacity = 1 - (distToDot / 80);
            
            // Average distance of the line to the pulse
            const lineCenterX = (dot.x + otherDot.x) / 2;
            const lineDistToPulse = Math.abs(lineCenterX - pulseX);
            const linePulseEffect = Math.max(0, 1 - lineDistToPulse / 200);
            
            const lineAlpha = (baseOpacity * 0.5) + (linePulseEffect * 0.5);
            ctx.strokeStyle = `rgba(20, 184, 166, ${lineAlpha})`;
            ctx.lineWidth = 0.5 + (linePulseEffect * 1);
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
      {/* Canvas Layer placed BEHIND glass */}
      <canvas ref={canvasRef} className="footer-particles" aria-hidden="true" />

      {/* Glass Layer with Content (z-index 10) */}
      <div className="footer-glass">
        <div className="footer-content-row flex flex-col md:flex-row justify-between items-center md:items-start max-w-7xl mx-auto relative z-10 gap-8 md:gap-0 w-full">
          
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
      </div>
    </footer>
  );
};

export default Footer;
