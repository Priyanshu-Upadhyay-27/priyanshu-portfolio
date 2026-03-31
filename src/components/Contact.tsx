import React from 'react';
import { Mail, Github, Linkedin, Download, FileText } from 'lucide-react';

const Contact = () => {
  return (
    <section className="bg-charcoal py-32 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Contact Info & Future Space */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-12 border-b border-white/10 pb-6 inline-block w-fit">
            Index 05 <span className="text-teal ml-4">//</span> Connect
          </h2>
          
          <p className="text-soft-white/70 font-sans text-lg md:text-xl font-light leading-relaxed mb-12 max-w-lg">
            Whether you have a specific system in mind or are exploring applied AI potentials, my inbox is open.
          </p>
          
          <div className="flex flex-col gap-6 mb-16">
            <a href="mailto:contact@priyanshu.example" className="flex items-center gap-4 text-soft-white hover:text-teal transition-colors w-fit group">
              <span className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-teal/50 transition-colors">
                <Mail size={16} />
              </span>
              <span className="font-mono text-sm uppercase tracking-widest">contact@priyanshu.example</span>
            </a>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
                <Github size={16} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-soft-white hover:text-teal hover:border-teal/50 transition-colors">
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
          <form className="w-full flex flex-col gap-8 bg-[#111111] p-10 border border-white/5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Name</label>
              <input 
                type="text" 
                id="name" 
                className="bg-transparent border-b border-white/20 pb-2 text-soft-white focus:outline-none focus:border-teal transition-colors font-sans"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Email</label>
              <input 
                type="email" 
                id="email" 
                className="bg-transparent border-b border-white/20 pb-2 text-soft-white focus:outline-none focus:border-teal transition-colors font-sans"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs uppercase font-mono tracking-widest text-soft-white/40">Message</label>
              <textarea 
                id="message" 
                rows={4}
                className="bg-transparent border-b border-white/20 pb-2 text-soft-white focus:outline-none focus:border-teal transition-colors font-sans resize-none mt-2"
              />
            </div>

            <button type="submit" className="mt-6 font-mono text-sm uppercase tracking-widest text-charcoal bg-teal hover:bg-white transition-colors py-4 text-center font-bold">
              Transmit
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
