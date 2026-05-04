import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // If the first visit has a hash, scroll to it
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.replace('#', ''));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      return;
    }
    
    // On subsequent navigations, only scroll to top if there's no hash
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Handle scrolling to hash when navigating between pages
  useEffect(() => {
    if (hash) {
      // Use setTimeout to allow DOM and GSAP to settle before scrolling
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToTop;
