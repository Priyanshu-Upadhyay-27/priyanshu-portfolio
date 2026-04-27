import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric' 
  }).toUpperCase();

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <footer className="w-full bg-transparent py-10 px-6 lg:px-20 z-20 relative border-t border-white/10">
      {/* Main Row: 3-Column CSS Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">
        {/* Left: Copyright */}
        <div className="flex justify-center md:justify-start">
          <p className="text-white/50 text-sm">© 2026 Priyanshu Upadhyay. All rights reserved.</p>
        </div>

        {/* Center: Pulsing Node + Sign-off */}
        <div className="flex flex-col justify-center items-center">
          {/* The Pulsing Node Graphic */}
          <svg className="w-8 h-8 text-white/20 hover:text-teal-500/60 transition-colors duration-500 animate-pulse mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          
          {/* The Sign-off Message */}
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-light">
            Thank you for visiting
          </p>
        </div>

        {/* Right: Live Clock */}
        <div className="flex justify-center md:justify-end items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <p className="text-white/50 text-sm tracking-wide">
            {formattedDate} · {formattedTime}
          </p>
        </div>
      </div>

      {/* Built With Row */}
      <div className="w-full mt-8 flex justify-center">
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
