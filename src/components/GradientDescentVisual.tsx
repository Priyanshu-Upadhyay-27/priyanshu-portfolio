import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GradientDescentVisual.css';

// ── Surface Mathematical Formulation ──
// Smooth loss-landscape with 1 deep global minimum and 2-3 local minima valleys
const G1 = { u: 0.65, v: -0.45, A: 1.85, s2: 0.85 }; // Global minimum (deepest valley)
const G2 = { u: -0.85, v: 0.75, A: 1.25, s2: 0.65 };  // Local minimum 1
const G3 = { u: -0.95, v: -0.85, A: 0.95, s2: 0.55 }; // Local minimum 2
const G4 = { u: 0.85, v: 0.85, A: 0.70, s2: 0.50 };   // Saddle / secondary basin

const BOWL = 0.12;
const R_AMP = 0.06;
const R_FREQ = 2.2;

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

const TRAIL_LENGTH = 38;

const GradientDescentVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check media queries
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Raised camera angle to clearly show valleys and descent path
    camera.position.set(0, 6.2, 4.8);
    camera.lookAt(0, -0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Capped at 2 for performance
    renderer.domElement.className = 'gradient-descent-canvas';
    container.appendChild(renderer.domElement);

    // Group to hold the tilting surface and optimizer (scaled up 1.2x)
    const surfaceGroup = new THREE.Group();
    surfaceGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(surfaceGroup);

    // 2. Wireframe Surface Mesh (40% lower density: 32 vs 54 segments)
    const planeExtent = 5.2;
    const segments = isMobile ? 20 : 32;
    const geometry = new THREE.PlaneGeometry(planeExtent, planeExtent, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Orient horizontal (XZ plane)

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Map world coords (x, z) to function domain (u, v)
      const u = x;
      const v = z;
      const y = surfaceHeight(u, v);
      posAttr.setY(i, y);
    }
    geometry.computeVertexNormals();

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5cc,
      wireframe: true,
      transparent: true,
      opacity: 0.20, // Lowered line opacity to roughly 20%
      depthWrite: false
    });
    const surfaceMesh = new THREE.Mesh(geometry, wireframeMaterial);
    surfaceGroup.add(surfaceMesh);

    // 3. Glowing Optimizer Dot (kept at full brightness)
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
    const dotCore = new THREE.Mesh(dotGeo, dotMat);
    dotGroup.add(dotCore);

    const glowTexture = createGlowTexture();
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 1.0,
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
      depthWrite: false
    });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    surfaceGroup.add(trailLine);

    // 5. Optimizer Simulation State
    let u = -1.6;
    let v = 1.4;
    let vu = 0;
    let vv = 0;
    let settleFrames = 0;
    let phase: 'descending' | 'paused' | 'fading' = 'descending';
    let phaseTimer = 0;
    let dotOpacity = 1;

    const trailHistory: THREE.Vector3[] = [];

    const respawnDot = () => {
      // Pick random spawn on the upper slopes away from minima
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.35 + Math.random() * 0.85; // 1.35 to 2.2
      u = Math.cos(angle) * radius;
      v = Math.sin(angle) * radius;
      vu = 0;
      vv = 0;
      settleFrames = 0;
      phase = 'descending';
      phaseTimer = 0;
      dotOpacity = 1;
      trailHistory.length = 0;
    };

    // If reduced motion is requested, rest statically at global minimum
    if (prefersReducedMotion) {
      u = G1.u;
      v = G1.v;
      const y = surfaceHeight(u, v) + 0.05;
      dotGroup.position.set(u, y, v);
      surfaceGroup.rotation.x = 0.40;
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

    // Initialize trail history
    const initialY = surfaceHeight(u, v) + 0.04;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailHistory.push(new THREE.Vector3(u, initialY, v));
    }

    // 6. Interactive Raycasting on Click
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObject(surfaceMesh);

      if (intersects.length > 0) {
        const localPoint = surfaceMesh.worldToLocal(intersects[0].point.clone());
        u = THREE.MathUtils.clamp(localPoint.x, -2.3, 2.3);
        v = THREE.MathUtils.clamp(localPoint.z, -2.3, 2.3);
      } else {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const hit = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, hit)) {
          const localPoint = surfaceMesh.worldToLocal(hit);
          u = THREE.MathUtils.clamp(localPoint.x, -2.2, 2.2);
          v = THREE.MathUtils.clamp(localPoint.z, -2.2, 2.2);
        } else {
          return;
        }
      }

      vu = 0;
      vv = 0;
      settleFrames = 0;
      phase = 'descending';
      phaseTimer = 0;
      dotOpacity = 1;
      trailHistory.length = 0;
    };
    container.addEventListener('click', handleClick);

    // 7. Mouse Parallax (Subtle Tilt)
    let targetTiltX = 0;
    let targetTiltZ = 0;
    let currentTiltX = 0;
    let currentTiltZ = 0;
    let idleRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || isTouch) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Max tilt: 12 degrees ≈ 0.209 radians
      const maxTilt = 0.20;
      targetTiltX = -ny * maxTilt;
      targetTiltZ = nx * maxTilt;
    };

    const handleMouseLeave = () => {
      targetTiltX = 0;
      targetTiltZ = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 450;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 9. Intersection Observer (Pause rendering when off-screen for performance)
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) {
        lastTime = time;
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.05); // Cap dt to avoid large delta jumps
      lastTime = time;

      // ── Physical Gradient Descent Simulation ──
      if (phase === 'descending') {
        const { du, dv } = surfaceGradient(u, v);
        const lr = 0.016; // learning rate
        const momentum = 0.88; // inertia

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

        // Check if optimizer settled in a minimum
        const speed = Math.hypot(vu, vv);
        const gradNorm = Math.hypot(du, dv);

        if (speed < 0.0035 && gradNorm < 0.12) {
          settleFrames++;
          if (settleFrames > 28) {
            phase = 'paused';
            phaseTimer = 1.0; // 1-second pause when settled
          }
        } else {
          settleFrames = 0;
        }
      } else if (phase === 'paused') {
        phaseTimer -= dt;
        if (phaseTimer <= 0) {
          phase = 'fading';
          phaseTimer = 0.45; // fade out duration
        }
      } else if (phase === 'fading') {
        phaseTimer -= dt;
        dotOpacity = Math.max(0, phaseTimer / 0.45);
        if (phaseTimer <= 0) {
          respawnDot();
        }
      }

      // Update Dot Position & Opacity
      const currentY = surfaceHeight(u, v) + 0.045; // Slightly elevated above wireframe
      dotGroup.position.set(u, currentY, v);
      dotMat.opacity = dotOpacity;
      spriteMat.opacity = dotOpacity * 0.9;
      trailMat.opacity = dotOpacity;

      // Update Trail
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

        // Fading trail alpha/luminosity from tail (0) to head (1)
        const alpha = Math.pow(i / (TRAIL_LENGTH - 1), 1.2);
        cArr[i * 3] = 0.0 * alpha;
        cArr[i * 3 + 1] = 1.0 * alpha;
        cArr[i * 3 + 2] = 0.95 * alpha;
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;

      // ── Parallax Tilt & Slow Idle Rotation ──
      // Raised camera viewing angle (0.40 base tilt)
      if (!isMobile && !isTouch) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.05;
        currentTiltZ += (targetTiltZ - currentTiltZ) * 0.05;
        idleRotationY += 0.00065; // Slow, almost imperceptible rotation

        surfaceGroup.rotation.x = 0.40 + currentTiltX;
        surfaceGroup.rotation.y = idleRotationY;
        surfaceGroup.rotation.z = currentTiltZ;
      } else {
        idleRotationY += 0.00055;
        surfaceGroup.rotation.x = 0.40;
        surfaceGroup.rotation.y = idleRotationY;
        surfaceGroup.rotation.z = 0;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 11. Complete Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="gradient-descent-container"
      title="Click anywhere to drop the optimizer"
    />
  );
};

export default GradientDescentVisual;
