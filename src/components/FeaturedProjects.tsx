import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { useAntiGravity } from '../hooks/useAntiGravity';

const projects = [
  {
    title: "End-to-End Churn & MLOps Pipeline",
    description: "A production-grade machine learning system designed to predict telecom customer churn, optimized for business decision-making (Recall@20). Built with a decoupled architecture featuring a FastAPI inference engine and a Streamlit UI.",
    bullets: [
      "Engineered a custom scikit-learn pipeline with Pydantic validation to handle real-world edge cases like the 'Zero Tenure Trap'.",
      "Containerized with Docker and exposed via a RESTful API for seamless, high-traffic serving.",
      "Implemented continuous monitoring to simulate concept drift, triggering automated challenger model retraining."
    ],
    stack: ["FastAPI", "Docker", "scikit-learn", "Streamlit"],
    repo: "https://github.com/Priyanshu-Upadhyay-27/end-to-end-churn-ml",
    live: "https://priyanshu-retention-intelligence.streamlit.app/",
    images: [
      '/projects/pro_ch_1.png',
      '/projects/pro_ch_2.png',
      '/projects/pro_ch_3.png',
      '/projects/pro_ch_4.png'
    ]
  },
  {
    title: "Context-Aware RAG for Jupyter",
    description: "An intelligent Retrieval-Augmented Generation system that understands deep dependencies across Jupyter Notebook cells, rather than treating them as disjointed chunks. Reconstructs multi-cell context for highly accurate code retrieval.",
    bullets: [
      "Implemented AST-based parsing to map metadata-linked document structures and execution flows.",
      "Achieved ~85% retrieval accuracy with sub-2 second latency locally by enabling dependency-aware context reconstruction.",
      "Integrated local LLMs to maintain strict data privacy while processing complex Python repositories."
    ],
    stack: ["LangChain", "Python", "Local LLMs", "AST"],
    repo: "https://github.com/Priyanshu-Upadhyay-27/QnA_With_Jupyter",
    live: "",
    images: [
      '/projects/pro_jy_1.png',
      '/projects/pro_jy_2.png',
      '/projects/pro_jy_3.png',
      '/projects/pro_jy_4.png'
    ]
  },
  {
    title: "Loan Risk Modeling System",
    description: "A hybrid machine learning system combining unsupervised and supervised learning to predict loan default risks. Processed and analyzed a massive 2.2 million record dataset to build a robust risk classification engine.",
    bullets: [
      "Designed a two-stage architecture leveraging KMeans for customer segmentation and XGBoost for classification.",
      "Processed large-scale tabular data, ensuring robust feature engineering and pipeline efficiency.",
      "Integrated SHAP values for model explainability, providing transparent risk assessments via an interactive dashboard."
    ],
    stack: ["XGBoost", "KMeans", "SHAP", "Pandas"],
    repo: "https://github.com/Priyanshu-Upadhyay-27/LoanClassinator",
    live: "https://loanclassinator-classifier-cluster.streamlit.app/",
    images: [
      '/projects/pro_loan_1.png',
      '/projects/pro_loan_2.png',
      '/projects/pro_loan_3.png',
      '/projects/pro_loan_4.png'
    ]
  }
];

const ProjectFeature = ({ project }: { project: typeof projects[0] }) => {
  const [isSpread, setIsSpread] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const stackParentRef = useRef<HTMLDivElement>(null);

  // Apply AntiGravity to the whole image stack parent. Pause when dispersed (isSpread)
  useAntiGravity([stackParentRef], { 
    rangeX: 12, 
    rangeY: 12, 
    rangeRot: 1.5, 
    isPaused: isSpread 
  });

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
          ref={stackParentRef}
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
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-soft-white hover:text-teal transition-colors uppercase tracking-widest text-sm font-semibold">
              <span>{project.live.includes('youtube.com') || project.live.includes('youtu.be') ? 'Watch Demo' : 'View Live'}</span>
              {project.live.includes('youtube.com') || project.live.includes('youtu.be') ? <Play size={16} /> : <ExternalLink size={16} />}
            </a>
          )}
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-soft-white/50 hover:text-soft-white transition-colors uppercase tracking-widest text-sm font-semibold">
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

