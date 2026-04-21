import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </Router>
  );
}

export default App;
