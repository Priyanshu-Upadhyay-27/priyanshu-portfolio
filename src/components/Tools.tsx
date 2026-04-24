import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useAntiGravity } from '../hooks/useAntiGravity';
import './Tools.css';

const toolsList = [
  { name: "Git & GitHub", url: "https://github.com/" },
  { name: "Jupyter Ecosystem", url: "https://jupyter.org/" },
  { name: "VS Code", url: "https://code.visualstudio.com/" },
  { name: "PyCharm", url: "https://www.jetbrains.com/pycharm/" },
  { name: "Anaconda", url: "https://www.anaconda.com/" },
  { name: "React & GSAP", url: "https://react.dev/" },
];

const Tools = () => {
  const doubled = [...toolsList, ...toolsList];
  const ghostColors = ['204, 255, 0', '0, 240, 255', '0, 255, 102'];

  const [isHovered, setIsHovered] = useState(false);
  const topMarqueeRef = useRef<HTMLDivElement>(null);
  const botMarqueeRef = useRef<HTMLDivElement>(null);
  const topTweenRef = useRef<gsap.core.Tween | null>(null);
  const botTweenRef = useRef<gsap.core.Tween | null>(null);

  // Background icon refs
  const iconRef1 = useRef<HTMLImageElement>(null);
  const iconRef2 = useRef<HTMLImageElement>(null);
  const iconRef3 = useRef<HTMLImageElement>(null);
  const iconRef4 = useRef<HTMLImageElement>(null);
  const iconRef5 = useRef<HTMLImageElement>(null);
  const iconRef6 = useRef<HTMLImageElement>(null);

  // Initialize Anti-Gravity for background symbols
  useAntiGravity([iconRef1, iconRef2, iconRef3, iconRef4, iconRef5, iconRef6], {
    rangeX: 30,
    rangeY: 40,
    rangeRot: 15,
    isPaused: false, // Keep background drifting independently
  });

  useEffect(() => {
    if (topMarqueeRef.current) {
      gsap.set(topMarqueeRef.current, { xPercent: 0 });
      topTweenRef.current = gsap.to(topMarqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 15, // Fast linear moving speed
        ease: 'none',
        force3D: true,
      });
    }

    if (botMarqueeRef.current) {
      gsap.set(botMarqueeRef.current, { xPercent: -50 });
      botTweenRef.current = gsap.to(botMarqueeRef.current, {
        xPercent: 0,
        repeat: -1,
        duration: 15, // Must match top for same speed
        ease: 'none',
        force3D: true,
      });
    }

    return () => {
      topTweenRef.current?.kill();
      botTweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    // Adding overwrite: "auto" prevents any conflicting timeScale tweens and glitching on fast hover
    if (isHovered) {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 0.15, duration: 1.5, ease: 'power3.out', overwrite: "auto" });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 0.15, duration: 1.5, ease: 'power3.out', overwrite: "auto" });
    } else {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 1, duration: 1.2, ease: 'power2.inOut', overwrite: "auto" });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 1, duration: 1.2, ease: 'power2.inOut', overwrite: "auto" });
    }
  }, [isHovered]);

  return (
    <section
      id="tools"
      className="group w-full bg-[#111111] py-8 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Floating Symbol Layer */}
      <div
        className="pointer-events-none overflow-hidden"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      >
        <img ref={iconRef1} src="https://cdn.simpleicons.org/python/00f0ff" alt="Python" className="bg-icon bg-icon-1 absolute w-24 h-24 md:w-32 md:h-32 blur-[4px]" style={{ left: '8%', top: '25%' }} />
        <img ref={iconRef2} src="https://cdn.simpleicons.org/langchain/00f0ff" alt="LangChain" className="bg-icon bg-icon-2 absolute w-28 h-28 md:w-48 md:h-48 blur-[4px]" style={{ left: '25%', top: '65%' }} />
        <img ref={iconRef3} src="https://cdn.simpleicons.org/pytorch/00f0ff" alt="PyTorch" className="bg-icon bg-icon-3 absolute w-24 h-24 md:w-40 md:h-40 blur-[4px]" style={{ left: '42%', top: '15%' }} />
        <img ref={iconRef4} src="https://cdn.simpleicons.org/github/00f0ff" alt="GitHub" className="bg-icon bg-icon-4 absolute w-20 h-20 md:w-36 md:h-36 blur-[4px]" style={{ left: '58%', top: '70%' }} />
        <img ref={iconRef5} src="https://cdn.simpleicons.org/docker/00f0ff" alt="Docker" className="bg-icon bg-icon-5 absolute w-32 h-32 md:w-56 md:h-56 blur-[4px]" style={{ left: '75%', top: '25%' }} />
        <img ref={iconRef6} src="https://cdn.simpleicons.org/react/00f0ff" alt="React" className="bg-icon bg-icon-6 absolute w-24 h-24 md:w-40 md:h-40 blur-[4px]" style={{ left: '90%', top: '60%' }} />
      </div>

      {/* Top Ribbon — Moves Left */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap mb-4 relative z-10">
        <div className="marquee-scroll will-change-transform" ref={topMarqueeRef} style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
          {doubled.map((tool, i) => (
            <a
              key={`top-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item"
              style={{ '--brand-color': ghostColors[i % 3] } as React.CSSProperties}
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Ribbon — Moves Right */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap relative z-10">
        <div className="marquee-scroll will-change-transform" ref={botMarqueeRef} style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
          {doubled.map((tool, i) => (
            <a
              key={`bot-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item"
              style={{ '--brand-color': ghostColors[i % 3] } as React.CSSProperties}
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Tools;
