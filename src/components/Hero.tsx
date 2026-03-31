import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Generates an infinitely scrolling, seamless loop of random bezier waves
const CurvedLinesBackground = () => (
  <motion.div
    className="absolute inset-[0] w-[200vw] h-full pointer-events-none text-gray-400 z-10"
    animate={{ x: ["0%", "-50%"] }}
    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
  >
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 2000 1000">
      {/* Expanded to 10 lines with drastically reduced opacity for a hyper-subtle, dense mesh */}
      <path d="M0,200 C300,400 600,0 1000,200 C1400,400 1700,0 2000,200" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.08" />
      <path d="M0,400 C400,200 800,600 1000,400 C1200,200 1600,600 2000,400" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.06" />
      <path d="M0,600 C200,800 500,400 1000,600 C1500,800 1800,400 2000,600" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.10" />
      <path d="M0,800 C400,1000 600,600 1000,800 C1400,1000 1600,600 2000,800" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" />
      <path d="M0,300 C500,100 700,500 1000,300 C1300,100 1500,500 2000,300" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.09" />
      <path d="M0,100 C400,300 600,-100 1000,100 C1400,300 1600,-100 2000,100" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.07" />
      <path d="M0,500 C250,700 750,300 1000,500 C1250,700 1750,300 2000,500" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.08" />
      <path d="M0,700 C350,900 650,500 1000,700 C1350,900 1650,500 2000,700" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.06" />
      <path d="M0,900 C450,1100 550,700 1000,900 C1450,1100 1550,700 2000,900" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.04" />
      <path d="M0,250 C350,50 650,450 1000,250 C1350,50 1650,450 2000,250" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.11" />
    </svg>
  </motion.div>
);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scrollScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.65]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const scrollY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-10%"]);

  // Matches the box color exactly, deleting any visible boundaries on the landing page!
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.35],
    ["#ffffff", "#121212"]
  );

  // Animate the shadow dynamically so it doesn't give away the border on landing
  const boxRevealShadow = useTransform(
    scrollYProgress,
    [0, 0.35],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 20px 60px rgba(0,0,0,0.5)"]
  );

  const sigClipProgress = useTransform(scrollYProgress, [0.4, 0.65], [100, 0]);
  const sigClipPath = useTransform(sigClipProgress, (val) => `inset(0 ${val}% 0 0)`);
  const sigOpacity = useTransform(scrollYProgress, [0.65, 0.85], [1, 0.2]);
  const sigY = useTransform(scrollYProgress, [0.4, 0.9], ["25%", "-15%"]);

  const textOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.7, 0.95], [60, 0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <motion.section
      ref={containerRef}
      className="relative h-[250vh] w-full"
      style={{ backgroundColor }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center">

        {/* Layer 0: The explicitly requested White Landscape Box (Z-0) */}
        <motion.div
          className="absolute w-[95vw] md:w-[85vw] lg:w-[80vw] max-w-7xl aspect-[4/3] md:aspect-video bg-white z-0 rounded-xl mt-10 origin-center"
          style={{ scale: scrollScale, opacity: scrollOpacity, y: scrollY, boxShadow: boxRevealShadow }}
        />

        {/* Layer 1: The Wavy Flowing Lines (Z-10) -> Automatically renders over the White Box but across the full screen */}
        <motion.div style={{ scale: scrollScale, opacity: scrollOpacity, y: scrollY }} className="absolute inset-[0] z-10 origin-center pointer-events-none">
          <CurvedLinesBackground />
        </motion.div>

        {/* Layer 2: True Independent PNG Portrait (Z-20) -> Rendered OVER both the Box and the Lines! */}
        <motion.div
          className="absolute inset-[0] z-20 flex items-end justify-center pointer-events-none origin-bottom"
          style={{ scale: scrollScale, opacity: scrollOpacity, y: scrollY }}
        >
          {/* Note: Using the new true transparent file allows us to render natively without any glitchy blend modes! */}
          <img
            src="/portrait_nobg2.png"
            onError={(e) => { (e.target as HTMLImageElement).src = '/portrait_nobg2.png'; }}
            alt="Priyanshu Upadhyay"
            className="w-auto h-[85vh] object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.15)]"
          />
        </motion.div>

        {/* Phase 2: Massive Signature */}
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6"
          style={{ opacity: sigOpacity, y: sigY }}
        >
          <motion.img
            src="/file.svg"
            alt="Signature"
            className="w-full max-w-3xl md:max-w-5xl lg:max-w-7xl h-auto -translate-x-[5%] md:-translate-x-[10%]"
            style={{ clipPath: sigClipPath }}
          />
        </motion.div>

        {/* Phase 3: Identity Reveal */}
        <motion.div
          className="absolute inset-x-0 inset-y-0 z-40 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-light tracking-tight text-white mb-6 drop-shadow-2xl mix-blend-difference">
            Priyanshu Upadhyay
          </h1>
          <h2 className="font-sans text-2xl md:text-3xl text-teal uppercase tracking-[0.2em] mb-8 font-semibold drop-shadow-md">
            Applied AI Engineer
          </h2>
          <p className="font-sans text-xl md:text-2xl text-soft-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-xl text-balance">
            Building RAG systems, computer vision workflows, and deployable ML experiences.
          </p>
        </motion.div>

        {/* Initial Scroll indicator prompts the user */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center mix-blend-difference"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-white/60 text-xs tracking-widest uppercase mb-2">Scroll to Experience</span>
          <div className="w-[1px] h-12 bg-white/30 overflow-hidden">
            <motion.div
              className="w-full h-1/2 bg-teal"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Hero;
