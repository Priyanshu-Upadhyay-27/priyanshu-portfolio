import React, { useEffect, useRef, useState } from 'react';
import './NeuralHUD.css';

const NeuralHUD: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activePhaseText, setActivePhaseText] = useState('FORWARD_PASS');

    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        // High-DPI Canvas setup
        const dpr = window.devicePixelRatio || 1;
        cv.width = Math.round(580 * dpr);
        cv.height = Math.round(220 * dpr);
        ctx.scale(dpr, dpr);

        const W = 580;
        const H = 220;
        const PI2 = Math.PI * 2;

        // Physics & Layout constraints
        const LAYERS = [3, 5, 5, 4, 2];
        const COL_FWD = '#4f98a3';
        const COL_BWD = '#ccff00'; // Changed the backward pass to your neon yellow!
        const LAYER_HOLD = 55;
        const speedMult = 0.75; // Slower, ambient speed locked in

        function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
        function rnd(a: number, b: number) { return a + (b - a) * Math.random(); }

        const nodes: any[] = [];
        LAYERS.forEach((n, li) => {
            const x = 52 + li * (W - 104) / (LAYERS.length - 1);
            for (let ni = 0; ni < n; ni++) {
                const y = H / 2 - (n - 1) * 24 + ni * 48;
                nodes.push({ li, ni, x, y, fwd: 0, bwd: 0 });
            }
        });

        function layerNodes(li: number) { return nodes.filter(n => n.li === li); }

        const edges: any[] = [];
        for (let li = 0; li < LAYERS.length - 1; li++) {
            layerNodes(li).forEach(f => {
                layerNodes(li + 1).forEach(t => {
                    edges.push({
                        f, t, w: rnd(0.2, 1),
                        fprog: -1, fspeed: 0, bprog: -1, bspeed: 0
                    });
                });
            });
        }

        let phase = 'fwd';
        let activeLayer = 0;
        let layerTimer = 0;
        let animationFrameId: number;

        function resetAll() {
            nodes.forEach(n => { n.fwd = 0; n.bwd = 0; });
            edges.forEach(e => { e.fprog = -1; e.bprog = -1; e.fspeed = 0; e.bspeed = 0; });
        }

        function fireFwd(li: number) {
            layerNodes(li).forEach(n => n.fwd = 1.0);
            edges.filter(e => e.f.li === li).forEach(e => {
                e.fprog = 0;
                e.fspeed = rnd(0.016, 0.028);
            });
        }

        function fireBwd(li: number) {
            layerNodes(li).forEach(n => n.bwd = 1.0);
            edges.filter(e => e.t.li === li).forEach(e => {
                e.bprog = 0;
                e.bspeed = rnd(0.018, 0.032);
            });
        }

        function restart() {
            resetAll();
            phase = 'fwd'; activeLayer = 0; layerTimer = 0;
            fireFwd(0);
        }

        restart();

        // The Main Render Loop
        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, W, H);

            layerTimer++;
            if (layerTimer > LAYER_HOLD / speedMult) {
                layerTimer = 0;
                if (phase === 'fwd') {
                    activeLayer++;
                    if (activeLayer < LAYERS.length) {
                        fireFwd(activeLayer);
                    } else {
                        phase = 'pause_fwd';
                    }
                } else if (phase === 'pause_fwd') {
                    phase = 'bwd';
                    activeLayer = LAYERS.length - 1;
                    fireBwd(activeLayer);
                } else if (phase === 'bwd') {
                    activeLayer--;
                    if (activeLayer >= 0) {
                        fireBwd(activeLayer);
                    } else {
                        phase = 'pause_bwd';
                    }
                } else if (phase === 'pause_bwd') {
                    restart();
                }
            }

            nodes.forEach(n => {
                n.fwd = Math.max(0, n.fwd - 0.018 * speedMult);
                n.bwd = Math.max(0, n.bwd - 0.018 * speedMult);
            });

            edges.forEach(e => {
                ctx.globalAlpha = e.w * 0.12;
                ctx.strokeStyle = phase.startsWith('bwd') || phase === 'pause_bwd' ? COL_BWD : COL_FWD;
                ctx.lineWidth = e.w * 0.7;
                ctx.beginPath(); ctx.moveTo(e.f.x, e.f.y); ctx.lineTo(e.t.x, e.t.y); ctx.stroke();
                ctx.globalAlpha = 1;
            });

            edges.forEach(e => {
                if (e.fprog >= 0) {
                    e.fprog = Math.min(1, e.fprog + e.fspeed * speedMult);
                    const px = lerp(e.f.x, e.t.x, e.fprog);
                    const py = lerp(e.f.y, e.t.y, e.fprog);
                    const g = ctx.createRadialGradient(px, py, 0, px, py, 8);
                    g.addColorStop(0, 'rgba(79,152,163,0.55)'); g.addColorStop(1, 'rgba(79,152,163,0)');
                    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 8, 0, PI2); ctx.fill();
                    ctx.beginPath(); ctx.arc(px, py, 3.2, 0, PI2); ctx.fillStyle = COL_FWD; ctx.fill();
                    if (e.fprog >= 1 && e.t.fwd < 0.3) e.t.fwd = 1.0;
                }
                if (e.bprog >= 0) {
                    e.bprog = Math.min(1, e.bprog + e.bspeed * speedMult);
                    const px = lerp(e.t.x, e.f.x, e.bprog);
                    const py = lerp(e.t.y, e.f.y, e.bprog);
                    const g = ctx.createRadialGradient(px, py, 0, px, py, 8);

                    g.addColorStop(0, 'rgba(204, 255, 0, 0.35)'); g.addColorStop(1, 'rgba(204, 255, 0, 0)');
                    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 8, 0, PI2); ctx.fill();
                    ctx.beginPath(); ctx.arc(px, py, 3.2, 0, PI2); ctx.fillStyle = COL_BWD; ctx.fill();
                    if (e.bprog >= 1 && e.f.bwd < 0.3) e.f.bwd = 1.0;
                }
            });

            nodes.forEach(n => {
                const isBwd = n.bwd > 0.05;
                const gv = Math.max(n.fwd, n.bwd);
                const color = isBwd ? COL_BWD : COL_FWD;

                if (gv > 0.05) {
                    const gl = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 22);
                    gl.addColorStop(0, isBwd ? `rgba(204, 255, 0, ${gv * 0.3})` : `rgba(79,152,163, ${gv * 0.45})`);
                    gl.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, PI2); ctx.fill();
                }

                ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, PI2);
                ctx.fillStyle = gv > 0.05
                    ? (isBwd ? `rgba(204, 255, 0, ${0.35 + n.bwd * 0.65})` : `rgba(79,152,163,${0.35 + n.fwd * 0.65})`)
                    : 'rgba(79,152,163,0.18)';
                ctx.fill();
                ctx.strokeStyle = gv > 0.05 ? color : 'rgba(79,152,163,0.3)';
                ctx.lineWidth = 1.4; ctx.stroke();
            });

            let displayPhase = '';
            if (phase === 'fwd') displayPhase = 'FORWARD_PASS';
            else if (phase === 'pause_fwd') displayPhase = 'COMPUTING_LOSS';
            else if (phase === 'bwd') displayPhase = 'BACKPROPAGATION';
            else if (phase === 'pause_bwd') displayPhase = 'UPDATING_WEIGHTS';

            setActivePhaseText(current => {
                if (current !== displayPhase) return displayPhase;
                return current;
            });

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="neural-hud-container">
            <canvas ref={canvasRef} className="neural-canvas"></canvas>
            <div className="neural-terminal">
                <p className="hud-line">&gt; SYS.STATUS: <span className="highlight">OPTIMIZING</span></p>
                <p className="hud-line">&gt; ACTIVE_PHASE: <span className="highlight">{activePhaseText}</span><span className="blinking-cursor">_</span></p>
            </div>
        </div>
    );
};

export default NeuralHUD;