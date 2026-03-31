import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLSpanElement>(null);
  const row2Ref = useRef<HTMLSpanElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  // Kinetic text strings
  const row1 = 'BUILD-TRAIN-DEPLOY ⸻ ';
  const row2 = 'APPLIED AI . END-TO-END MACHINE LEARNING . ';

  useEffect(() => {
    const hero = heroRef.current;
    const bgLayer = bgLayerRef.current;
    const row1El = row1Ref.current;
    const row2El = row2Ref.current;
    const wrapper = imageWrapperRef.current;
    const overlay = overlayRef.current;
    if (!hero || !bgLayer || !row1El || !row2El || !wrapper || !overlay) return;

    // ════════════════════════════════════════════
    // 1. KINETIC MARQUEES — infinite GSAP tweens
    //    Row 1 drifts left, Row 2 drifts right
    // ════════════════════════════════════════════
    gsap.to(row1El, {
      xPercent: -50,
      ease: 'none',
      duration: 60,
      repeat: -1,
    });

    gsap.fromTo(
      row2El,
      { xPercent: -50 },
      { xPercent: 0, ease: 'none', duration: 70, repeat: -1 }
    );

    // ════════════════════════════════════════════
    // 2. MOUSE PARALLAX on Layer 1
    //    Gentle counter-movement for depth
    // ════════════════════════════════════════════
    const onMouseMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(bgLayer, {
        x: -cx * 15,
        y: -cy * 10,
        duration: 0.8,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', onMouseMove);

    // ════════════════════════════════════════════
    // 3. SCROLL REVEAL — GSAP ScrollTrigger
    //    pin: true | scrub: 1
    //    Clip-path inset shrinks L2 → reveals L1
    //    Dark overlay fades to 50%
    // ════════════════════════════════════════════
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
      },
    });

    // Phase A (0 → 0.65): Clip-path crops L2 into a centered rectangle
    tl.fromTo(
      wrapper,
      { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      {
        clipPath: 'inset(10% 25% 10% 25% round 16px)',
        ease: 'none',
        duration: 0.65,
      },
      0
    );

    // Dark overlay fades in over the portrait
    tl.to(
      overlay,
      { opacity: 0.5, ease: 'none', duration: 0.65 },
      0
    );

    // Scroll cue fades out quickly
    tl.to(
      '.hero-scroll-cue',
      { opacity: 0, ease: 'none', duration: 0.12 },
      0
    );

    // YOLO box fades out
    tl.to(
      '.hero-yolo',
      { opacity: 0, ease: 'none', duration: 0.25 },
      0
    );

    // Phase B (0.65 → 1.0): Fetch and animate the SVG signature
    const loadSignature = async () => {
      try {
        const res = await fetch('/file.svg');
        const svgContent = await res.text();
        const sigContainer = signatureRef.current;
        
        if (sigContainer) {
          // Inject raw SVG markup
          sigContainer.innerHTML = svgContent;
          
          // Select injected paths
          const paths = Array.from(sigContainer.querySelectorAll('path'));
          
          // Prepare paths for drawing
          paths.forEach((path) => {
            const length = path.getTotalLength();
            // Set dash array and offset to exactly the path length
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            // The rest of the styling (fill, stroke color, width) is handled by CSS
          });

          // Add drawing animation to the end of the existing timeline 
          // (">" means it starts exactly when the previous 'tl' animations end)
          tl.to(
            paths,
            {
              strokeDashoffset: 0,
              ease: 'power2.inOut',
              duration: 0.35,
              stagger: 0.1, // Slight stagger if multiple paths exist
            },
            '>'
          );
        }
      } catch (err) {
        console.error('Failed to load signature SVG:', err);
      }
    };

    loadSignature();

    // ── Cleanup ──
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf([row1El, row2El, bgLayer, wrapper, overlay]);
    };
  }, []);

  return (
    <div ref={heroRef} className="hero">

      {/* ════════════════════════════════════════
          LAYER 1 — KINETIC TYPOGRAPHY BACKGROUND
      ════════════════════════════════════════ */}
      <div ref={bgLayerRef} className="hero-L1">
        <div className="hero-L1__track">
          <span ref={row1Ref} className="hero-L1__text" aria-hidden="true">
            {row1.repeat(12)}
          </span>
        </div>
        <div className="hero-L1__track">
          <span ref={row2Ref} className="hero-L1__text" aria-hidden="true">
            {row2.repeat(10)}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          LAYER 2 — IMAGE MASK WRAPPER
          clip-path animated by GSAP
      ════════════════════════════════════════ */}
      <div ref={imageWrapperRef} className="hero-L2">
        <img
          src="/portrait_nobg3.png"
          alt="Priyanshu Upadhyay — Applied AI Engineer"
          className="hero-L2__portrait"
        />
        {/* Dark overlay — fades to 50% during scroll */}
        <div ref={overlayRef} className="hero-L2__overlay" />
      </div>

      {/* ════════════════════════════════════════
          LAYER 3 — FOREGROUND UI
      ════════════════════════════════════════ */}
      <div className="hero-L3">

        {/* Navbar */}
        <nav className="hero-nav">
          <div className="hero-nav__logo">
            <span className="hero-nav__name">Priyanshu</span>
            <span className="hero-nav__surname">Upadhyay</span>
          </div>
          <a href="/resume.pdf" download className="hero-nav__resume">
            <span>RESUME</span>
            <svg className="hero-nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </nav>

        {/* YOLO Bounding Box */}
        <div className="hero-yolo">
          <div className="hero-yolo__corner hero-yolo__corner--tl" />
          <div className="hero-yolo__corner hero-yolo__corner--tr" />
          <div className="hero-yolo__corner hero-yolo__corner--bl" />
          <div className="hero-yolo__corner hero-yolo__corner--br" />
          <div className="hero-yolo__body">
            <span className="hero-yolo__row">
              <span className="hero-yolo__key">TASK:</span>{' '}
              <span className="hero-yolo__val">Teaching machines to learn</span>
            </span>
            <span className="hero-yolo__row">
              <span className="hero-yolo__key">OUTPUT:</span>{' '}
              <span className="hero-yolo__val hero-yolo__val--neon">
                Transforming Ideas into Impact
              </span>
            </span>
          </div>
        </div>

        {/* Signature Container */}
        <div
          ref={signatureRef}
          id="signature-container"
          className="hero-signature"
        />

        {/* Scroll Cue */}
        <div className="hero-scroll-cue">
          <span className="hero-scroll-cue__text">Scroll to explore</span>
          <div className="hero-scroll-cue__line" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
