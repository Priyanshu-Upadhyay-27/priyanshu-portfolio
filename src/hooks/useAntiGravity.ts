import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AntiGravityOptions {
  rangeX?: number;
  rangeY?: number;
  rangeRot?: number;
  isPaused?: boolean;
}

export const useAntiGravity = (
  refs: React.RefObject<HTMLElement | null>[],
  options: AntiGravityOptions = {}
) => {
  const { rangeX = 10, rangeY = 10, rangeRot = 1.5, isPaused = false } = options;

  // Use a stable ref for the refs array to avoid dependency issues if passed inline
  const targetRefs = useRef(refs);
  // Update it to ensure it always holds the latest refs
  targetRefs.current = refs;

  const xTweenRef = useRef<gsap.core.Tween | null>(null);
  const rTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const targets = targetRefs.current.map((r) => r.current).filter(Boolean);
    if (!targets.length) return;

    // Step 1: Cleanup & Setup with gsap.context
    const ctx = gsap.context(() => {
      // Step 2: Decoupled Randomized Movement (X & Y)
      const moveXY = () => {
        const x = gsap.utils.random(-rangeX, rangeX);
        const y = gsap.utils.random(-rangeY, rangeY);
        const duration = gsap.utils.random(2.5, 5.0);
        const delay = gsap.utils.random(0, 1.5);

        // Make sure to use targets directly here so they animate as a cohesive unit
        xTweenRef.current = gsap.to(targets, {
          x,
          y,
          duration,
          delay,
          ease: 'power1.inOut', // smooth fluid ease
          onComplete: moveXY,
        });
      };

      // Step 3: Independent Randomized Rotation
      const rotate = () => {
        const rotation = gsap.utils.random(-rangeRot, rangeRot);
        const duration = gsap.utils.random(4, 7);

        rTweenRef.current = gsap.to(targets, {
          rotation,
          duration,
          ease: 'sine.inOut', // silky organic movement
          onComplete: rotate,
        });
      };

      // Start the animations
      moveXY();
      rotate();
    });

    return () => ctx.revert();
  }, [rangeX, rangeY, rangeRot]);

  // Step 4: Handle Pause/Play via isPaused dependency
  useEffect(() => {
    if (isPaused) {
      xTweenRef.current?.pause();
      rTweenRef.current?.pause();
    } else {
      xTweenRef.current?.play();
      rTweenRef.current?.play();
    }
  }, [isPaused]);
};
