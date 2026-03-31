import React from 'react';

const About = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-charcoal min-h-[50vh] flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="font-display text-4xl md:text-5xl font-light mb-12 text-soft-white border-b border-white/10 pb-6 inline-block">
          Index 01 // About
        </h2>
        <div className="space-y-8 font-sans text-lg md:text-xl text-soft-white/70 font-light leading-relaxed max-w-3xl">
          <p>
            I am a BTech Computer Science student engineering the bridge between complex machine learning paradigms and usable, high-impact applications. 
          </p>
          <p>
            My work heavily focuses on applied Artificial Intelligence, architecting robust Retrieval-Augmented Generation (RAG) systems, and designing end-to-end Computer Vision pipelines. I thrive not just on model accuracy, but on seamless deployment and delivering premium ML experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
