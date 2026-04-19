import React, { useRef, useState, MouseEvent } from 'react';
import { ExternalLink, Terminal } from 'lucide-react';
import './Certifications.css';

const featuredBadges = [
  {
    title: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services",
    date: "Feb 2026",
    link: "https://www.credly.com/badges/1b73972c-60d6-41b8-9c54-8f6e43b3bf9d/public_url",
    imagePlaceholder: "AWS_AI_Practitioner"
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Feb 2026",
    link: "https://www.credly.com/badges/cb8509d7-8020-4afa-be8a-6639038f294c/public_url",
    imagePlaceholder: "AWS_Cloud_Practitioner"
  }
];

const standardCerts = [
  {
    title: "Linear Algebra for Machine Learning and Data Science",
    issuer: "DeepLearning.AI / Coursera",
    date: "Feb 2025",
    link: "https://coursera.org/share/1b8324dae6f1c7c229c44687a73500d9"
  },
  {
    title: "Data Analytics Essentials",
    issuer: "Cisco Networking Academy",
    date: "Nov 2025",
    link: "#"
  },
  {
    title: "Programming Fundamentals using Python - Part 1",
    issuer: "Infosys Springboard",
    date: "Nov 2024",
    link: "https://verify.onwingspan.com"
  }
];

const HolographicCard = ({ badge }: { badge: typeof featuredBadges[0] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isResetting, setIsResetting] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    setIsResetting(false);

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate cursor position relative to the card's center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotation calculation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Glare position calculation (percentage)
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setIsResetting(true);
    setRotation({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <div 
      className="holo-card-container w-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className={`holo-card w-full h-full bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden p-8 flex flex-col justify-between ${isResetting ? 'resetting' : ''}`}
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        {/* Dynamic Glare Layer */}
        <div 
          className="holo-glare" 
          style={{ 
            '--glare-x': `${glare.x}%`, 
            '--glare-y': `${glare.y}%` 
          } as React.CSSProperties} 
        />

        {/* 3D Pushed Content */}
        <div className="holo-layer-content relative z-20 flex flex-col h-full pointer-events-none">
          
          {/* AWS Badge Display */}
          <div className="w-full aspect-[3/2] flex items-center justify-center bg-black/40 border border-white/5 rounded-lg mb-8 relative p-6">
             <img src={`/badges/${badge.imagePlaceholder}.png`} alt={badge.title} className="absolute inset-0 w-full h-full object-contain p-6 drop-shadow-[0_0_25px_rgba(0,212,255,0.15)]" />
          </div>

          <div className="mt-auto pointer-events-auto">
            <span className="text-[#00d4ff] font-mono text-xs tracking-widest uppercase mb-2 block">
              {badge.issuer}
            </span>
            <h3 className="text-soft-white font-sans font-bold text-xl md:text-2xl leading-snug mb-4">
              {badge.title}
            </h3>
            
            <div className="flex items-center justify-between w-full mt-6">
               <p className="text-white/40 font-mono text-sm">{badge.date}</p>
               <a 
                 href={badge.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-white/60 font-mono text-sm uppercase tracking-wider hover:text-[#ccff00] transition-colors duration-300 flex items-center gap-2"
               >
                 Verify <ExternalLink size={14} />
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Certifications = () => {
  return (
    <section id="certifications" className="w-full bg-[#0a0a0a] py-32 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-4">
              Index 05 <span className="text-[#00d4ff] ml-4">//</span> Credentials
            </h2>
            <p className="text-white/40 font-mono text-sm md:text-base max-w-lg">
              Official validations of cloud engineering capabilities and machine learning competencies.
            </p>
          </div>
        </div>

        {/* Level 1: Featured Holographic Badges */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {featuredBadges.map((badge, i) => (
              <HolographicCard key={i} badge={badge} />
            ))}
          </div>
        </div>

        {/* Level 2: Standard Certs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {standardCerts.map((cert, i) => (
            <div 
              key={i} 
              className="bg-[#111111] border border-white/5 p-8 relative overflow-hidden transition-all duration-500 hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] hover:-translate-y-1 hover:bg-[#151515] flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <span className="text-[#00d4ff] font-mono text-xs tracking-widest uppercase mb-2 block">{cert.issuer}</span>
                <h3 className="text-soft-white font-sans font-bold text-xl leading-snug mb-4">{cert.title}</h3>
                <p className="text-white/40 font-mono text-sm mb-6">{cert.date}</p>
              </div>
              
              <a 
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 font-mono text-sm uppercase tracking-wider hover:text-[#ccff00] transition-colors duration-300 flex items-center gap-2 mt-auto"
              >
                Verify Credential <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
