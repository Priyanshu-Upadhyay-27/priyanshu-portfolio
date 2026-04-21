import React, { useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const archiveProjects = [
  { year: "2026", title: "End-to-End Churn ML Pipeline", category: "MLOps", tech: ["FastAPI", "Docker", "scikit-learn", "Streamlit"], repo: "https://github.com/Priyanshu-Upadhyay-27/end-to-end-churn-ml", live: "https://priyanshu-retention-intelligence.streamlit.app/" },
  { year: "2025", title: "Context-Aware Jupyter RAG", category: "GenAI", tech: ["LangChain", "Local LLMs", "AST", "Python"], repo: "https://github.com/Priyanshu-Upadhyay-27/QnA_With_Jupyter", live: "" },
  { year: "2025", title: "Loan Risk Modeling System", category: "Machine Learning", tech: ["XGBoost", "KMeans", "SHAP", "Pandas"], repo: "https://github.com/Priyanshu-Upadhyay-27/LoanClassinator", live: "https://loanclassinator-classifier-cluster.streamlit.app/" },
  { year: "2024", title: "Vision Board (Retail CV)", category: "Computer Vision", tech: ["YOLOv8", "MediaPipe", "React"], repo: "https://github.com/Priyanshu-Upadhyay-27/2047-Visual-Shop/tree/new_updates", live: "https://www.youtube.com/watch?v=U_d6wnP3iDM" },
  { year: "2024", title: "AI Virtual Mouse", category: "Computer Vision", tech: ["OpenCV", "MediaPipe", "Python"], repo: "https://github.com/Priyanshu-Upadhyay-27/2047-Visual-Shop", live: "" },
  { year: "2024", title: "Marine Oil Spill Classification", category: "Machine Learning", tech: ["scikit-learn", "EDA", "Python"], repo: "https://github.com/Priyanshu-Upadhyay-27/Oil-Spill-Classification", live: "" },
  { year: "2024", title: "Content-Based Movie Recommender", category: "Machine Learning", tech: ["Cosine Similarity", "Streamlit", "Pandas"], repo: "https://github.com/Priyanshu-Upadhyay-27/Recommender-System", live: "" },
  { year: "2024", title: "WebMiner Toolkit", category: "Data Engineering", tech: ["BeautifulSoup", "Selenium", "Python"], repo: "https://github.com/Priyanshu-Upadhyay-27/WebMiner", live: "" },
  { year: "2026", title: "Priyanshu Portfolio v1", category: "Frontend Web", tech: ["React", "TypeScript", "GSAP", "Tailwind"], repo: "https://github.com/Priyanshu-Upadhyay-27/priyanshu-portfolio", live: "" },
  { year: "2023", title: "Academic Full-Stack Prototype", category: "Web Development", tech: ["HTML", "CSS", "JavaScript"], repo: "https://github.com/Priyanshu-Upadhyay-27/Web-Dev-", live: "" }
];

const Archive = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-[#0a0a0a] min-h-screen py-32 px-8 lg:px-16 text-[#f4f4f5]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#f4f4f5]/50 hover:text-[#ccff00] transition-colors font-mono text-sm tracking-widest uppercase"
          >
            <span>← Back to Main Portfolio</span>
          </Link>
        </div>
        <header className="mb-20">
          <h1 className="text-4xl md:text-5xl font-display font-light tracking-tight mb-4 text-[#f4f4f5]">
            Project Archive
          </h1>
          <p className="text-[#f4f4f5]/60 font-sans text-lg">
            A comprehensive index of things I've built, deployed, or experimented with.
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#f4f4f5]/50 text-xs tracking-widest uppercase font-mono">
                <th className="py-4 pr-4 font-normal">Year</th>
                <th className="py-4 pr-4 font-normal">Project</th>
                <th className="py-4 pr-4 font-normal hidden md:table-cell">Category</th>
                <th className="py-4 pr-4 font-normal hidden lg:table-cell">Built With</th>
                <th className="py-4 font-normal text-right">Link</th>
              </tr>
            </thead>
            <tbody>
              {archiveProjects.map((project, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-6 pr-4 text-[#f4f4f5]/50 font-mono text-sm">{project.year}</td>
                  <td className="py-6 pr-4 font-semibold text-[#f4f4f5] group-hover:text-[#ccff00] transition-colors">
                    {project.title}
                  </td>
                  <td className="py-6 pr-4 text-[#f4f4f5]/60 text-sm hidden md:table-cell">{project.category}</td>
                  <td className="py-6 pr-4 text-[#f4f4f5]/40 font-mono text-xs hidden lg:table-cell">
                    {project.tech.join(" · ")}
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-4">
                      {project.repo && (
                        <a href={project.repo} target="_blank" rel="noreferrer" className="text-[#f4f4f5]/50 hover:text-white transition-colors">
                          <Github size={20} />
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer" className="text-[#f4f4f5]/50 hover:text-white transition-colors">
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Archive;
