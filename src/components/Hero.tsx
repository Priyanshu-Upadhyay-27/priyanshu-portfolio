import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const portraitCoverRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const swooshPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const cover = portraitCoverRef.current;
    const path = swooshPathRef.current;
    if (!cover || !path) return;

    // ── Measure the SVG path length for the draw effect ──
    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // ── Master ScrollTrigger Timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: false,
      },
    });

    // Phase A: Cover shrinks into a centered box (0% → 60% of scroll)
    tl.to(
      cover,
      {
        scale: 0.45,
        borderRadius: '24px',
        ease: 'none',
        duration: 0.6, // 60% of timeline
      },
      0
    );

    // Fade out the metadata text as the cover starts shrinking
    tl.to(
      '.hero-cover-meta',
      {
        opacity: 0,
        ease: 'none',
        duration: 0.25,
      },
      0
    );

    // Phase B: Draw the neon swoosh after shrink completes (60% → 100%)
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 0.4, // remaining 40% of timeline
      },
      0.6 // starts after Phase A
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="hero-scroll-container">
      {/* ═══════════════════════════════════════════════════
          LAYER 1 — FIXED BACKGROUND TEXT
          Dead center, lowest z-index.
          Revealed as the cover shrinks on scroll.
      ═══════════════════════════════════════════════════ */}
      <div className="hero-bg-fixed">
        <span className="hero-bg-text" aria-hidden="true">
          PRIYANSHU
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════
          LAYER 2 — PORTRAIT COVER
          Full-screen dark panel that hides bg text.
          GSAP shrinks it into a floating box on scroll.
      ═══════════════════════════════════════════════════ */}
      <div ref={portraitCoverRef} className="hero-portrait-cover">
        <img
          src="/portrait_nobg3.png"
          alt="Priyanshu Upadhyay — Applied AI Engineer"
          className="hero-portrait"
        />

        <div className="hero-cover-meta">
          <div className="hero-role">
            <span className="hero-role__label">Applied AI Engineer</span>
          </div>

          <div className="hero-identity">
            <h1 className="hero-identity__title">
              Priyanshu{' '}
              <span className="hero-identity__accent">Upadhyay</span>
            </h1>
            <p className="hero-identity__description">
              Building RAG systems, computer vision pipelines, and
              production-grade ML experiences that push the boundary of
              applied intelligence.
            </p>
          </div>

          <div className="hero-scroll-indicator">
            <span className="hero-scroll-indicator__text">
              Scroll to explore
            </span>
            <div className="hero-scroll-indicator__line" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          LAYER 3 — SVG OVERLAY with Neon Swoosh
          Draws itself across the screen via GSAP
          after the portrait cover finishes shrinking.
      ═══════════════════════════════════════════════════ */}
      <svg
        ref={svgOverlayRef}
        className="hero-svg-overlay"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          ref={swooshPathRef}
          className="hero-swoosh"
          d="
            M -100,750
            C 300,850  500,200  960,540
            S 1600,100 2020,400
          "
        />
      </svg>
    </div>
  );
};

export default Hero;
