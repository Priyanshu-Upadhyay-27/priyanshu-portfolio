import React from 'react';
import { motion } from 'framer-motion';

const toolsList = [
  "Python", "OpenCV", "MediaPipe", "scikit-learn", "Pandas", 
  "NumPy", "Matplotlib", "Seaborn", "LangChain", "FastAPI", 
  "Docker", "Tesseract OCR", "Vosk", "PyAudio", "Google Gemini API", 
  "Anaconda", "PyCharm", "Jupyter Notebook", "Git", "GitHub"
];

const Tools = () => {
  // Split list to make two distinct ribbons
  const topRibbon = [...toolsList].sort(() => Math.random() - 0.5);
  const bottomRibbon = [...toolsList].sort(() => Math.random() - 0.5);

  return (
    <section className="bg-near-black py-24 border-b border-white/5 overflow-hidden flex flex-col justify-center">
      <div className="relative w-full mb-12 flex flex-col gap-6">
        
        {/* Top Ribbon - Moves Left */}
        <div className="w-full overflow-hidden flex relative whitespace-nowrap group">
          <motion.div 
            className="flex gap-16 px-8 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {/* Double the list to create seamless loop */}
            {[...topRibbon, ...topRibbon].map((tool, i) => (
              <span 
                key={i} 
                className="font-display text-4xl md:text-6xl lg:text-8xl font-black text-transparent group-hover:text-soft-white/10 transition-colors duration-500 uppercase"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
              >
                {tool}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom Ribbon - Moves Right */}
        <div className="w-full overflow-hidden flex relative whitespace-nowrap group">
          <motion.div 
            className="flex gap-16 px-8 items-center"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          >
            {[...bottomRibbon, ...bottomRibbon].map((tool, i) => (
              <span 
                key={i} 
                className="font-display text-4xl md:text-6xl lg:text-8xl font-black text-transparent hover:text-teal group-hover:text-teal/40 transition-colors duration-300 uppercase"
                style={{ WebkitTextStroke: "1px rgba(0,128,128,0.5)" }}
              >
                {tool}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Tools;
