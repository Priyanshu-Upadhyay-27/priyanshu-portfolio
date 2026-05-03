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
  const portalWrapperRef = useRef<HTMLDivElement>(null);
  const textStackRef = useRef<HTMLDivElement>(null);

  // Apply AntiGravity to the whole portal wrapper
  useAntiGravity([portalWrapperRef], { rangeX: 12, rangeY: 15, rangeRot: 2 });


  // ── Typewriter Logic ──
  const roles = [
    "ML Systems Builder",
    "Python Developer",
    "GenAI Practitioner",
    "MLOps Programmer"
  ];
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
      // 1. Text Animations (Timeline for staggering)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%', // Only fires when section reaches 80% of viewport
        },
      });

      // A. Slide up the heading & badge
      tl.fromTo(
        gsap.utils.toArray('.reveal-up'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );

      // B. Sweep in the paragraph (overlapping)
      tl.fromTo(
        '.reveal-mask',
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.inOut',
        },
        "-=0.6" // overlaps with the heading slide animation
      );

      // 2. Portrait Parallax (Scroll Driven)
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

          <h2 className="about-header reveal-up">
            Hi, I'm <span className="about-name-accent">Priyanshu</span> —
          </h2>

          <h3 className="about-typewriter reveal-up">
            a <span className="accent-teal">{displayText}</span>
            <span className="typewriter-cursor">|</span>
          </h3>

          <div className="about-bio-editorial reveal-mask">
            <p>
              A 3rd-year CS undergrad at KIET focused on designing and building practical <strong>Machine Learning and GenAI systems</strong>. I don't just train models—I focus on the entire ML lifecycle, from writing robust data processing pipelines to deploying models as accessible REST APIs.
            </p>
            <p>
              Currently diving deep into the architecture of open-source ML libraries, mastering decoupled architectures using <strong>Docker</strong> and <strong>FastAPI</strong>, and building scalable systems that solve real-world problems. <strong>AWS Cloud Practitioner</strong> certified.
            </p>
          </div>
        </div>

        {/* ── RIGHT PORTAL ── */}
        <div className="about-right">
          <div className="portal-wrapper" ref={portalWrapperRef}>
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
