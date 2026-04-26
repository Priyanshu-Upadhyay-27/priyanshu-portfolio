import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Download, FileText, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // GSAP Refs
  const sectionRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Canvas Ref for Vector Space Background
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll-Triggered HUD Entry Animation
  useEffect(() => {
    if (!sectionRef.current || !leftColumnRef.current || !formRef.current) return;

    // Initial states
    gsap.set(leftColumnRef.current.children, { opacity: 0, y: 40 });
    gsap.set(formRef.current, { opacity: 0, x: 50, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.to(leftColumnRef.current.children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" })
      .to(formRef.current, { x: 0, y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, []);

  // Canvas Background Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const dots: { x: number, y: number, vx: number, vy: number }[] = [];
    for (let i = 0; i < 100; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const parentSection = canvas.parentElement;
    parentSection?.addEventListener('mousemove', handleMouseMove);

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    parentSection?.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update dots
      ctx.fillStyle = 'rgba(20, 184, 166, 0.4)'; // Faint teal dots

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Check distance to mouse
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < 150) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.x, mouse.y);
          const opacity = 1 - (distToMouse / 150);
          ctx.strokeStyle = `rgba(20, 184, 166, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Check distance to other dots to form a web
        for (let j = i + 1; j < dots.length; j++) {
          const otherDot = dots[j];
          const ddx = otherDot.x - dot.x;
          const ddy = otherDot.y - dot.y;
          const distToDot = Math.sqrt(ddx * ddx + ddy * ddy);

          if (distToDot < 80) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            const opacity = 1 - (distToDot / 80);
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      parentSection?.removeEventListener('mousemove', handleMouseMove);
      parentSection?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative w-full overflow-hidden bg-[#0a0a0a] border-none outline-none py-32 px-8 lg:px-16">
      {/* Step 2: Inject Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0 bg-transparent outline-none border-none"
      />

      {/* Geometric Background Element (original) */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      {/* Step 1: Ensure main content container has relative and z-10 */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">

        {/* Left Side: Contact Info & Future Space */}
        <div ref={leftColumnRef} className="w-full lg:w-1/2 flex flex-col relative z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-6xl md:text-7xl lg:text-9xl font-bold text-[#f4f4f5] uppercase tracking-tighter leading-[0.8]">
              Let's<br />Talk.
            </h2>
            <p className="text-zinc-400 text-lg max-w-md font-light mt-8 leading-relaxed font-sans">
              I'm always open to discussing new opportunities, machine learning architectures, or scalable data systems. My inbox is open.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-md mt-12">
            {/* Email Link */}
            <a href="mailto:priyanshuupadhyay2005@gmail.com" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-teal-500 group-hover:bg-teal-500/10 transition-all text-zinc-300 group-hover:text-teal-400">
                <Mail size={24} />
              </div>
              <span className="text-zinc-300 group-hover:text-teal-400 font-sans text-base md:text-lg transition-all tracking-wide">
                priyanshuupadhyay2005@gmail.com
              </span>
            </a>

            {/* Github Link */}
            <a href="https://github.com/Priyanshu-Upadhyay-27" target="_blank" rel="noreferrer" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-teal-500 group-hover:bg-teal-500/10 transition-all text-zinc-300 group-hover:text-teal-400">
                <Github size={24} />
              </div>
              <span className="text-zinc-300 group-hover:text-teal-400 font-sans text-base md:text-lg transition-all tracking-wide">
                Github
              </span>
            </a>

            {/* LinkedIn Link */}
            <a href="https://linkedin.com/in/priyanshu-upadhyay-cse" target="_blank" rel="noreferrer" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-teal-500 group-hover:bg-teal-500/10 transition-all text-zinc-300 group-hover:text-teal-400">
                <Linkedin size={24} />
              </div>
              <span className="text-zinc-300 group-hover:text-teal-400 font-sans text-base md:text-lg transition-all tracking-wide">
                LinkedIn
              </span>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 w-fit group">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 text-zinc-300 group-hover:border-teal-500 group-hover:bg-teal-500/10 group-hover:text-teal-400 transition-all">
                <MapPin size={24} />
              </div>
              <span className="text-zinc-300 font-sans text-base md:text-lg group-hover:text-teal-400 transition-all tracking-wide">
                Delhi NCR, India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-16 pt-4 border-t border-white/10 w-full max-w-sm">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-300 hover:text-teal-500 transition-colors flex items-center gap-2">
              VIEW RESUME ↗
            </a>
            <a href="/resume.pdf" download className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2">
              DOWNLOAD ↓
            </a>
          </div>

        </div>

        {/* Right Side: Minimal Form */}
        <div ref={formRef} className="w-full lg:w-1/2 flex items-center relative z-10 bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 p-6 rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-8 cyberpunk-form-container p-4 lg:p-10 relative z-20"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input text-soft-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all duration-300"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input text-soft-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all duration-300"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Message</label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input text-soft-white resize-none mt-2 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 terminal-button bg-teal text-charcoal hover:bg-white"
            >
              {isLoading ? 'SENDING...' : 'SEND MESSAGE ↗'}
            </button>

            {isSuccess && (
              <p className="text-teal-500 font-mono text-sm tracking-widest uppercase mt-4 animate-pulse">
                [✓] CONNECTION ESTABLISHED. Thank you for reaching out, I will be in touch shortly.
              </p>
            )}
            {isError && (
              <p className="text-red-500 font-mono text-sm tracking-widest uppercase mt-4 animate-pulse">
                // Transmission Failed. Check Network Context.
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
