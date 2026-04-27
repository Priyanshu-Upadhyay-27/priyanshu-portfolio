import React from 'react';

const Footer = () => {
  return (
    <footer
      className="w-full py-10 px-6 lg:px-20 z-20 relative border-t border-white/5"
      style={{
        backgroundImage: `url('/footer_tessellation.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main Row: 3-Column CSS Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">
        {/* Left: Copyright */}
        <div className="flex justify-center md:justify-start">
          <p className="text-white/50 text-sm">© 2026 Priyanshu Upadhyay. All rights reserved.</p>
        </div>

        {/* Center: Tagline over geometric cluster */}
        <div className="flex justify-center items-center">
          <p className="text-sm text-white/30 tracking-wide">
            Machine Learning &amp; Data Systems
          </p>
        </div>

        {/* Right: Back to Top */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white/50 hover:text-teal-500 transition-colors duration-300 font-medium cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* Built With Row */}
      <div className="w-full flex justify-center mt-12 border-t border-white/5 pt-6">
        <p className="text-white/30 text-xs tracking-wider flex items-center gap-1.5 font-light">
          Engineered with 
          <span className="text-white/50 font-medium">React</span> 
          <span className="text-teal-500/50 text-[10px] mx-1">✦</span> 
          <span className="text-white/50 font-medium">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
