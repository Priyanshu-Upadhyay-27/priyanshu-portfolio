import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientDescentVisual from './GradientDescentVisual';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [triggerScrollDrop, setTriggerScrollDrop] = useState(0);

  // Scroll-Triggered Text Reveal Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      tl.fromTo(
        gsap.utils.toArray('.about-reveal'),
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Section Scroll Entry Observer: triggers 600ms heading bar draw and ball drop ONLY the first time ever
  const hasTriggeredFirstDropRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
      return;
    }

    // Guard against React strict-mode double invocation or subsequent re-entries
    if (hasTriggeredFirstDropRef.current) {
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            if (!hasTriggeredFirstDropRef.current) {
              hasTriggeredFirstDropRef.current = true;
              observer.disconnect(); // Disconnect immediately: never runs again

              // 1. Animate accent bar drawing in from left to right over 600ms (stays drawn permanently)
              if (barRef.current) {
                gsap.fromTo(
                  barRef.current,
                  { scaleX: 0 },
                  {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    transformOrigin: 'left center',
                  }
                );
              }

              // 2. Trigger automatic ball drop in GradientDescentVisual once
              setTriggerScrollDrop(1);
            }
            break;
          }
        }
      },
      { threshold: [0, 0.4] }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-container">
        {/* Full-width single-line heading with accent bar */}
        <div className="about-header-group about-reveal">
          <h2 className="about-header">
            HI, I'M PRIYANSHU
          </h2>
          <div ref={barRef} className="about-heading-bar" aria-hidden="true" />
        </div>

        {/* Two-column content grid */}
        <div className="about-content-grid">
          <div className="about-editorial-stack" ref={contentRef}>
            <div className="about-body">
              <p className="about-paragraph about-reveal">
                I'm a final-year Computer Science student at KIET, focused on building practical AI and machine learning systems. I like understanding how things work under the hood, experimenting with models, and turning ideas into systems that actually work beyond a notebook.
              </p>

              <p className="about-paragraph about-reveal">
                My current focus is Generative AI, machine learning, and the engineering around deploying and improving AI systems. I'm especially interested in the space between a model and a real product — where data, evaluation, software, and infrastructure all come together.
              </p>
            </div>
          </div>

          <div className="about-visual-column about-reveal">
            <GradientDescentVisual triggerScrollDrop={triggerScrollDrop} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
