import React, { useState, useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, Download, FileText } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

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
    <section id="contact" className="relative w-full overflow-hidden bg-[#0a0a0a] border-none outline-none py-32 px-8 lg:px-16">
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
        <div className="w-full lg:w-1/2 flex flex-col relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-12 border-b border-white/10 pb-6 inline-block w-fit">
            Index 06 <span className="text-teal ml-4">//</span> Connect
          </h2>
          
          <p className="text-soft-white/70 font-sans text-lg md:text-xl font-light leading-relaxed mb-12 max-w-lg">
            Whether you have a specific system in mind or are exploring applied AI potentials, my inbox is open.
          </p>
          
          <div className="flex flex-col gap-6 mb-16">
            <a href="mailto:priyanshuupadhyay2005@gmail.com" className="flex items-center gap-4 text-soft-white hover:text-teal transition-colors w-fit group">
              <span className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-teal/50 transition-colors">
                <Mail size={16} />
              </span>
              <span className="font-mono text-sm tracking-widest lowercase">priyanshuupadhyay2005@gmail.com</span>
            </a>
            <div className="flex gap-4">
              <a href="https://github.com/Priyanshu-Upadhyay-27" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
                <Github size={16} />
              </a>
              <a href="https://www.linkedin.com/in/priyanshu-upadhyay-cse" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
            
            <div className="mt-8 flex gap-6">
              <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest text-teal font-semibold hover:text-white transition-colors">
                <FileText size={16} /> View Resume
              </a>
              <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest text-soft-white/50 hover:text-white transition-colors">
                <Download size={16} /> Download
              </a>
            </div>
          </div>

          {/* Future RAG Space */}
          <div className="mt-auto p-6 border border-dashed border-white/10 bg-white/5 max-w-sm">
            <p className="font-mono text-xs text-soft-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-teal rounded-full inline-block animate-pulse" />
              Agent Offline
            </p>
            <p className="text-sm font-light text-soft-white/60">
              [Reserved for future conversational RAG assistant. Want to know more about me? Ask my agent soon.]
            </p>
          </div>
        </div>

        {/* Right Side: Minimal Form */}
        <div className="w-full lg:w-1/2 flex items-center relative z-10 bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 p-6 rounded-lg">
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
                className="glass-input text-soft-white"
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
                className="glass-input text-soft-white"
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
                className="glass-input text-soft-white resize-none mt-2"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-6 terminal-button bg-teal text-charcoal hover:bg-white"
            >
              {isLoading ? '> TRANSMITTING...' : '> TRANSMIT'}
            </button>
            
            {isSuccess && (
              <p className="text-[#00d4ff] font-mono text-sm tracking-widest uppercase mt-4 animate-pulse">
                // Transmission Successful
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
