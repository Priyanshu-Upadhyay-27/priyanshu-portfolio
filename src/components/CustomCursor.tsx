import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

/**
 * CustomCursor — Bracket Tracker
 *
 * Renders a [ · ] cursor that follows the mouse with GSAP physics.
 * On hover over interactive elements, the brackets snap together
 * and glow neon yellow (#ccff00).
 *
 * Mount once at the root level (App.tsx), outside all routes/sections.
 */
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  // ── Hover detection ──
  // Checks if the element (or any ancestor) is interactive.
  const isInteractive = useCallback((el: HTMLElement | null): boolean => {
    if (!el) return false;

    const interactiveSelectors = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      'label',
      '[role="button"]',
      '[data-cursor-hover]',
    ];

    // Walk up the DOM tree
    let current: HTMLElement | null = el;
    while (current) {
      if (interactiveSelectors.some((sel) => current!.matches(sel))) return true;
      // Also check for pointer/clickable styles
      const style = window.getComputedStyle(current);
      if (style.cursor === 'pointer') return true;
      current = current.parentElement;
    }

    return false;
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // ════════════════════════════════════════════
    // 1. GSAP quickTo — zero-latency position tracking
    //    duration: 0.02 with no easing for instant 1:1
    //    mouse tracking. Hover animations stay smooth
    //    via CSS transitions on gap/color/shadow.
    // ════════════════════════════════════════════
    xTo.current = gsap.quickTo(cursor, 'x', {
      duration: 0.02,
      ease: 'none',
    });

    yTo.current = gsap.quickTo(cursor, 'y', {
      duration: 0.02,
      ease: 'none',
    });

    // Center the cursor element on the mouse point
    // The cursor flex container is ~50px wide; offset by half
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // ════════════════════════════════════════════
    // 2. MOUSE MOVE — feed coordinates to quickTo
    // ════════════════════════════════════════════
    const onMouseMove = (e: MouseEvent) => {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };

    // ════════════════════════════════════════════
    // 3. HOVER STATE — toggle .is-hovering class
    //    HIDE ZONES — project images & form focus
    // ════════════════════════════════════════════

    // Check if element (or ancestor) is a hide zone
    const shouldHide = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      let current: HTMLElement | null = el;
      while (current) {
        if (current.classList?.contains('cursor-zoom-in')) return true;
        current = current.parentElement;
      }
      return false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldHide(target)) {
        cursor.classList.add('is-hidden');
      } else if (isInteractive(target)) {
        cursor.classList.add('is-hovering');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldHide(target)) {
        cursor.classList.remove('is-hidden');
      }
      if (isInteractive(target)) {
        cursor.classList.remove('is-hovering');
      }
    };

    // Hide cursor when typing in form fields
    const onFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        cursor.classList.add('is-hidden');
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        cursor.classList.remove('is-hidden');
      }
    };

    // ════════════════════════════════════════════
    // 4. VISIBILITY — hide when mouse leaves window
    // ════════════════════════════════════════════
    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    // ── Bind events ──
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    // Start hidden until first move
    gsap.set(cursor, { opacity: 0 });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isInteractive]);

  return (
    <div ref={cursorRef} className="bracket-cursor" aria-hidden="true">
      <span className="bracket-cursor__left">[</span>
      <span className="bracket-cursor__right">]</span>
    </div>
  );
};

export default CustomCursor;
