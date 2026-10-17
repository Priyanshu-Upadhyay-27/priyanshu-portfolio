import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GradientDescentVisual.css';

// ── Surface Mathematical Formulation ──
// Prominently sculpted 3D loss landscape with deep, clearly visible descent slopes:
// G1 is a wide, deep global basin; G2, G3, G4 are distinct shallower valleys.
const G1 = { u: 0.45, v: -0.30, A: 2.85, s2: 1.40 }; // Deep, wide global basin (noticeably sunken)
const G2 = { u: -0.95, v: 0.75, A: 0.95, s2: 0.60 };  // Shallow local minimum 1
const G3 = { u: -1.05, v: -0.85, A: 0.80, s2: 0.55 }; // Shallow local minimum 2
const G4 = { u: 0.95, v: 0.90, A: 0.60, s2: 0.48 };   // Shallow saddle / valley

const BOWL = 0.16;
const R_AMP = 0.038;
const R_FREQ = 1.8;

// ── Edge Irregularity Controls ──
// Expose amplitude as a single constant (roughly 3-6% of mesh width).
// Set to 0 to completely disable irregularity and restore straight cuts.
const EDGE_IRREGULARITY = 0.04; // 4% of mesh width (~0.21 units)

// Smooth vertical envelope: 1.0 in the middle (v = 0), smoothly blending to 0 at top/bottom edges (v = +-2.6)
function getVerticalEnvelope(v: number): number {
  const normV = Math.max(-1, Math.min(1, v / 2.6));
  const c = Math.cos(normV * Math.PI * 0.5);
  return c * c;
}

// Low-frequency deterministic noise along v for left and right edges (2-3 smooth sine octaves)
function getEdgeOffset(v: number, isRight: boolean): number {
  if (EDGE_IRREGULARITY <= 0) return 0;
  const envelope = getVerticalEnvelope(v);
  // Independent fixed phases for left vs right so the two sides wander organically and independently
  const phase = isRight ? 0.35 : 2.48;
  const wave = (
    Math.sin(1.65 * v + phase) * 0.58 +
    Math.sin(3.40 * v + phase * 1.4 + 0.9) * 0.32 +
    Math.cos(5.10 * v - phase * 0.8 + 1.4) * 0.10
  );
  return envelope * wave * (5.2 * EDGE_IRREGULARITY);
}

// Compute dynamic left and right boundary positions for a given v
function getEdgeBounds(v: number): { left: number; right: number } {
  if (EDGE_IRREGULARITY <= 0) {
    return { left: -2.38, right: 2.38 };
  }
  const right = 2.48 + getEdgeOffset(v, true);
  const left = -2.48 - getEdgeOffset(v, false);
  return { left, right };
}

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

// Soft circular glow texture for optimizer dot
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
  return new THREE.CanvasTexture(canvas);
}

// Very soft, subtle static glow texture for floor of global minimum
function createBasinGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 229, 204, 0.40)');
    gradient.addColorStop(0.28, 'rgba(0, 229, 204, 0.20)');
    gradient.addColorStop(0.60, 'rgba(0, 229, 204, 0.06)');
    gradient.addColorStop(1, 'rgba(0, 229, 204, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

const TRAIL_LENGTH = 32;

// Persistent flag to guarantee the first-visit automatic drop runs exactly once ever,
// immune to React strict-mode double invocation and section re-entries.
let hasFirstVisitAutoDropped = false;

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
    // 3D Isometric 3/4 vantage point: angled view looking into the crater so both
    // the depth of the sunken basin and the surrounding slopes are clearly visible
    camera.position.set(0, 3.8, 5.8);
    camera.lookAt(0, -0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.className = 'gradient-descent-canvas';
    container.appendChild(renderer.domElement);

    // Group holding the surface, glow, and optimizer
    const surfaceGroup = new THREE.Group();
    surfaceGroup.scale.set(1.1, 1.1, 1.1);
    scene.add(surfaceGroup);

    // 2. Wireframe Surface Mesh with Height-based Color Gradient
    const planeExtent = 5.2;
    const segments = isMobile ? 22 : 34;
    const geometry = new THREE.PlaneGeometry(planeExtent, planeExtent, segments, segments);
    geometry.rotateX(-Math.PI / 2); // Orient horizontal (XZ plane)

    const posAttr = geometry.attributes.position;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getZ(i);
      const y = surfaceHeight(u, v);
      posAttr.setY(i, y);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    geometry.computeVertexNormals();

    // Color mesh lines by height + soft per-vertex alpha fade at noisy boundary
    const colors = new Float32Array(posAttr.count * 3);
    const vertexAlphas = new Float32Array(posAttr.count);
    const yRange = Math.max(maxY - minY, 0.001);
    const fadeBand = 0.22; // Short soft band for smooth line tapering

    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getZ(i);
      const y = posAttr.getY(i);

      // Distinct height gradient:
      // Ridges (high): dim teal (R=0.0, G=0.32, B=0.30)
      // Mid slopes: vibrant teal (R=0.0, G=0.85, B=0.80)
      // Basin floor: brilliant luminous cyan (R=0.25, G=1.0, B=0.95)
      const t = (y - minY) / yRange;
      const depthFactor = 1.0 - t; // 1.0 at lowest, 0.0 at highest
      const intensity = Math.pow(depthFactor, 1.2);

      const r = 0.25 * Math.pow(depthFactor, 2.5);
      const g = 0.32 + (1.0 - 0.32) * intensity;
      const b = 0.30 + (0.95 - 0.30) * intensity;

      // Calculate per-vertex alpha along the noisy boundary
      let alpha = 1.0;
      if (EDGE_IRREGULARITY > 0) {
        const { left, right } = getEdgeBounds(v);
        if (u > 0) {
          const innerRight = right - fadeBand;
          if (u <= innerRight) {
            alpha = 1.0;
          } else if (u >= right) {
            alpha = 0.0;
          } else {
            const step = (u - innerRight) / fadeBand;
            alpha = 1.0 - step * step * (3.0 - 2.0 * step);
          }
        } else {
          const innerLeft = left + fadeBand;
          if (u >= innerLeft) {
            alpha = 1.0;
          } else if (u <= left) {
            alpha = 0.0;
          } else {
            const step = (innerLeft - u) / fadeBand;
            alpha = 1.0 - step * step * (3.0 - 2.0 * step);
          }
        }
      }

      vertexAlphas[i] = alpha;
      colors[i * 3] = r * alpha;
      colors[i * 3 + 1] = g * alpha;
      colors[i * 3 + 2] = b * alpha;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Filter triangles so that triangles fully outside the boundary are not drawn
    const originalIndices = geometry.index ? geometry.index.array : null;
    if (originalIndices && EDGE_IRREGULARITY > 0) {
      const filteredIndices: number[] = [];
      for (let j = 0; j < originalIndices.length; j += 3) {
        const a = originalIndices[j];
        const b = originalIndices[j + 1];
        const c = originalIndices[j + 2];

        if (vertexAlphas[a] <= 0.001 && vertexAlphas[b] <= 0.001 && vertexAlphas[c] <= 0.001) {
          continue; // Completely outside boundary: omitted
        }

        filteredIndices.push(a, b, c);
      }
      geometry.setIndex(filteredIndices);
    }

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.32, // Crisp wireframe lines for clear slope contours
      depthWrite: false
    });
    const surfaceMesh = new THREE.Mesh(geometry, wireframeMaterial);
    surfaceGroup.add(surfaceMesh);

    // 3. Soft Static Glow on the Floor of the Global Minimum
    // Subtle, static radial light highlighting the global optimum without pulsing
    const basinTexture = createBasinGlowTexture();
    const basinMat = new THREE.SpriteMaterial({
      map: basinTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const basinGlow = new THREE.Sprite(basinMat);
    const basinFloorY = surfaceHeight(G1.u, G1.v) + 0.035;
    basinGlow.position.set(G1.u, basinFloorY, G1.v);
    basinGlow.scale.set(1.5, 1.5, 1);
    surfaceGroup.add(basinGlow);

    // 4. Single Glowing Optimizer Dot
    const dotGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
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

    // 5. Short Fading Optimizer Trail
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

    // 6. Optimizer State & Dynamics
    // Initial position: Resting still at the global minimum
    let u = G1.u;
    let v = G1.v;
    let vu = 0;
    let vv = 0;
    let settleFrames = 0;

    // Phases:
    // 'idle_settled': Resting still at minimum with only subtle glow pulse. No automatic drops.
    // 'fading_out': Fading out (~200ms) before reappearing at new coordinates
    // 'descending': Rolling down the gradient towards a basin
    // 'settling_trail': Trail fades out as ball comes to rest
    let phase: 'idle_settled' | 'fading_out' | 'descending' | 'settling_trail' = 'idle_settled';
    let phaseTimer = 0;
    let dotOpacity = 1.0;
    let dropFadeStartOpacity = 1.0;
    let nextTargetU = G1.u;
    let nextTargetV = G1.v;
    let pulseTime = 0;

    const trailHistory: THREE.Vector3[] = [];

    // Set initial dot position
    const initY = surfaceHeight(u, v) + 0.045;
    dotGroup.position.set(u, initY, v);

    // Function to trigger a drop (used by both first-visit auto drop and click/tap)
    const triggerDrop = (targetU: number, targetV: number) => {
      nextTargetU = targetU;
      nextTargetV = targetV;
      dropFadeStartOpacity = dotOpacity > 0.05 ? dotOpacity : 1.0;
      phase = 'fading_out';
      phaseTimer = 0.20; // Exact ~200ms fade out
    };

    // 7. First Visit Only: IntersectionObserver on About section
    const targetSection = container.closest('#about') || container;
    const firstVisitObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.38) {
            if (!hasFirstVisitAutoDropped) {
              hasFirstVisitAutoDropped = true;
              firstVisitObserver.disconnect(); // Disconnect immediately: never runs again

              if (!prefersReducedMotion) {
                // Pick a random point far enough from the global minimum for a visible descent,
                // and strictly inside the visible irregular boundary
                let spawnU = -1.4;
                let spawnV = 1.3;
                for (let attempts = 0; attempts < 25; attempts++) {
                  const angle = Math.random() * Math.PI * 2;
                  const rad = 1.35 + Math.random() * 0.85;
                  const candU = Math.cos(angle) * rad;
                  const candV = Math.sin(angle) * rad;
                  const { left, right } = getEdgeBounds(candV);
                  const dist = Math.hypot(candU - G1.u, candV - G1.v);
                  if (dist > 1.4 && candU > left + 0.15 && candU < right - 0.15 && Math.abs(candV) < 2.3) {
                    spawnU = candU;
                    spawnV = candV;
                    break;
                  }
                }
                triggerDrop(spawnU, spawnV);
              }
            }
            break;
          }
        }
      },
      { threshold: [0.1, 0.4] }
    );
    firstVisitObserver.observe(targetSection);

    // 8. User Click / Tap Interaction (Raycast against mesh, ignore misses & outside outline)
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleSurfaceInteraction = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObject(surfaceMesh);

      // Must hit the mesh; ignore clicks that miss
      if (intersects.length > 0) {
        const localPoint = surfaceMesh.worldToLocal(intersects[0].point.clone());
        const clickedU = THREE.MathUtils.clamp(localPoint.x, -2.5, 2.5);
        const clickedV = THREE.MathUtils.clamp(localPoint.z, -2.5, 2.5);

        // Ignore clicks that land outside the visible outline
        const { left, right } = getEdgeBounds(clickedV);
        if (clickedU < left || clickedU > right || Math.abs(clickedV) > 2.45) {
          return;
        }

        // Overrides any existing animation immediately
        triggerDrop(clickedU, clickedV);
      }
    };

    const handleClick = (e: MouseEvent) => {
      handleSurfaceInteraction(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleSurfaceInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('touchstart', handleTouch, { passive: true });

    // 9. Parallax Tilt (Max ~3 degrees ≈ 0.052 rad, lerp 0.03, only when hovering container)
    const MAX_TILT = (3 * Math.PI) / 180; // 0.0523 rad
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

      targetTiltX = -ny * MAX_TILT;
      targetTiltZ = nx * MAX_TILT;
    };

    const handleMouseLeave = () => {
      // Ease back to neutral when cursor leaves the visual
      targetTiltX = 0;
      targetTiltZ = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 10. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 450;
      const newH = container.clientHeight || 450;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 11. Viewport Visibility Observer (pause rendering when scrolled out of view)
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    visibilityObserver.observe(container);

    // 12. Main Animation & Physics Loop
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

      // ── Ball Behavior State Machine ──
      if (phase === 'fading_out') {
        phaseTimer -= dt;
        dotOpacity = Math.max(0, (phaseTimer / 0.20) * dropFadeStartOpacity);
        trailMat.opacity = Math.min(trailMat.opacity, dotOpacity);

        if (phaseTimer <= 0) {
          // Reappear at target point
          u = nextTargetU;
          v = nextTargetV;
          vu = 0;
          vv = 0;
          settleFrames = 0;
          dotOpacity = 1.0;
          trailHistory.length = 0;

          // Seed trail with initial coordinate
          const currentY = surfaceHeight(u, v) + 0.045;
          for (let i = 0; i < TRAIL_LENGTH; i++) {
            trailHistory.push(new THREE.Vector3(u, currentY, v));
          }

          phase = 'descending';
        }
      } else if (phase === 'descending') {
        // Physical gradient descent simulation
        const { du, dv } = surfaceGradient(u, v);
        const gradNorm = Math.hypot(du, dv);
        const speed = Math.hypot(vu, vv);

        // Near basin bottom: damp momentum gently to settle dead-center with zero oscillation
        let lr = 0.015;
        let momentum = 0.88;
        if (gradNorm < 0.14) {
          momentum = Math.max(0.68, 0.88 - (0.14 - gradNorm) * 1.5);
          lr = 0.012;
        }

        vu = vu * momentum - lr * du;
        vv = vv * momentum - lr * dv;

        u += vu;
        v += vv;

        // Organic boundary reflection & damping
        const { left, right } = getEdgeBounds(v);
        const minU = left + 0.08;
        const maxU = right - 0.08;

        if (u < minU) {
          u = minU;
          vu = Math.abs(vu) * 0.2;
        } else if (u > maxU) {
          u = maxU;
          vu = -Math.abs(vu) * 0.2;
        }

        if (Math.abs(v) > 2.38) {
          v = Math.sign(v) * 2.38;
          vv = -vv * 0.2;
        }

        // Settling threshold check
        if (speed < 0.0022 && gradNorm < 0.08) {
          settleFrames++;
          if (settleFrames > 22) {
            // Settled at the basin bottom! Transition to resting state
            vu = 0;
            vv = 0;
            phase = 'settling_trail';
            phaseTimer = 0.35; // Trail fades over 350ms
          }
        } else {
          settleFrames = 0;
        }

        dotOpacity = 1.0;
        trailMat.opacity = 0.80;
      } else if (phase === 'settling_trail') {
        phaseTimer -= dt;
        trailMat.opacity = Math.max(0, phaseTimer / 0.35) * 0.80;
        if (phaseTimer <= 0) {
          phase = 'idle_settled';
          trailHistory.length = 0;
          trailMat.opacity = 0;
        }
      }

      // Update Dot Position & Visuals
      const currentY = surfaceHeight(u, v) + 0.045;
      dotGroup.position.set(u, currentY, v);

      if (phase === 'idle_settled') {
        // Subtle, gentle glow pulse while resting at rest (no position change, no oscillation)
        const pulse = Math.sin(pulseTime * 2.0) * 0.035;
        glowSprite.scale.set(0.42 + pulse, 0.42 + pulse, 1);
        spriteMat.opacity = 0.85 + pulse * 1.5;
        dotMat.opacity = 1.0;
        trailMat.opacity = 0;
      } else {
        glowSprite.scale.set(0.42, 0.42, 1);
        spriteMat.opacity = dotOpacity * 0.9;
        dotMat.opacity = dotOpacity;
      }

      // Update Trail History (only while descending)
      if (phase === 'descending') {
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

          const alpha = Math.pow(i / (TRAIL_LENGTH - 1), 1.25);
          cArr[i * 3] = 0.0 * alpha;
          cArr[i * 3 + 1] = 1.0 * alpha;
          cArr[i * 3 + 2] = 0.95 * alpha;
        }
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.attributes.color.needsUpdate = true;
      }

      // ── Rotation & Cursor Parallax ──
      if (!prefersReducedMotion) {
        if (!isMobile && !isTouch) {
          // Subtle faint parallax: max ~3 deg, heavy smoothing (0.03 lerp)
          currentTiltX += (targetTiltX - currentTiltX) * 0.03;
          currentTiltZ += (targetTiltZ - currentTiltZ) * 0.03;
          idleRotationY += 0.00065; // Preserved slow idle rotation speed

          surfaceGroup.rotation.x = 0.18 + currentTiltX;
          surfaceGroup.rotation.y = idleRotationY;
          surfaceGroup.rotation.z = currentTiltZ;
        } else {
          // Mobile fallback: no tilt, idle rotation preserved
          idleRotationY += 0.00055;
          surfaceGroup.rotation.x = 0.18;
          surfaceGroup.rotation.y = idleRotationY;
          surfaceGroup.rotation.z = 0;
        }
      } else {
        // Reduced motion: static surface, no tilt, no rotation
        surfaceGroup.rotation.x = 0.18;
        surfaceGroup.rotation.y = 0.15;
        surfaceGroup.rotation.z = 0;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 13. Complete Resource Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      firstVisitObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      wireframeMaterial.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      glowTexture.dispose();
      spriteMat.dispose();
      basinTexture.dispose();
      basinMat.dispose();
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
      title="Click or tap anywhere on the surface to drop the optimizer"
    />
  );
};

export default GradientDescentVisual;
