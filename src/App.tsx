import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProjects from './components/FeaturedProjects';
import Skills from './components/Skills';
import Tools from './components/Tools';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <div>
      <CustomCursor />
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
      <Tools />
      <Certifications />
      <Contact />
      <Footer />
      <Header />
    </div>
  );
}

export default App;
