import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NeuralHUD from './NeuralHUD';
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
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const topoRef = useRef<SVGSVGElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);

  // Kinetic text strings
  const row1 = 'BUILD-TRAIN-DEPLOY ⸻ ';
  const row2 = 'APPLIED AI . END-TO-END MACHINE LEARNING . ';

  // Python Terminal Ticker & Nav State
  const [tickerText, setTickerText] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Ticker Typing Effect
  useEffect(() => {
    const strings = [
      'importing about',
      'importing projects',
      'importing skills',
      'importing tools',
      'importing contact',
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const fullString = strings[currentIndex];

      if (isDeleting) {
        currentText = fullString.substring(0, currentText.length - 1);
        typingSpeed = 40;
      } else {
        currentText = fullString.substring(0, currentText.length + 1);
        typingSpeed = 80;
      }

      setTickerText(currentText);

      if (!isDeleting && currentText === fullString) {
        typingSpeed = 3000; // Pause loudly for reading
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % strings.length;
        typingSpeed = 500; // Pause before launching the next string
      }

      timeout = setTimeout(type, typingSpeed);
    };

    // Begin standard loop delay
    timeout = setTimeout(type, 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const bgLayer = bgLayerRef.current;
    const row1El = row1Ref.current;
    const row2El = row2Ref.current;
    const wrapper = imageWrapperRef.current;
    const overlay = overlayRef.current;
    const portrait = portraitRef.current;
    if (!hero || !bgLayer || !row1El || !row2El || !wrapper || !overlay || !portrait) return;

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
    // 1b. TOPOGRAPHIC CONTOUR DRIFT
    //     Each SVG path gets its own slow, randomized
    //     drift tween so they float independently.
    //     The SVG lives inside bgLayer, so it also
    //     inherits the parent's mouse-parallax for free.
    // ════════════════════════════════════════════
    const topoEl = topoRef.current;
    const topoDrifts: gsap.core.Tween[] = [];
    if (topoEl) {
      const topoPaths = topoEl.querySelectorAll('.hero-topo__path');
      topoPaths.forEach((path) => {
        const drift = gsap.to(path, {
          x: (Math.random() - 0.5) * 60,   // −30 to +30
          y: (Math.random() - 0.5) * 60,   // −30 to +30
          duration: 15 + Math.random() * 10, // 15–25s
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 5,          // stagger starts
        });
        topoDrifts.push(drift);
      });
    }

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

    // Phase A (0 → 0.65): Clip-path crops L2 into a 5:3 centered rectangle
    //   Visible height = 60vh  →  top/bottom = 20vh
    //   Visible width  = 100vh →  left/right = calc(50vw − 50vh)
    //   Ratio: 100vh ÷ 60vh = 5 : 3  ✓
    tl.fromTo(
      wrapper,
      { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      {
        clipPath: 'inset(20vh calc(50vw - 50vh) 20vh calc(50vw - 50vh) round 16px)',
        ease: 'none',
        duration: 0.65,
      },
      0
    );

    // Inner portrait scales down and shifts down for a cinematic zoom-out
    tl.fromTo(
      portrait,
      { scale: 1.05, y: '0%', xPercent: -50 },
      { scale: 1, y: '2%', xPercent: -50, ease: 'none', duration: 0.65 },
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

    // Neural HUD fades out
    tl.to(
      '.neural-hud-container',
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

          // First, snap the entire container's opacity from 0 (CSS) to 1 exactly when drawing starts
          // so initial neon connection dot artifacts remain invisible at the top of the page.
          tl.set(signatureRef.current, { opacity: 1 }, 0.65);

          // Phase B — Draw the signature paths
          //   Starts at 0.65 = exactly when Phase A clip-path completes.
          //   Paths draw sequentially with 0.15s stagger.
          tl.to(
            paths,
            {
              strokeDashoffset: 0,
              ease: 'power2.inOut',
              duration: 0.35,
              stagger: 0.15,
            },
            0.65
          );

          // Phase C — Fill the signature after drawing completes
          //   ">" = immediately after the previous tween (Phase B) ends.
          tl.to(
            paths,
            {
              fill: '#ccff00',
              ease: 'power1.inOut',
              duration: 0.15,
              stagger: 0.08,
            },
            '>'
          );
        }
      } catch (err) {
        console.error('Failed to load signature SVG:', err);
      }
    };
    loadSignature();

    // ════════════════════════════════════════════
    // 3.5 SIGNATURE PARALLAX
    //    Dedicated ScrollTrigger for the signature container
    //    so it drifts upward faster than the background layers,
    //    creating extreme deep parallax.
    // ════════════════════════════════════════════
    // Explicitly set the base CSS transform coordinates via GSAP
    // to prevent the matrix from overwriting horizontal centering.
    // Shifted x to -65 to organically balance the visual weight of the asymmetrical signature.
    gsap.set(signatureRef.current, { xPercent: -65, yPercent: -50 });

    gsap.to(signatureRef.current, {
      yPercent: -85,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
      },
    });

    // ════════════════════════════════════════════
    // 4. ANTI-GRAVITY FLOAT — Continuous zero-gravity drift
    //    Each element orbits through random absolute waypoints
    //    using sine easing for silky, organic motion.
    //    Parallax offsets are layered on top via a separate
    //    tween target so the two systems never conflict.
    // ════════════════════════════════════════════
    interface FloatEntry {
      el: HTMLElement;
      parallaxFactor: number;
      // Current parallax offset (lerped toward target)
      px: number;
      py: number;
      // Target parallax offset (set by mouse)
      tx: number;
      ty: number;
    }

    const floatingElements: FloatEntry[] = [];
    const floatTimelines: gsap.core.Timeline[] = [];

    /**
     * Creates an infinitely looping float orbit for `el`.
     *
     * Instead of relative `+=` (which accumulates), we generate
     * absolute waypoints within the drift range and chain them
     * in a repeating timeline.  `yoyo: true` reverses the whole
     * sequence so the element always returns to origin, yielding
     * a smooth figure-eight-ish loop.
     */
    const createFloat = (
      el: HTMLElement | null,
      config: {
        driftX?: number;
        driftY?: number;
        rotation?: number;
        durationBase?: number;
        parallaxFactor?: number;
      }
    ) => {
      if (!el) return;

      const {
        driftX = 8,
        driftY = 12,
        rotation = 1.5,
        durationBase = 4,
        parallaxFactor = 1,
      } = config;

      // Register this element for parallax
      floatingElements.push({ el, parallaxFactor, px: 0, py: 0, tx: 0, ty: 0 });

      // Build 5 random *absolute* waypoints inside the drift envelope
      const WAYPOINT_COUNT = 5;
      const waypoints = Array.from({ length: WAYPOINT_COUNT }, () => ({
        x: (Math.random() - 0.5) * 2 * driftX,
        y: (Math.random() - 0.5) * 2 * driftY,
        rot: (Math.random() - 0.5) * 2 * rotation,
        dur: durationBase + Math.random() * 3,
      }));

      const ftl = gsap.timeline({ repeat: -1, yoyo: true });

      waypoints.forEach((wp) => {
        ftl.to(el, {
          x: wp.x,
          y: wp.y,
          rotation: wp.rot,
          duration: wp.dur,
          ease: 'sine.inOut',
        });
      });

      // Offset each element's start so they don't sync up
      ftl.progress(Math.random());

      floatTimelines.push(ftl);
    };

    // ── Assign float orbits ──

    // Scroll cue — gentle, mostly vertical bob
    createFloat(scrollCueRef.current, {
      driftX: 4,
      driftY: 10,
      rotation: 0.8,
      durationBase: 6,
      parallaxFactor: 1.0,
    });

    // Navbar — very subtle, barely perceptible drift
    createFloat(navRef.current, {
      driftX: 3,
      driftY: 4,
      rotation: 0.3,
      durationBase: 7,
      parallaxFactor: 0.5,
    });

    // ════════════════════════════════════════════
    // 5. MOUSE PARALLAX on L3 floating elements
    //    We store a *target* offset per element on every
    //    mousemove, then a gsap.ticker callback lerps the
    //    actual CSS translate toward that target each frame.
    //    This keeps the parallax silky-smooth and completely
    //    decoupled from the float timeline.
    // ════════════════════════════════════════════
    const PARALLAX_STRENGTH_X = 18;  // max px shift at screen edge
    const PARALLAX_STRENGTH_Y = 12;
    const PARALLAX_LERP = 0.06;      // lower = more inertia

    const onMouseMoveL3 = (e: MouseEvent) => {
      // Normalise cursor to -1 … +1
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;

      floatingElements.forEach((entry) => {
        // Set target; the ticker will ease toward it
        entry.tx = -cx * PARALLAX_STRENGTH_X * entry.parallaxFactor;
        entry.ty = -cy * PARALLAX_STRENGTH_Y * entry.parallaxFactor;
      });
    };
    window.addEventListener('mousemove', onMouseMoveL3);

    // Frame-by-frame lerp applied via GSAP ticker for 60 fps
    const tickerCallback = () => {
      floatingElements.forEach((entry) => {
        entry.px += (entry.tx - entry.px) * PARALLAX_LERP;
        entry.py += (entry.ty - entry.py) * PARALLAX_LERP;

        // Layer the parallax offset *on top* of whatever the
        // float timeline is doing by reading its current transform
        // and adding our offset to the element's inline style.
        // We use CSS custom properties so they don't clash with
        // GSAP's transform writes.
        entry.el.style.setProperty('--px', `${entry.px}px`);
        entry.el.style.setProperty('--py', `${entry.py}px`);
      });
    };
    gsap.ticker.add(tickerCallback);

    // ── Cleanup ──
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onMouseMoveL3);
      gsap.ticker.remove(tickerCallback);
      floatTimelines.forEach((ftl) => ftl.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (topoDrifts.length) topoDrifts.forEach((t) => t.kill());
      gsap.killTweensOf([row1El, row2El, bgLayer, wrapper, overlay]);
      floatingElements.forEach(({ el }) => gsap.killTweensOf(el));
    };
  }, []);

  return (
    <div ref={heroRef} className="hero">

      {/* ════════════════════════════════════════
          LAYER 1 — KINETIC TYPOGRAPHY BACKGROUND
      ════════════════════════════════════════ */}
      <div ref={bgLayerRef} className="hero-L1">

        {/* Topographic contour lines — large freeform paths behind text */}
        <svg
          ref={topoRef}
          className="hero-topo"
          viewBox="0 0 1920 1080"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Contour 1 — sweeping arc across upper-left quadrant */}
          <path
            className="hero-topo__path"
            d="M-80 320 C180 280, 420 140, 680 200 C940 260, 1060 420, 1340 380 C1620 340, 1800 180, 2020 240"
          />
          {/* Contour 2 — deep curve through the center */}
          <path
            className="hero-topo__path"
            d="M-40 580 C200 520, 380 680, 620 640 C860 600, 1020 440, 1280 500 C1540 560, 1720 720, 1980 660"
          />
          {/* Contour 3 — gentle wave across lower third */}
          <path
            className="hero-topo__path"
            d="M-60 820 C160 780, 340 900, 560 860 C780 820, 960 700, 1200 760 C1440 820, 1640 940, 2000 880"
          />
          {/* Contour 4 — tight elevation line near top */}
          <path
            className="hero-topo__path"
            d="M-100 140 C120 100, 360 220, 540 160 C720 100, 900 40, 1140 120 C1380 200, 1560 80, 2040 160"
          />
          {/* Contour 5 — fluid dynamics curve spanning full width */}
          <path
            className="hero-topo__path"
            d="M-40 960 C220 920, 480 1020, 740 980 C1000 940, 1180 840, 1460 900 C1740 960, 1860 1060, 2040 1000"
          />
        </svg>

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
          ref={portraitRef}
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
        <nav ref={navRef} className="hero-nav">
          <div className="hero-nav__logo">
            <span className="hero-nav__name">Priyanshu</span>
            <span className="hero-nav__surname">Upadhyay</span>
          </div>
          <div className="hero-nav__right">
            
            {/* ── Bifurcating Resume Button ── */}
            <div className="hero-nav__resume-wrapper">
                <div className="resume-btn-front">
                  <span>RESUME</span>
                </div>
                <div className="resume-btn-back">
                  <a href="/resume.pdf" download className="resume-icon-link" aria-label="Download Resume" title="Download">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                  <div className="resume-icon-divider"/>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-icon-link" aria-label="Preview Resume" title="Preview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </a>
                </div>
            </div>

            {/* ── Navbar Dropdown Group ── */}
            <div className="hero-nav__dropdown-wrapper">
              <button 
                className="hero-nav__ticker-btn" 
                onClick={() => setIsNavOpen(!isNavOpen)}
                aria-expanded={isNavOpen}
              >
                <div className="ticker-btn-content">
                  <span aria-hidden="true">&gt;&gt;&gt; {tickerText}</span>
                  <span className="hero-terminal-cursor">_</span>
                </div>
              </button>

              <div className={`hero-nav__dropdown ${isNavOpen ? 'is-open' : ''}`}>
                <ul className="hero-nav__dropdown-list">
                  <li><a href="#about" onClick={() => setIsNavOpen(false)}><span className="nav-index">01</span> About</a></li>
                  <li><a href="#projects" onClick={() => setIsNavOpen(false)}><span className="nav-index">02</span> Projects</a></li>
                  <li><a href="#skills" onClick={() => setIsNavOpen(false)}><span className="nav-index">03</span> Skills</a></li>
                  <li><a href="#tools" onClick={() => setIsNavOpen(false)}><span className="nav-index">04</span> Tools</a></li>
                  <li><a href="#contact" onClick={() => setIsNavOpen(false)}><span className="nav-index">05</span> Contact</a></li>
                </ul>
              </div>
            </div>

          </div>
        </nav>

        {/* ════════════════════════════════════════
            Neural HUD Graphic (Bottom Left)
        ════════════════════════════════════════ */}
        <NeuralHUD />

        {/* Signature Container */}
        <div
          ref={signatureRef}
          id="signature-container"
          className="hero-signature"
        />

        {/* Scroll Cue */}
        <div ref={scrollCueRef} className="hero-scroll-cue">
          <span className="hero-scroll-cue__text">Scroll to explore</span>
          <div className="hero-scroll-cue__line" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
