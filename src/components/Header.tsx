import React, { useState, useEffect } from 'react';
import { useSmartNav } from '../hooks/useSmartNav';
import './Header.css';

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [tickerText, setTickerText] = useState('');

  // ── Smart Nav — fully decoupled from Hero's ScrollTrigger ──
  const { isHidden, isPastHero } = useSmartNav('#about');

  // ── Ticker Typing Effect ──
  useEffect(() => {
    const strings = [
      'importing about',
      'importing projects',
      'importing skills',
      'importing tools',
      'importing contact',
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const fullString = strings[currentIndex];

      if (isDeleting) {
        currentText = fullString.substring(0, currentText.length - 1);
        typingSpeed = 40;
      } else {
        currentText = fullString.substring(0, currentText.length + 1);
        typingSpeed = 80;
      }

      setTickerText(currentText);

      if (!isDeleting && currentText === fullString) {
        typingSpeed = 3000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % strings.length;
        typingSpeed = 500;
      }

      timeout = setTimeout(type, typingSpeed);
    };

    timeout = setTimeout(type, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Build class list
  const classes = [
    'site-header',
    isPastHero ? 'is-scrolled' : '',
    isHidden ? 'is-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-name">Priyanshu</span>
          <span className="logo-surname">Upadhyay</span>
        </div>

        <div className="header-right">
          {/* ── Bifurcating Resume Button ── */}
          <div className="resume-wrapper">
            <div className="resume-btn-front">
              <span>RESUME</span>
            </div>
            <div className="resume-btn-back">
              <a href="/resume.pdf" download className="resume-icon-link" aria-label="Download Resume" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              <div className="resume-icon-divider" />
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-icon-link" aria-label="Preview Resume" title="Preview">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Navbar Dropdown Group ── */}
          <div className="nav-dropdown-wrapper">
            <button
              className="ticker-btn"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-expanded={isNavOpen}
            >
              <div className="ticker-content">
                <span aria-hidden="true">&gt;&gt;&gt; {tickerText}</span>
                <span className="terminal-cursor">_</span>
              </div>
            </button>

            <div className={`nav-dropdown ${isNavOpen ? 'is-open' : ''}`}>
              <ul className="nav-dropdown-list">
                <li><a href="#about" onClick={() => setIsNavOpen(false)}><span className="nav-index">01</span> About</a></li>
                <li><a href="#projects" onClick={() => setIsNavOpen(false)}><span className="nav-index">02</span> Projects</a></li>
                <li><a href="#skills" onClick={() => setIsNavOpen(false)}><span className="nav-index">03</span> Skills</a></li>
                <li><a href="#tools" onClick={() => setIsNavOpen(false)}><span className="nav-index">04</span> Tools</a></li>
                <li><a href="#contact" onClick={() => setIsNavOpen(false)}><span className="nav-index">05</span> Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
