import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X } from 'lucide-react';

const projects = [
  {
    title: "QnA With Jupyter",
    description: "An intelligent Retrieval-Augmented Generation (RAG) assistant directly integrated into the Jupyter ecosystem. Allows researchers and engineers to query their notebook data naturally, retrieving exact code cells, documentation context, and generated insights.",
    bullets: ["Context-aware embeddings tailored for Python code structure.", "Local LLM integration to preserve data privacy.", "Seamless Jupyter extension UI."],
    stack: ["LangChain", "OpenAI", "Python", "Jupyter API"],
    repo: "#",
    live: "#",
    images: [
      '/projects/pro_jy_1.png',
      '/projects/pro_jy_2.png',
      '/projects/pro_jy_3.png',
      '/projects/pro_jy_4.png'
    ]
  },
  {
    title: "End-to-end Churn ML",
    description: "A production-grade machine learning pipeline predicting customer churn. Engineered with a full MLOps lifecycle from data ingestion to model serving.",
    bullets: ["Automated feature engineering and drift detection.", "Model registry and versioning system.", "RESTful inference API handling high traffic."],
    stack: ["scikit-learn", "FastAPI", "Docker", "Pandas"],
    repo: "#",
    live: "#",
    images: [
      '/projects/pro_ch_1.png',
      '/projects/pro_ch_2.png',
      '/projects/pro_ch_3.png',
      '/projects/pro_ch_4.png'
    ]
  },
  {
    title: "2047 Visual Shop",
    description: "A futuristic computer vision retail prototype. Utilizes advanced pose estimation and object detection to power a seamless, checkout-free shopping experience mimicking physical stores.",
    bullets: ["Real-time multi-person tracking and action recognition.", "Low-latency inference optimized for edge devices.", "Responsive dashboard for inventory analytics."],
    stack: ["OpenCV", "MediaPipe", "YOLOv8", "React"],
    repo: "#",
    live: "#",
    images: [
      '/projects/pro_note_1.png',
      '/projects/pro_note_2.png',
      '/projects/pro_note_3.png',
      '/projects/pro_note_4.png'
    ]
  }
];

const ProjectFeature = ({ project }: { project: typeof projects[0] }) => {
  const [isSpread, setIsSpread] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = project.images || [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg'
  ];

  const getSpreadAnimation = (index: number, total: number) => {
    if (total === 3) { // Top full, bottom 50/50
      if (index === 0) return { top: "0%", left: "0%", width: "100%", height: "49%", rotate: 0 };
      if (index === 1) return { top: "51%", left: "0%", width: "49%", height: "49%", rotate: 0 };
      if (index === 2) return { top: "51%", left: "51%", width: "49%", height: "49%", rotate: 0 };
    }
    // 4 Images (2x2 Grid)
    if (index === 0) return { top: "0%", left: "0%", width: "49%", height: "49%", rotate: 0 };
    if (index === 1) return { top: "0%", left: "51%", width: "49%", height: "49%", rotate: 0 };
    if (index === 2) return { top: "51%", left: "0%", width: "49%", height: "49%", rotate: 0 };
    if (index === 3) return { top: "51%", left: "51%", width: "49%", height: "49%", rotate: 0 };

    return { top: "0%", left: "0%", width: "100%", height: "100%", rotate: 0 };
  };

  const getStackedAnimation = (index: number, total: number) => {
    return {
      top: "10%", left: "10%", width: "80%", height: "80%",
      rotate: index * 4 - (total * 2),
      zIndex: total - index
    };
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[70vh] items-stretch border-b border-white/5 group">
      {/* LEFT 60%: Visual Showcase */}
      <div
        className="w-full lg:w-[60%] bg-[#0f0f0f] relative overflow-hidden flex items-center justify-center p-4 lg:p-6 border-r border-white/5"
        onMouseEnter={() => setIsSpread(true)}
        onMouseLeave={() => setIsSpread(false)}
      >
        <div className="absolute inset-0 bg-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div
          className="relative w-full max-w-6xl aspect-square md:aspect-[4/3]"
        >
          {images.map((imgSrc, index) => (
            <motion.img
              key={index}
              src={imgSrc}
              className="absolute object-cover rounded-md shadow-2xl border border-white/10 cursor-zoom-in"
              initial={false}
              animate={isSpread
                ? getSpreadAnimation(index, images.length)
                : getStackedAnimation(index, images.length)
              }
              style={{ zIndex: isSpread ? 10 : images.length - index }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT 40%: Editorial Description */}
      <div className="w-full lg:w-[40%] bg-charcoal p-8 lg:p-16 flex flex-col justify-center">
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

      {/* ════════════════════════════════════════
          FULLSCREEN LIGHTBOX GALLERY
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Central content — stop propagation so clicks here don't close */}
            <div
              className="relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Active Image */}
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex]}
                className="max-w-[90vw] max-h-[85vh] object-contain drop-shadow-2xl rounded-lg"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
              />
            </div>

            {/* Close Button — Top Right */}
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>

            {/* Left Arrow — Center Left */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#ccff00] transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
              }}
            >
              <ChevronLeft size={36} />
            </button>

            {/* Right Arrow — Center Right */}
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#ccff00] transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
              }}
            >
              <ChevronRight size={36} />
            </button>

            {/* Image Counter — Bottom Center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono tracking-widest">
              {lightboxIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeaturedProjects = () => {
  return (
    <section id="projects" className="bg-charcoal w-full border-t border-white/5 relative z-20">
      <div className="py-24 px-8 lg:px-16 border-b border-white/5">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white inline-block">
          Index 02 <span className="text-teal ml-4">//</span> Featured Work
        </h2>
      </div>

      <div className="flex flex-col w-full">
        {projects.map((project, i) => (
          <ProjectFeature key={i} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;

