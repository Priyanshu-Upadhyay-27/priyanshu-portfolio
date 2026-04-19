import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
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
    if (isHovered) {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 0.1, duration: 0.8, ease: 'power2.out' });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 0.1, duration: 0.8, ease: 'power2.out' });
    } else {
      if (topTweenRef.current) gsap.to(topTweenRef.current, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
      if (botTweenRef.current) gsap.to(botTweenRef.current, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
    }
  }, [isHovered]);

  return (
    <section 
      id="tools" 
      className="w-full bg-[#111111] border-y border-white/5 py-8 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Top Ribbon — Moves Left */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap mb-4">
        <div className="marquee-scroll" ref={topMarqueeRef}>
          {doubled.map((tool, i) => (
            <a
              key={`top-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 transition-colors duration-300 hover:text-teal"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Ribbon — Moves Right */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap">
        <div className="marquee-scroll" ref={botMarqueeRef}>
          {doubled.map((tool, i) => (
            <a
              key={`bot-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 transition-colors duration-300 hover:text-[#ccff00]"
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
