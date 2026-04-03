import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAntiGravity } from '../hooks/useAntiGravity';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portalImageBaseRef = useRef<HTMLImageElement>(null);
  const portalImageHeadRef = useRef<HTMLImageElement>(null);
  const textStackRef = useRef<HTMLDivElement>(null);

  // Floats the anchored figure organically left/right and rotates
  // rangeY is set to 0 to guarantee the absolute bottom anchoring is NEVER violated by the float
  useAntiGravity([portalImageBaseRef, portalImageHeadRef], {
    rangeX: 8,
    rangeY: 0,
    rangeRot: 1.5
  });

  // ── Typewriter Logic ──
  const roles = ["RAG Engineer", "AI Architect", "GSOC '26 Scholar", "ML Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentRole) {
      typingSpeed = 2000; // Wait at end of string
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(prev => 
        isDeleting 
        ? currentRole.substring(0, prev.length - 1)
        : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // ── GSAP Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Stack Entrance (x: -50)
      gsap.from(textStackRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // 2. Portrait Parallax
      gsap.fromTo([portalImageBaseRef.current, portalImageHeadRef.current], 
        { scale: 1 },
        {
          scale: 1.15,
          transformOrigin: 'bottom center',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-container">
        {/* ── LEFT TEXT STACK ── */}
        <div className="about-left" ref={textStackRef}>
          <p className="about-label">— ABOUT ME</p>
          
          <h2 className="about-header">
            Hi, I'm <span className="about-name-accent">Priyanshu</span> —
          </h2>

          <h3 className="about-typewriter">
            a <span className="accent-teal">{displayText}</span>
            <span className="typewriter-cursor">|</span>
          </h3>

          <div className="about-bio-editorial">
            <p>
              A 3rd-year CS undergrad at KIET obsessed with building at the intersection of machine learning and real-world products. From training <strong>YOLO models</strong> to deploying <strong>RAG pipelines</strong>, I turn complex ideas into working systems.
            </p>
            <p>
              Currently preparing for <strong>GSOC 2026</strong> with <strong>scikit-learn</strong>, exploring <strong>LangGraph</strong> & <strong>AI agents</strong>, and building production-grade projects. <strong>AWS Cloud Practitioner</strong> certified.
            </p>
          </div>
        </div>

        {/* ── RIGHT PORTAL ── */}
        <div className="about-right">
          <div className="portal-wrapper">
            {/* Layer 1: Base inside hidden overflow */}
            <div className="portal-circle">
              <img 
                ref={portalImageBaseRef}
                src="/head_out_portrait.png" 
                alt="Priyanshu Upadhyay Portrait Base" 
                className="portal-image-base" 
              />
            </div>
            {/* Layer 2: Head breaking out (visible overflow, clipped) */}
            <div className="portal-overflow">
              <img 
                ref={portalImageHeadRef}
                src="/head_out_portrait.png" 
                alt="Priyanshu Upadhyay Portrait Head" 
                className="portal-image-head" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
