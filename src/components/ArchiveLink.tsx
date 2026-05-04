import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './ArchiveLink.css';

const archiveImages = [
  '/projects/pro_jy_1.png',
  '/projects/arch_1.png',
  '/projects/pro_note_1.png',
  '/projects/arch_2.png',
  '/projects/pro_ch_1.png',
  '/projects/arch_3.png',
  '/projects/pro_jy_2.png',
  '/projects/pro_ch_2.png',
  '/projects/pro_note_2.png',
];

const ArchiveLink: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Initialize the infinitely scrolling stream
  useEffect(() => {
    if (marqueeRef.current) {
      gsap.set(marqueeRef.current, { xPercent: 0 });
      tweenRef.current = gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        // Increased speed based on request (about 30-50% faster than 35s)
        duration: 20,
        ease: 'none',
      });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  // Handle interaction state
  useEffect(() => {
    if (isHovered) {
      if (tweenRef.current) {
        gsap.to(tweenRef.current, { timeScale: 0.2, duration: 0.8, ease: 'power2.out' });
      }
      // Bring thumbnails into crystal clear focus (stream ignores hover and keeps moving)
      gsap.to('.archive-stream-img', { 
        opacity: 1, 
        filter: 'blur(0px)', 
        duration: 0.6, 
        stagger: 0.05,
        ease: 'power3.out' 
      });
    } else {
      if (tweenRef.current) {
        gsap.to(tweenRef.current, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
      }
      // Return thumbnails to heavy blur and low opacity
      gsap.to('.archive-stream-img', { 
        opacity: 0.3, 
        filter: 'blur(13.5px)', 
        duration: 0.6, 
        ease: 'power2.in' 
      });
    }
  }, [isHovered]);

  return (
    <section id="archive-link" className="bg-[#121212] w-full min-h-[60vh] relative overflow-hidden flex items-center justify-center border-t border-white/5">
      
      {/* ── Background Stream Layer ── */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-screen pointer-events-none z-0 overflow-hidden">
        <div className="flex w-max" ref={marqueeRef}>
           {/* Render the array twice to create a seamless infinite loop */}
           {[...archiveImages, ...archiveImages].map((src, i) => (
             <div key={i} className="px-3 md:px-6">
               <img 
                 src={src}
                 alt="Project Snapshot"
                 className="archive-stream-img w-56 md:w-80 lg:w-96 aspect-video object-cover rounded-md border border-white/10 shadow-2xl"
                 style={{ opacity: 0.3, filter: 'blur(13.5px)' }}
               />
             </div>
           ))}
        </div>
      </div>

      {/* ── Interactable Central Button ── */}
      <div className="relative z-20">
        <a 
          href="/archive" 
          className="archive-btn group flex items-center gap-4 md:gap-6 text-decoration-none px-6 py-4 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-cursor-hover="true"
        >
          <span className="archive-btn-bracket text-white/20 font-mono text-[clamp(2rem,5vw,5rem)] font-light transition-all duration-300">
            [
          </span>
          <span className="archive-btn-text text-white font-mono text-[clamp(1.2rem,3vw,3.5rem)] tracking-[0.2em] font-bold transition-all duration-300">
            ACCESS_FULL_ARCHIVE
          </span>
          <span className="archive-btn-bracket text-white/20 font-mono text-[clamp(2rem,5vw,5rem)] font-light transition-all duration-300">
            ]
          </span>
        </a>
      </div>
    </section>
  );
};

export default ArchiveLink;
