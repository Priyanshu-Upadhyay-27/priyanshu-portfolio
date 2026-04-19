import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useAntiGravity } from '../hooks/useAntiGravity';
import './Tools.css';

const toolsList = [
  { name: "Python", url: "https://docs.python.org/3/" },
  { name: "OpenCV", url: "https://docs.opencv.org/" },
  { name: "MediaPipe", url: "https://ai.google.dev/edge/mediapipe/solutions/guide" },
  { name: "scikit-learn", url: "https://scikit-learn.org/stable/" },
  { name: "Pandas", url: "https://pandas.pydata.org/docs/" },
  { name: "NumPy", url: "https://numpy.org/doc/" },
  { name: "LangChain", url: "https://docs.langchain.com/" },
  { name: "FastAPI", url: "https://fastapi.tiangolo.com/" },
  { name: "Docker", url: "https://docs.docker.com/" },
  { name: "Tesseract OCR", url: "https://tesseract-ocr.github.io/" },
  { name: "Google Gemini API", url: "https://ai.google.dev/gemini-api/docs" },
  { name: "Jupyter Notebook", url: "https://jupyter.org/documentation" },
  { name: "Git", url: "https://git-scm.com/doc" },
  { name: "GitHub", url: "https://docs.github.com/" },
  { name: "PyTorch", url: "https://pytorch.org/docs/" },
  { name: "Matplotlib", url: "https://matplotlib.org/stable/contents.html" },
];

const Tools = () => {
  const doubled = [...toolsList, ...toolsList];

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
        duration: 25, // noticeable, medium-fast pace
        ease: 'none',
      });
    }

    if (botMarqueeRef.current) {
      gsap.set(botMarqueeRef.current, { xPercent: -50 });
      botTweenRef.current = gsap.to(botMarqueeRef.current, {
        xPercent: 0,
        repeat: -1,
        duration: 25, // noticeable, medium-fast pace
        ease: 'none',
      });
    }

    return () => {
      topTweenRef.current?.kill();
      botTweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    // "Heavy machine braking" feel -> use power3.out and longer duration
    if (isHovered) {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 0.15, duration: 1.5, ease: 'power3.out' });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 0.15, duration: 1.5, ease: 'power3.out' });
    } else {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 1, duration: 1.2, ease: 'power2.inOut' });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 1, duration: 1.2, ease: 'power2.inOut' });
    }
  }, [isHovered]);

  return (
    <section
      id="tools"
      className="group w-full bg-[#111111] border-y border-white/5 py-8 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Floating Symbol Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full flex items-center justify-center">
        <img ref={iconRef1} src="https://cdn.simpleicons.org/python/white" alt="Python" className="absolute top-[5%] left-[5%] w-24 h-24 md:w-40 md:h-40 opacity-[0.05] blur-[4px]" />
        <img ref={iconRef2} src="https://cdn.simpleicons.org/pytorch/white" alt="PyTorch" className="absolute top-[60%] left-[15%] w-32 h-32 md:w-56 md:h-56 opacity-[0.05] blur-[4px]" />
        <img ref={iconRef3} src="https://cdn.simpleicons.org/opencv/white" alt="OpenCV" className="absolute top-[10%] right-[10%] w-28 h-28 md:w-48 md:h-48 opacity-[0.05] blur-[4px]" />
        <img ref={iconRef4} src="https://cdn.simpleicons.org/pandas/white" alt="Pandas" className="absolute top-[70%] right-[20%] w-20 h-20 md:w-36 md:h-36 opacity-[0.05] blur-[4px]" />
        <img ref={iconRef5} src="https://cdn.simpleicons.org/fastapi/white" alt="FastAPI" className="absolute top-[35%] left-[45%] w-36 h-36 md:w-64 md:h-64 opacity-[0.05] blur-[4px]" />
        <img ref={iconRef6} src="https://cdn.simpleicons.org/docker/white" alt="Docker" className="absolute bottom-[5%] right-[45%] w-24 h-24 md:w-40 md:h-40 opacity-[0.05] blur-[4px]" />
      </div>

      {/* Top Ribbon — Moves Left */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap mb-4 relative z-10">
        <div className="marquee-scroll" ref={topMarqueeRef}>
          {doubled.map((tool, i) => (
            <a
              key={`top-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 blur-[2px] transition-all duration-[800ms] group-hover:blur-0 hover:text-teal hover:drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Ribbon — Moves Right */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap relative z-10">
        <div className="marquee-scroll" ref={botMarqueeRef}>
          {doubled.map((tool, i) => (
            <a
              key={`bot-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 blur-[2px] transition-all duration-[800ms] group-hover:blur-0 hover:text-[#ccff00] hover:drop-shadow-[0_0_15px_rgba(204,255,0,0.8)]"
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
