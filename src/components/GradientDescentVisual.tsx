import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GradientDescentVisual.css';

// ── Surface Mathematical Formulation ──
// Smooth loss-landscape with 1 deep global minimum and 2-3 local minima valleys
// Height variation increased by 50% for pronounced 3D landscape ridges and valleys
const G1 = { u: 0.65, v: -0.45, A: 2.80, s2: 0.85 }; // Global minimum (deepest valley)
const G2 = { u: -0.85, v: 0.75, A: 1.85, s2: 0.65 };  // Local minimum 1
const G3 = { u: -0.95, v: -0.85, A: 1.40, s2: 0.55 }; // Local minimum 2
const G4 = { u: 0.85, v: 0.85, A: 1.05, s2: 0.50 };   // Saddle / secondary basin

const BOWL = 0.18;   // 1.5x of 0.12
const R_AMP = 0.09;  // 1.5x of 0.06
const R_FREQ = 2.2;  // Frequency preserved for smooth, non-jagged contours

function surfaceHeight(u: number, v: number): number {
  let h = BOWL * (u * u + v * v);
  h -= G1.A * Math.exp(-((u - G1.u) ** 2 + (v - G1.v) ** 2) / G1.s2);
  h -= G2.A * Math.exp(-((u - G2.u) ** 2 + (v - G2.v) ** 2) / G2.s2);
  h -= G3.A * Math.exp(-((u - G3.u) ** 2 + (v - G3.v) ** 2) / G3.s2);
  h -= G4.A * Math.exp(-((u - G4.u) ** 2 + (v - G4.v) ** 2) / G4.s2);
  h += R_AMP * Math.sin(R_FREQ * u) * Math.cos(R_FREQ * v);
  return h;
}

function surfaceGradient(u: number, v: number): { du: number; dv: number } {
  let du = 2 * BOWL * u;
  let dv = 2 * BOWL * v;

  const valleys = [G1, G2, G3, G4];
  for (let i = 0; i < valleys.length; i++) {
    const g = valleys[i];
    const expTerm = -g.A * Math.exp(-((u - g.u) ** 2 + (v - g.v) ** 2) / g.s2);
    du += expTerm * (-2 * (u - g.u) / g.s2);
    dv += expTerm * (-2 * (v - g.v) / g.s2);
  }

  du += R_AMP * R_FREQ * Math.cos(R_FREQ * u) * Math.cos(R_FREQ * v);
  dv += -R_AMP * R_FREQ * Math.sin(R_FREQ * u) * Math.sin(R_FREQ * v);

  return { du, dv };
}

// Generate random spawn point on upper slopes far from all minima for visible fall
function getRandomSpawnPoint(): { u: number; v: number } {
  const minima = [G1, G2, G3, G4];
  for (let attempt = 0; attempt < 50; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 1.35 + Math.random() * 0.85; // 1.35 to 2.2 radius
    const u = Math.cos(angle) * r;
    const v = Math.sin(angle) * r;

    let tooClose = false;
    for (let i = 0; i < minima.length; i++) {
      if (Math.hypot(u - minima[i].u, v - minima[i].v) < 0.85) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose && Math.abs(u) <= 2.2 && Math.abs(v) <= 2.2) {
      return { u, v };
    }
  }
  return { u: -1.65, v: 1.55 }; // High northwest slope fallback
}

// Generate soft circular glow texture for optimizer dot
function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(0, 229, 204, 1)');
    gradient.addColorStop(0.2, 'rgba(0, 229, 204, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 229, 204, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 229, 204, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const TRAIL_LENGTH = 34;

interface GradientDescentVisualProps {
  triggerScrollDrop?: number;
}

const GradientDescentVisual: React.FC<GradientDescentVisualProps> = ({ triggerScrollDrop = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startDropRef = useRef<((targetU: number, targetV: number) => void) | null>(null);
  const hasTriggeredInitialDropRef = useRef(false);

  // Trigger scroll drop from prop if passed (strictly once ever!)
  useEffect(() => {
    if (triggerScrollDrop > 0 && !hasTriggeredInitialDropRef.current && startDropRef.current) {
      hasTriggeredInitialDropRef.current = true;
      const pt = getRandomSpawnPoint();
      startDropRef.current(pt.u, pt.v);
    }
  }, [triggerScrollDrop]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check media queries & device capabilities
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Lower camera angle significantly: ~38-42 degrees above surface for rich 3D landscape relief
    camera.position.set(0, 3.8, 5.4);
    camera.lookAt(0, -0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = 'gradient-descent-canvas';
    container.appendChild(renderer.domElement);

    // Group to hold the landscape surface and optimizer dot
    const surfaceGroup = new THREE.Group();
    surfaceGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(surfaceGroup);

    // 2. Wireframe Surface Mesh
    const planeExtent = 5.2;
    const segments = isMobile ? 20 : 32;
    const geometry = new THREE.PlaneGeometry(planeExtent, planeExtent, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Orient horizontal (XZ plane)

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = surfaceHeight(x, z);
      posAttr.setY(i, y);
    }
    geometry.computeVertexNormals();

    // Wireframe ShaderMaterial with dynamic subtle cursor glow highlight
    const wireframeMaterial = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBaseColor: { value: new THREE.Color(0x00e5cc) },
        uGlowColor: { value: new THREE.Color(0x40ffff) },
        uBaseOpacity: { value: 0.20 },
        uCursorPos: { value: new THREE.Vector3(999, 999, 999) },
        uCursorRadius: { value: 1.15 }, // ~120px radius in screen space
        uHoverIntensity: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uBaseColor;
        uniform vec3 uGlowColor;
        uniform float uBaseOpacity;
        uniform vec3 uCursorPos;
        uniform float uCursorRadius;
        uniform float uHoverIntensity;
        varying vec3 vWorldPos;

        void main() {
          float dist = distance(vWorldPos, uCursorPos);
          float glow = smoothstep(uCursorRadius, 0.0, dist) * uHoverIntensity;
          vec3 col = mix(uBaseColor, uGlowColor, glow * 0.70);
          float alpha = uBaseOpacity + glow * 0.40;
          gl_FragColor = vec4(col, min(alpha, 0.85));
        }
      `
    });

    const surfaceMesh = new THREE.Mesh(geometry, wireframeMaterial);
    surfaceGroup.add(surfaceMesh);

    // 3. Glowing Optimizer Dot (defaults to resting at deepest global minimum valley)
    let u = G1.u;
    let v = G1.v;
    let vu = 0;
    let vv = 0;
    let settleFrames = 0;
    let phase: 'resting' | 'fading_out' | 'fading_in' | 'descending' | 'settling_trail' = 'resting';
    let phaseTimer = 0;
    let dotOpacity = 1.0;
    let pulseTime = 0;

    let pendingU = 0;
    let pendingV = 0;

    const dotGroup = new THREE.Group();
    const initialY = surfaceHeight(u, v) + 0.045;
    dotGroup.position.set(u, initialY, v);

    const dotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 });
    const dotCore = new THREE.Mesh(dotGeo, dotMat);
    dotGroup.add(dotCore);

    const glowTexture = createGlowTexture();
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const glowSprite = new THREE.Sprite(spriteMat);
    glowSprite.scale.set(0.42, 0.42, 1);
    dotGroup.add(glowSprite);

    surfaceGroup.add(dotGroup);

    // 4. Fading Optimizer Trail
    const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
    const trailColors = new Float32Array(TRAIL_LENGTH * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
      depthWrite: false,
      opacity: 0
    });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    surfaceGroup.add(trailLine);

    const trailHistory: THREE.Vector3[] = [];

    // Base pitch & rotation configuration
    const BASE_PITCH_X = 0.16; // ~9.2 degrees
    const MAX_TILT = 0.174;     // ~10 degrees max tilt per axis
    const IDLE_ROT_SPEED = 0.016; // radians per second (~390s per full rotation)

    let idleRotationY = 0;
    let targetTiltX = 0;
    let targetTiltZ = 0;
    let currentTiltX = 0;
    let currentTiltZ = 0;

    let isHovered = false;
    const targetGlowPos = new THREE.Vector3(999, 999, 999);
    const currentGlowPos = new THREE.Vector3(999, 999, 999);
    let currentHoverIntensity = 0;

    // Trigger drop routine: fades current ball out quickly (~200ms), moves to target point, fades in (~200ms), and rolls
    const startDrop = (targetU: number, targetV: number) => {
      pendingU = targetU;
      pendingV = targetV;
      phase = 'fading_out';
      phaseTimer = 0.20; // 200ms fade out of current ball
    };
    startDropRef.current = startDrop;

    // Reduced motion handling
    if (prefersReducedMotion) {
      surfaceGroup.rotation.x = BASE_PITCH_X;
      surfaceGroup.rotation.y = 0.15;
      renderer.render(scene, camera);
      return () => {
        renderer.dispose();
        geometry.dispose();
        wireframeMaterial.dispose();
        glowTexture.dispose();
        dotGeo.dispose();
        dotMat.dispose();
        spriteMat.dispose();
        trailGeo.dispose();
        trailMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    // 5. Interactive Raycasting on Click
    // Uses raycast against mesh so ball lands exactly where user clicked even when surface is tilted
    // If click misses the mesh, ignores it
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObject(surfaceMesh);

      // If click misses the mesh, ignore it
      if (intersects.length === 0) {
        return;
      }

      const localPoint = surfaceMesh.worldToLocal(intersects[0].point.clone());
      const targetU = THREE.MathUtils.clamp(localPoint.x, -2.3, 2.3);
      const targetV = THREE.MathUtils.clamp(localPoint.z, -2.3, 2.3);

      if (prefersReducedMotion) {
        u = targetU;
        v = targetV;
        dotGroup.position.set(u, surfaceHeight(u, v) + 0.045, v);
        renderer.render(scene, camera);
        return;
      }

      // Start click drop sequence: cancels any running auto drop and replaces ball
      startDrop(targetU, targetV);
    };
    container.addEventListener('click', handleClick);

    // 6. Cursor Interaction (Gentle tilt + soft mesh glow within visual bounds)
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || isTouch) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      isHovered = true;
      targetTiltX = -ny * MAX_TILT;
      targetTiltZ = nx * MAX_TILT;

      // Update 3D glow position on the surface under cursor
      mouseCoord.x = nx;
      mouseCoord.y = -ny;
      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObject(surfaceMesh);
      if (intersects.length > 0) {
        targetGlowPos.copy(intersects[0].point);
      }
    };

    const handleMouseEnter = () => {
      if (isMobile || isTouch) return;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetTiltX = 0;
      targetTiltZ = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 7. Standalone Scroll Entry Observer (fallback if prop not wired)
    const aboutSection = container.closest('#about') || document.getElementById('about');
    let scrollObserver: IntersectionObserver | null = null;

    if (aboutSection && triggerScrollDrop === 0 && !hasTriggeredInitialDropRef.current) {
      scrollObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              if (!hasTriggeredInitialDropRef.current) {
                hasTriggeredInitialDropRef.current = true;
                scrollObserver?.disconnect(); // Disconnect immediately: never runs again
                const pt = getRandomSpawnPoint();
                startDrop(pt.u, pt.v);
              }
              break;
            }
          }
        },
        { threshold: [0, 0.4] }
      );
      scrollObserver.observe(aboutSection);
    }

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 450;
      const newH = container.clientHeight || 400;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 9. Intersection Observer (Pause rendering when off-screen for performance)
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    visibilityObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) {
        lastTime = time;
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      pulseTime += dt;

      // ── Ball State Machine ──
      if (phase === 'fading_out') {
        phaseTimer -= dt;
        dotOpacity = Math.max(0, phaseTimer / 0.20);
        trailMat.opacity = dotOpacity;

        if (phaseTimer <= 0) {
          // Fade-out complete: jump to target spawn position & start fade-in
          u = pendingU;
          v = pendingV;
          vu = 0;
          vv = 0;
          settleFrames = 0;
          phase = 'fading_in';
          phaseTimer = 0.20; // 200ms fade in at new point
          dotOpacity = 0;

          const currentY = surfaceHeight(u, v) + 0.045;
          dotGroup.position.set(u, currentY, v);
          trailHistory.length = 0;
          for (let i = 0; i < TRAIL_LENGTH; i++) {
            trailHistory.push(new THREE.Vector3(u, currentY, v));
          }
        }
      } else if (phase === 'fading_in') {
        phaseTimer -= dt;
        dotOpacity = Math.min(1.0, 1.0 - (phaseTimer / 0.20));
        trailMat.opacity = dotOpacity;

        if (phaseTimer <= 0) {
          phase = 'descending';
          dotOpacity = 1.0;
        }
      } else if (phase === 'descending') {
        const { du, dv } = surfaceGradient(u, v);
        const lr = 0.012; // Well-conditioned learning rate for 50% steeper terrain
        const momentum = 0.86; // Inertia

        vu = vu * momentum - lr * du;
        vv = vv * momentum - lr * dv;

        u += vu;
        v += vv;

        // Boundary damping
        if (Math.abs(u) > 2.3) {
          u = Math.sign(u) * 2.3;
          vu = -vu * 0.3;
        }
        if (Math.abs(v) > 2.3) {
          v = Math.sign(v) * 2.3;
          vv = -vv * 0.3;
        }

        // Check if settled in a valley minimum
        const speed = Math.hypot(vu, vv);
        const gradNorm = Math.hypot(du, dv);

        if (speed < 0.0035 && gradNorm < 0.16) {
          settleFrames++;
          if (settleFrames > 26) {
            // Reached valley bottom: fade out the trail, ball stays resting here
            phase = 'settling_trail';
            phaseTimer = 0.40;
          }
        } else {
          settleFrames = 0;
        }
      } else if (phase === 'settling_trail') {
        phaseTimer -= dt;
        trailMat.opacity = Math.max(0, phaseTimer / 0.40);
        if (phaseTimer <= 0) {
          phase = 'resting';
          trailHistory.length = 0;
          trailMat.opacity = 0;
        }
      }

      // ── Update Ball Visuals (Glow pulse & position) ──
      const currentY = surfaceHeight(u, v) + 0.045;
      dotGroup.position.set(u, currentY, v);

      if (phase === 'resting') {
        // Subtle, gentle glow pulse while resting at bottom of valley
        const pulse = Math.sin(pulseTime * 1.8) * 0.05;
        glowSprite.scale.set(0.42 + pulse, 0.42 + pulse, 1);
        spriteMat.opacity = 0.88 + pulse * 1.5;
        dotMat.opacity = 1.0;
        trailMat.opacity = 0;
      } else if (phase === 'descending' || phase === 'fading_in') {
        glowSprite.scale.set(0.44, 0.44, 1);
        spriteMat.opacity = dotOpacity * 0.95;
        dotMat.opacity = dotOpacity;
        trailMat.opacity = dotOpacity;

        // Update Trail history
        trailHistory.push(new THREE.Vector3(u, currentY, v));
        if (trailHistory.length > TRAIL_LENGTH) {
          trailHistory.shift();
        }

        const pArr = trailGeo.attributes.position.array as Float32Array;
        const cArr = trailGeo.attributes.color.array as Float32Array;
        const historyCount = trailHistory.length;

        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const histIdx = Math.max(0, historyCount - TRAIL_LENGTH + i);
          const pt = trailHistory[histIdx] || trailHistory[0];
          pArr[i * 3] = pt.x;
          pArr[i * 3 + 1] = pt.y;
          pArr[i * 3 + 2] = pt.z;

          const alpha = Math.pow(i / (TRAIL_LENGTH - 1), 1.2);
          cArr[i * 3] = 0.0 * alpha;
          cArr[i * 3 + 1] = 1.0 * alpha;
          cArr[i * 3 + 2] = 0.95 * alpha;
        }
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.attributes.color.needsUpdate = true;
      } else {
        glowSprite.scale.set(0.42, 0.42, 1);
        spriteMat.opacity = dotOpacity * 0.9;
        dotMat.opacity = dotOpacity;
      }

      // ── Cursor Tilt Damping & Slow Idle Rotation ──
      // Heavy smoothing / damping (lerp factor 0.05) so it never twitches
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltZ += (targetTiltZ - currentTiltZ) * 0.05;

      idleRotationY += IDLE_ROT_SPEED * dt;

      surfaceGroup.rotation.x = BASE_PITCH_X + currentTiltX;
      surfaceGroup.rotation.y = idleRotationY;
      surfaceGroup.rotation.z = currentTiltZ;

      // ── Soft Mesh Glow Update ──
      const targetIntensity = (isHovered && !isMobile && !isTouch) ? 1.0 : 0.0;
      currentHoverIntensity += (targetIntensity - currentHoverIntensity) * 0.08;
      currentGlowPos.lerp(targetGlowPos, 0.15);

      wireframeMaterial.uniforms.uCursorPos.value.copy(currentGlowPos);
      wireframeMaterial.uniforms.uHoverIntensity.value = currentHoverIntensity;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 11. Complete Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      if (scrollObserver) scrollObserver.disconnect();
      startDropRef.current = null;

      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      wireframeMaterial.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      glowTexture.dispose();
      spriteMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [triggerScrollDrop]);

  return (
    <div
      ref={containerRef}
      className="gradient-descent-container"
      title="Click anywhere on the surface to drop the optimizer"
    />
  );
};

export default GradientDescentVisual;
