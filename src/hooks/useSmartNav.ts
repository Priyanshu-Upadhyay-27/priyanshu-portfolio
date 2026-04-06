import { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmartNavState {
  /** Header should be hidden (user is scrolling down past threshold) */
  isHidden: boolean;
  /** Header has left its "resting" zone and should show the glassmorphism bg */
  isPastHero: boolean;
}

/**
 * useSmartNav
 *
 * Tracks `window.scrollY` and returns two booleans that drive the header's
 * visibility. The header is always `position: fixed` in CSS. 
 * Includes an accumulated scroll delta logic (e.g. 50px) for upwards scroll
 * to prevent jittery accidental reveals.
 *
 * @param thresholdSelector — CSS selector for the element that marks the
 *   transition from Zone A → Zone B.  Default: `'#about'`
 */
export function useSmartNav(thresholdSelector = '#about'): SmartNavState {
  const [isHidden, setIsHidden] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Mutable refs so the scroll handler never stales
  const lastScrollY = useRef(0);
  const thresholdY = useRef<number>(99999);
  const scrollUpStartPoint = useRef(0);

  // ── Cache the threshold element's pageY offset ──
  const cacheThreshold = useCallback(() => {
    const el = document.querySelector(thresholdSelector);
    if (el) {
      thresholdY.current =
        el.getBoundingClientRect().top + window.scrollY;
    }
  }, [thresholdSelector]);

  useEffect(() => {
    // Initial + delayed measurement (GSAP pin-spacers shift layout)
    cacheThreshold();
    const delayId = setTimeout(cacheThreshold, 1500);

    // Recalculate when layout changes
    window.addEventListener('resize', cacheThreshold);
    ScrollTrigger.addEventListener('refresh', cacheThreshold);

    // ── Scroll handler ──
    const onScroll = () => {
      const y = window.scrollY;

      if (y >= thresholdY.current) {
        // Zone B — smart reveal
        setIsPastHero(true);
        
        if (y > lastScrollY.current) {
          // Scrolling down
          setIsHidden(true);
          scrollUpStartPoint.current = 0;
        } else if (y < lastScrollY.current) {
          // Scrolling up
          if (scrollUpStartPoint.current === 0) {
            scrollUpStartPoint.current = y;
          }
          
          const distanceScrolledUp = scrollUpStartPoint.current - y;
          
          if (distanceScrolledUp > 50) {
             setIsHidden(false);
          }
        }
      } else {
        // Zone A — always visible, transparent
        setIsPastHero(false);
        setIsHidden(false);
        scrollUpStartPoint.current = 0; // reset
      }

      // Edge Case: Absolute Top
      if (y < 50) {
         setIsHidden(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(delayId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', cacheThreshold);
      ScrollTrigger.removeEventListener('refresh', cacheThreshold);
    };
  }, [cacheThreshold]);

  return { isHidden, isPastHero };
}
