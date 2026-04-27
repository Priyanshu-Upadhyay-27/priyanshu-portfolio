import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const skillClusters = [
  {
    domain: "Machine Learning & Data",
    image: "/skills/ml.jpeg",
    skills: ["Python(OOPs)", "Scikit-Learn & XGBoost", "Pandas, NumPy & Matplotlib", "Feature Engineering", "Evaluation Metrics"]
  },
  {
    domain: "MLOps & Deployment",
    image: "/skills/deploy.png",
    skills: ["FastAPI & REST APIs", "Docker Containerization", "AWS Cloud Infrastructure", "End-to-End Pipelines", "Streamlit UI & Model Drift"]
  },
  {
    domain: "Generative AI",
    image: "/skills/llm_rag.png",
    skills: ["LangChain & RAG Architectures", "Ollama", "Vector Databases", "LLM API Integration", "Prompt Engineering"]
  },
  {
    domain: "Deep Learning & Vision",
    image: "/skills/cv.png",
    skills: ["OpenCV", "Image Processing", "YOLO Object Detection", "MediaPipe", "CNNs & Perceptrons"]
  }
];

const FlipCard = ({ cluster, index }: { cluster: typeof skillClusters[0], index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timerRef.current = setTimeout(() => setIsFlipped(false), 1500);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full min-h-[350px] lg:min-h-[400px] cursor-pointer group"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 bg-[#161616] border border-white/5 p-8 flex flex-col justify-between overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Dynamic Glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(20, 184, 166, 0.15), transparent 80%)`,
            }}
          />

          {/* Subtle image texture */}
          <img
            src={cluster.image}
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            alt=""
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div />
            <h3 className="font-display text-2xl md:text-3xl font-light text-soft-white">
              {cluster.domain}
            </h3>
            <div className="w-full h-[1px] bg-white/10 group-hover:bg-teal transition-colors duration-500" />
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 bg-[#0d0d0d] border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)] flex flex-col justify-center p-8 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Dynamic Glow for BACK */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at calc(100% - var(--mouse-x)) var(--mouse-y), rgba(20, 184, 166, 0.15), transparent 80%)`,
            }}
          />

          <h4 className="text-teal font-sans font-black uppercase tracking-[0.15em] text-sm mb-4 border-b border-teal/20 pb-2 relative z-10">
            {cluster.domain} Toolkit
          </h4>
          <ul className="space-y-3 relative z-10">
            {cluster.skills.map((skill, i) => (
              <li
                key={i}
                className="text-white/80 font-mono text-sm md:text-base leading-relaxed flex items-center gap-3 hover:text-white hover:translate-x-1 transition-all duration-300 cursor-default"
              >
                <span className="text-[#ccff00] text-lg">▹</span>
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
    <section id="skills" className="bg-charcoal py-32 px-8 lg:px-16 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-light text-soft-white mb-20 border-b border-white/10 pb-6 inline-block">
          Skills and Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {skillClusters.map((cluster, i) => (
            <FlipCard key={i} cluster={cluster} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
