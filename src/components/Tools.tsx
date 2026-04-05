import './Tools.css';

const toolsList = [
  { name: "Python", url: "https://docs.python.org/3/" },
  { name: "OpenCV", url: "https://docs.opencv.org/" },
  { name: "MediaPipe", url: "https://ai.google.dev/edge/mediapipe/solutions/guide" },
  { name: "scikit-learn", url: "https://scikit-learn.org/stable/" },
  { name: "Pandas", url: "https://pandas.pydata.org/docs/" },
  { name: "NumPy", url: "https://numpy.org/doc/" },
  { name: "LangChain", url: "https://docs.langchain.com/" },
  { name: "FastAPI", url: "https://fastapi.tiangolo.com/" },
  { name: "Docker", url: "https://docs.docker.com/" },
  { name: "Tesseract OCR", url: "https://tesseract-ocr.github.io/" },
  { name: "Google Gemini API", url: "https://ai.google.dev/gemini-api/docs" },
  { name: "Jupyter Notebook", url: "https://jupyter.org/documentation" },
  { name: "Git", url: "https://git-scm.com/doc" },
  { name: "GitHub", url: "https://docs.github.com/" },
  { name: "PyTorch", url: "https://pytorch.org/docs/" },
  { name: "Matplotlib", url: "https://matplotlib.org/stable/contents.html" },
];

const Tools = () => {
  const doubled = [...toolsList, ...toolsList];

  return (
    <section id="tools" className="w-full bg-[#111111] border-y border-white/5 py-8 overflow-hidden relative">

      {/* Top Ribbon — Moves Left */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap mb-4">
        <div className="marquee-scroll marquee-left">
          {doubled.map((tool, i) => (
            <a
              key={`top-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 transition-colors duration-300 hover:text-teal"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Ribbon — Moves Right */}
      <div className="marquee-track w-full overflow-hidden whitespace-nowrap">
        <div className="marquee-scroll marquee-right">
          {doubled.map((tool, i) => (
            <a
              key={`bot-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item text-white/40 transition-colors duration-300 hover:text-[#ccff00]"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Tools;
