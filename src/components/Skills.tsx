import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const skillClusters = [
  {
    domain: "Applied AI & RAG",
    skills: ["Vector DBs (Pinecone, Chroma)", "LangChain / LlamaIndex", "Prompt Engineering", "Semantic Search", "OpenAI / Open-source LLMs"]
  },
  {
    domain: "Machine Learning",
    skills: ["scikit-learn", "XGBoost", "Deep Learning Foundations", "Time-series Analysis", "Predictive Modeling"]
  },
  {
    domain: "Computer Vision",
    skills: ["OpenCV", "MediaPipe", "YOLO Architecture", "Image Segmentation", "OCR (Tesseract)"]
  },
  {
    domain: "Deployment & APIs",
    skills: ["FastAPI / Flask", "Docker Containerization", "RESTful Architecture", "Cloud Deployment", "Model Serving"]
  },
  {
    domain: "Engineering Foundations",
    skills: ["Python (Advanced)", "Data Structures", "Git / CI-CD", "SQL / NoSQL", "Code Optimization"]
  }
];

const FlipCard = ({ cluster, index }: { cluster: typeof skillClusters[0], index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full aspect-square md:aspect-[4/3] group cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div 
          className="absolute inset-0 backface-hidden bg-[#161616] border border-white/5 p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-teal font-mono text-sm">0{index + 1}</span>
          <h3 className="font-display text-2xl md:text-3xl font-light text-soft-white">
            {cluster.domain}
          </h3>
          <div className="w-full h-[1px] bg-white/10 group-hover:bg-teal transition-colors duration-500" />
        </div>

        {/* BACK */}
        <div 
          className="absolute inset-0 backface-hidden bg-teal border border-teal flex flex-col justify-center p-8"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h4 className="font-sans text-charcoal font-bold uppercase tracking-widest text-xs mb-6 border-b border-charcoal/20 pb-4">
            {cluster.domain} Toolkit
          </h4>
          <ul className="space-y-3">
            {cluster.skills.map((skill, i) => (
              <li key={i} className="text-charcoal font-medium font-sans text-sm md:text-base flex items-center">
                <span className="w-1.5 h-1.5 bg-charcoal rounded-full mr-3 opacity-50 block" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="bg-charcoal py-32 px-8 lg:px-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-20 border-b border-white/10 pb-6 inline-block">
          Index 03 <span className="text-teal ml-4">//</span> Domains of Expertise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillClusters.map((cluster, i) => (
            <FlipCard key={i} cluster={cluster} index={i} />
          ))}
          
          {/* Filler card specifically for the grid layout to look architectural */}
          <div className="hidden lg:flex relative w-full aspect-square md:aspect-[4/3] bg-transparent border border-dashed border-white/10 items-center justify-center">
            <span className="text-white/20 font-mono text-xs uppercase tracking-widest text-center px-8">
              Continuous Learning<br/>& Exploration
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
