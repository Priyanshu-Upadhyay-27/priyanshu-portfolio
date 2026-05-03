import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const PreloaderContext = createContext(false);
import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import ArchiveLink from './components/ArchiveLink';
import Archive from './components/Archive';
import Skills from './components/Skills';
import Tools from './components/Tools';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <FeaturedProjects />
      <ArchiveLink />
      <Skills />
      <Tools />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
};

function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  // Disable browser scroll restoration on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Refresh ScrollTrigger when preloader unmounts so GSAP recalculates layout
  useEffect(() => {
    if (preloaderComplete) {
      // Dynamic import to avoid pulling ScrollTrigger into the App bundle if not needed
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }
  }, [preloaderComplete]);

  return (
    <Router>
      {/* Preloader manages its own unmount via internal isVisible state.
          We keep it mounted so its fade-out animation can complete. */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />
      <ScrollToTop />
      
      {/* App is rendered from the start (so .logo-p is in the DOM for getBoundingClientRect),
          but hidden with opacity + pointer-events until the Preloader fires onComplete */}
      <div style={{ 
        opacity: preloaderComplete ? 1 : 0, 
        pointerEvents: preloaderComplete ? 'auto' : 'none'
      }}>
        <PreloaderContext.Provider value={preloaderComplete}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </PreloaderContext.Provider>
      </div>
    </Router>
  );
}

export default App;
