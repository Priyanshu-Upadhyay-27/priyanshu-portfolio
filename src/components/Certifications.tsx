import React from 'react';
import { ExternalLink } from 'lucide-react';

const certifications = [
  {
    title: "AWS Certified AI Practitioner",
    issuer: "AWS",
    date: "Feb 2026",
    link: "https://www.credly.com/badges/1b73972c-60d6-41b8-9c54-8f6e43b3bf9d/public_url"
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "AWS",
    date: "Feb 2026",
    link: "https://www.credly.com/badges/cb8509d7-8020-4afa-be8a-6639038f294c/public_url"
  },
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

const Certifications = () => {
  return (
    <section className="w-full bg-[#0a0a0a] py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-8 border-b border-white/10 pb-6 inline-block">
          Index 05 <span className="text-teal ml-4">//</span> Credentials & Certifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
          {certifications.map((cert, i) => (
            <div 
              key={i} 
              className="bg-[#111111] border border-white/5 p-8 hover:border-teal/30 transition-colors duration-300 flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <span className="text-teal font-mono text-xs tracking-widest uppercase mb-2 block">{cert.issuer}</span>
                <h3 className="text-soft-white font-sans font-bold text-xl md:text-2xl leading-snug mb-4">{cert.title}</h3>
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
