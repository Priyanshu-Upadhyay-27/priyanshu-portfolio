import React, { useState, useRef, useEffect } from 'react';
import { Mail, Github, Linkedin, Download, FileText } from 'lucide-react';
import gsap from 'gsap';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const formRef = useRef(null);
  const socialRef1 = useRef(null);
  const socialRef2 = useRef(null);
  const socialRef3 = useRef(null);
  const geometricRef1 = useRef(null);

  useEffect(() => {
    const elements = [formRef.current, socialRef1.current, socialRef2.current, socialRef3.current, geometricRef1.current];

    elements.forEach((el) => {
      if (el) {
        gsap.to(el, {
          y: () => gsap.utils.random(-15, 15),
          rotation: () => gsap.utils.random(-2, 2),
          duration: () => gsap.utils.random(3, 6),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: () => gsap.utils.random(0, 2)
        });
      }
    });
  }, []);

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

  return (
    <section id="contact" className="bg-charcoal py-32 px-8 lg:px-16 overflow-hidden relative">
      {/* Geometric Background Element */}
      <div 
        ref={geometricRef1} 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Contact Info & Future Space */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-12 border-b border-white/10 pb-6 inline-block w-fit">
            Index 06 <span className="text-teal ml-4">//</span> Connect
          </h2>
          
          <p className="text-soft-white/70 font-sans text-lg md:text-xl font-light leading-relaxed mb-12 max-w-lg">
            Whether you have a specific system in mind or are exploring applied AI potentials, my inbox is open.
          </p>
          
          <div className="flex flex-col gap-6 mb-16">
            <a ref={socialRef1} href="mailto:contact@priyanshu.example" className="flex items-center gap-4 text-soft-white hover:text-teal transition-colors w-fit group">
              <span className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-teal/50 transition-colors">
                <Mail size={16} />
              </span>
              <span className="font-mono text-sm uppercase tracking-widest">contact@priyanshu.example</span>
            </a>
            <div className="flex gap-4">
              <a ref={socialRef2} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
                <Github size={16} />
              </a>
              <a ref={socialRef3} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
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
        <div className="w-full lg:w-1/2 flex items-center">
          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="w-full flex flex-col gap-8 cyberpunk-form-container p-10"
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
