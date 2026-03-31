import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5 py-12 px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center z-50 relative">
      <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
        <span className="font-display text-xl text-soft-white tracking-widest uppercase">Priyanshu Upadhyay</span>
        <span className="font-mono text-xs text-soft-white/40 tracking-widest mt-2 uppercase">Applied AI Engineer</span>
      </div>
      
      <div className="flex gap-8 items-center">
        <a href="#" className="text-xs font-mono uppercase tracking-widest text-soft-white/40 hover:text-teal transition-colors">GitHub</a>
        <a href="#" className="text-xs font-mono uppercase tracking-widest text-soft-white/40 hover:text-teal transition-colors">LinkedIn</a>
        <a href="mailto:contact@priyanshu.example" className="text-xs font-mono uppercase tracking-widest text-soft-white/40 hover:text-teal transition-colors">Email</a>
      </div>
    </footer>
  );
};

export default Footer;
