import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: "QnA With Jupyter",
    description: "An intelligent Retrieval-Augmented Generation (RAG) assistant directly integrated into the Jupyter ecosystem. Allows researchers and engineers to query their notebook data naturally, retrieving exact code cells, documentation context, and generated insights.",
    bullets: ["Context-aware embeddings tailored for Python code structure.", "Local LLM integration to preserve data privacy.", "Seamless Jupyter extension UI."],
    stack: ["LangChain", "OpenAI", "Python", "Jupyter API"],
    repo: "#",
    live: "#"
  },
  {
    title: "End-to-end Churn ML",
    description: "A production-grade machine learning pipeline predicting customer churn. Engineered with a full MLOps lifecycle from data ingestion to model serving.",
    bullets: ["Automated feature engineering and drift detection.", "Model registry and versioning system.", "RESTful inference API handling high traffic."],
    stack: ["scikit-learn", "FastAPI", "Docker", "Pandas"],
    repo: "#",
    live: "#"
  },
  {
    title: "2047 Visual Shop",
    description: "A futuristic computer vision retail prototype. Utilizes advanced pose estimation and object detection to power a seamless, checkout-free shopping experience mimicking physical stores.",
    bullets: ["Real-time multi-person tracking and action recognition.", "Low-latency inference optimized for edge devices.", "Responsive dashboard for inventory analytics."],
    stack: ["OpenCV", "MediaPipe", "YOLOv8", "React"],
    repo: "#",
    live: "#"
  }
];

const ProjectFeature = ({ project, index }: { project: typeof projects[0], index: number }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[70vh] items-stretch border-b border-white/5 group">
      {/* LEFT 60%: Visual Showcase */}
      <div className="w-full lg:w-[60%] bg-[#0f0f0f] relative overflow-hidden flex items-center justify-center p-8 lg:p-16 border-r border-white/5">
        <div className="absolute inset-0 bg-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Abstract stacked visual representation that expands on hover */}
        <div className="relative w-full aspect-video md:aspect-[16/10] max-w-2xl group cursor-pointer">
          {/* Back Plate */}
          <motion.div 
            className="absolute inset-0 bg-[#161616] border border-white/10 shadow-2xl rounded-sm"
            initial={{ rotate: 0, scale: 1, x: 0, y: 0 }}
            whileHover={{ rotate: -2, scale: 0.95, x: -10, y: 10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Middle Plate */}
          <motion.div 
            className="absolute inset-0 bg-[#1a1a1a] border border-white/10 shadow-xl rounded-sm backdrop-blur-sm"
            initial={{ rotate: 0, scale: 1, x: 0, y: 0 }}
            whileHover={{ rotate: 1, scale: 0.98, x: -5, y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Front Plate (Main Image Placeholder) */}
          <motion.div 
            className="absolute inset-0 bg-[#222222] border border-white/20 shadow-lg rounded-sm overflow-hidden flex items-center justify-center"
            initial={{ rotate: 0, scale: 1, x: 0, y: 0 }}
            whileHover={{ rotate: 3, scale: 1.02, x: 10, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Using abstract placeholder for high-end look until real images are provided */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#121212] via-[#1a1a1a] to-teal/10" />
            <span className="text-white/20 font-display text-2xl uppercase tracking-widest relative z-10 mix-blend-overlay">
              V-0{index + 1}
            </span>
          </motion.div>
        </div>
      </div>

      {/* RIGHT 40%: Editorial Description */}
      <div className="w-full lg:w-[40%] bg-charcoal p-8 lg:p-16 flex flex-col justify-center">
        <span className="text-teal text-sm font-semibold tracking-widest uppercase mb-4 block">Case Study {index + 1}</span>
        <h3 className="text-3xl lg:text-5xl font-display font-light text-soft-white mb-6 tracking-tight">
          {project.title}
        </h3>
        <p className="text-soft-white/70 font-sans text-lg lg:text-xl font-light leading-relaxed mb-8">
          {project.description}
        </p>
        
        <ul className="space-y-3 mb-10">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start text-soft-white/60 font-sans">
              <span className="block w-1.5 h-1.5 rounded-full bg-teal mt-2.5 mr-4 flex-shrink-0" />
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-12">
          {project.stack.map((tech, i) => (
            <span key={i} className="px-3 py-1 text-xs font-mono text-soft-white/50 bg-white/5 border border-white/10 uppercase tracking-widest">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-auto">
          <a href={project.live} className="flex items-center gap-2 text-soft-white hover:text-teal transition-colors uppercase tracking-widest text-sm font-semibold">
            <span>View Live</span>
            <ExternalLink size={16} />
          </a>
          <a href={project.repo} className="flex items-center gap-2 text-soft-white/50 hover:text-soft-white transition-colors uppercase tracking-widest text-sm font-semibold">
            <span>Source</span>
            <Github size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

const FeaturedProjects = () => {
  return (
    <section className="bg-charcoal w-full border-t border-white/5 relative z-20">
      <div className="py-24 px-8 lg:px-16 border-b border-white/5">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white inline-block">
          Index 02 <span className="text-teal ml-4">//</span> Featured Work
        </h2>
      </div>
      
      <div className="flex flex-col w-full">
        {projects.map((project, i) => (
          <ProjectFeature key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
