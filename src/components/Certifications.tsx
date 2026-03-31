import React from 'react';
import { ExternalLink } from 'lucide-react';

const certifications = [
  { name: "DeepLearning.AI: Deep Learning Specialization", issuer: "Coursera", date: "2024" },
  { name: "Machine Learning with Python", issuer: "IBM", date: "2023" },
  { name: "Computer Vision and Image Processing", issuer: "Udacity", date: "2024" },
  { name: "Cloud Deployment Basics (AWS)", issuer: "AWS Training", date: "2023" },
];

const Certifications = () => {
  return (
    <section className="bg-charcoal py-24 px-8 lg:px-16 border-b border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-16 inline-block">
          Index 04 <span className="text-teal ml-4">//</span> Certifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-10">
          {certifications.map((cert, i) => (
            <div key={i} className="group p-6 border border-white/5 bg-[#121212] hover:bg-[#161616] transition-colors cursor-pointer flex flex-col justify-between min-h-[140px]">
              <div>
                <p className="text-teal font-mono text-xs uppercase tracking-widest mb-3">{cert.date}</p>
                <h3 className="font-sans text-lg font-medium text-soft-white/90 leading-snug">{cert.name}</h3>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-soft-white/40 text-sm tracking-wide">{cert.issuer}</span>
                <ExternalLink size={14} className="text-soft-white/20 group-hover:text-teal transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
