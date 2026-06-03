/**
 * PAGE-TRANSITION-V6.2 (Cinematic Kinetic Engine - GOLD STATE)
 * ----------------------------------------------------------------
 * [Physics] Clustered Particle Physics (Shatter -> Orbit -> Absorb)
 * [Mask] Left-Bottom to Top-Right Noise Reveal with Soft Jagged Edges
 * [Color] High-Fidelity Snapshot Color Inheritance
 * [Climax] Mass-Synchronized Singularity Growth (0.4 -> 1.1)
 * [VFX] 2000-Particle Ignition Threshold (Cyan Glow & Noise Grain)
 * [Lens] Pure Canvas Grid-Mesh Refraction Shockwave (No DOM Filters)
 * ----------------------------------------------------------------
 */

(function() {
    const CONFIG = {
        pixelStride: 12, // Increased stride for cluster-based performance
        grainsPerCluster: 25,
        gravity: 0.22,
        friction: 0.94,
        blackHoleBaseScale: 0.4,
        blackHoleMaxScale: 1.1,
        shockwaveDuration: 1300,
        glowThreshold: 2000,
        storageKey: 'pt_snapshot',
        gridCols: 32,
        gridRows: 24
    };

    let canvas, ctx, grains = [], isExiting = false, isEntering = false;
    let initialGrainsCount = 0;
    let activeClustersCount = 0;
    let blackHoleScale = CONFIG.blackHoleBaseScale;
    let snapshotImg = null;
    let shockwaveActive = false;
    let shockwaveStartTime = 0;
    let shockwaveOrigin = { x: 0, y: 0 };
    let noisePattern = null;

    class DustCluster {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            this.ox = x; this.oy = y;
            this.vx = (Math.random() - 0.5) * 12;
            this.vy = (Math.random() - 0.5) * 12;
            this.color = color;
            this.absorbed = false;
            this.phase = 'shatter';
            this.spawnNoise = Math.random() * 180 - 90;
            
            // Verbatim V6.2: 25 sub-particles per cluster
            this.subParticles = [];
            for(let i=0; i<CONFIG.grainsPerCluster; i++) {
                this.subParticles.push({
                    x: (Math.random() - 0.5) * 15,
                    y: (Math.random() - 0.5) * 15,
                    s: Math.random() * 2 + 0.5
                });
            }
        }

        update(tx, ty) {
            if (this.absorbed) return;
            const dx = tx - this.x;
            const dy = ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (this.phase === 'shatter') {
                this.x += this.vx; this.y += this.vy;
                this.vx *= CONFIG.friction; this.vy *= CONFIG.friction;
                if (Math.abs(this.vx) < 0.3) this.phase = 'orbit';
            } else if (this.phase === 'orbit') {
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle + Math.PI / 2) * 2.2 + dx * 0.015;
                this.vy += Math.sin(angle + Math.PI / 2) * 2.2 + dy * 0.015;
                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.94; this.vy *= 0.94;
                if (dist < 380) this.phase = 'absorb';
            } else {
                const force = Math.max(3, (4000 / (dist + 40)));
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.85; this.vy *= 0.85;
                if (dist < 15) {
                    this.absorbed = true;
                    activeClustersCount--;
                }
            }
        }

        draw(ctx, totalActiveParticles) {
            const isIgnited = totalActiveParticles > CONFIG.glowThreshold;
            
            ctx.save();
            if (isIgnited) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#00f3ff';
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = this.color;
            }

            for (let p of this.subParticles) {
                ctx.fillRect(this.x + p.x, this.y + p.y, p.s, p.s);
            }
            ctx.restore();
        }
    }

    class RefractionMesh {
        constructor() {
            this.cols = CONFIG.gridCols;
            this.rows = CONFIG.gridRows;
            this.points = [];
        }

        init() {
            this.points = [];
            const dw = window.innerWidth / this.cols;
            const dh = window.innerHeight / this.rows;
            for (let y = 0; y <= this.rows; y++) {
                for (let x = 0; x <= this.cols; x++) {
                    this.points.push({
                        bx: x * dw, by: y * dh,
                        x: x * dw, y: y * dh,
                        u: x / this.cols, v: y / this.rows
                    });
                }
            }
        }

        update(ox, oy, radius, progress) {
            const maxPush = 160 * (1 - progress);
            const spread = 280;
            for (let p of this.points) {
                const dx = p.bx - ox;
                const dy = p.by - oy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const diff = Math.abs(dist - radius);
                if (diff < spread) {
                    const force = (1 - diff / spread);
                    const angle = Math.atan2(dy, dx);
                    p.x = p.bx + Math.cos(angle) * force * maxPush;
                    p.y = p.by + Math.sin(angle) * force * maxPush;
                } else {
                    p.x = p.bx; p.y = p.by;
                }
            }
        }

        draw(ctx, img) {
            if (!img) return;
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    const i = y * (this.cols + 1) + x;
                    const p1 = this.points[i], p2 = this.points[i + 1], p3 = this.points[i + this.cols + 1], p4 = this.points[i + this.cols + 2];
                    this.drawTriangle(ctx, img, p1, p2, p3);
                    this.drawTriangle(ctx, img, p2, p4, p3);
                }
            }
        }

        drawTriangle(ctx, img, p1, p2, p3) {
            ctx.save(); ctx.beginPath();
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y);
            ctx.closePath(); ctx.clip();
            const sx = p1.u * img.width, sy = p1.v * img.height;
            const sw = (p2.u - p1.u) * img.width || 2, sh = (p3.v - p1.v) * img.height || 2;
            ctx.drawImage(img, sx, sy, sw, sh, Math.min(p1.x, p2.x, p3.x), Math.min(p1.y, p2.y, p3.y), Math.max(p1.x, p2.x, p3.x) - Math.min(p1.x, p2.x, p3.x) + 1, Math.max(p1.y, p2.y, p3.y) - Math.min(p1.y, p2.y, p3.y) + 1);
            ctx.restore();
        }
    }

    const mesh = new RefractionMesh();

    function drawSingularity(x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 130);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        grad.addColorStop(0.3, 'rgba(0, 243, 255, 0.45)');
        grad.addColorStop(0.7, 'rgba(0, 243, 255, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 75, 0, Math.PI * 2);
        ctx.shadowBlur = 90; ctx.shadowColor = '#00f3ff';
        ctx.fillStyle = '#000'; ctx.fill();
        ctx.restore();
    }

    function renderNoise() {
        if (!noisePattern) {
            const nC = document.createElement('canvas'); nC.width = 100; nC.height = 100;
            const nCtx = nC.getContext('2d');
            const idata = nCtx.createImageData(100, 100);
            for(let i=0; i<idata.data.length; i+=4) {
                const val = Math.random() * 255;
                idata.data[i] = idata.data[i+1] = idata.data[i+2] = val;
                idata.data[i+3] = 20;
            }
            nCtx.putImageData(idata, 0, 0);
            noisePattern = ctx.createPattern(nC, 'repeat');
        }
        ctx.save();
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    window.transitionToPage = async function(url, e) {
        if (e && e.preventDefault) e.preventDefault();
        if (isExiting) return;
        isExiting = true;
        try {
            await ensureHtml2Canvas();
            const snap = await html2canvas(document.body, { scale: 0.4, backgroundColor: '#050508', useCORS: true });
            sessionStorage.setItem(CONFIG.storageKey, snap.toDataURL('image/jpeg', 0.8));
            initCanvas();
            processSnapshot(snap);
            exitLoop(url);
        } catch (err) { window.location.href = url; }
    };

    function initCanvas() {
        if (canvas) canvas.remove();
        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;inset:0;z-index:9999999;pointer-events:none;';
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        mesh.init();
    }

    function processSnapshot(snap) {
        const sCtx = snap.getContext('2d');
        const data = sCtx.getImageData(0, 0, snap.width, snap.height).data;
        const w = snap.width;
        grains = [];
        for (let y = 0; y < snap.height; y += CONFIG.pixelStride) {
            for (let x = 0; x < w; x += CONFIG.pixelStride) {
                const i = (y * w + x) * 4;
                if (data[i + 3] > 100) {
                    const color = `rgb(${data[i]},${data[i+1]},${data[i+2]})`;
                    grains.push(new DustCluster(x / 0.4, y / 0.4, color));
                }
            }
        }
        initialGrainsCount = activeClustersCount = grains.length;
    }

    function getJaggedClip(progress) {
        const w = window.innerWidth, h = window.innerHeight;
        const diag = w + h;
        const currentPos = progress * diag * 1.4; 
        const segments = 16; eLines = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const py = h * (1 - t);
            const px = (currentPos - h) + (h * t);
            const jitter = (Math.random() - 0.5) * 80;
            eLines.push({ x: px + jitter, y: py });
        }
        return eLines;
    }

    function exitLoop(url) {
        const tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let progress = 0;
        
        const snapshot = document.createElement('canvas');
        snapshot.width = window.innerWidth; snapshot.height = window.innerHeight;
        const sCtx = snapshot.getContext('2d');
        html2canvas(document.body, { scale: 1.0, backgroundColor: '#050508' }).then(canv => {
            sCtx.drawImage(canv, 0, 0, window.innerWidth, window.innerHeight);
        });

        // Layer for soft masking
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = window.innerWidth; maskCanvas.height = window.innerHeight;
        const mCtx = maskCanvas.getContext('2d');

        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            progress += 0.012;
            const jaggedPath = getJaggedClip(progress);
            
            // 1. Draw Background
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 2. Draw the 'Page' with Soft Edge
            if (snapshot) {
                mCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                mCtx.save();
                // Draw the 'Keep' area with shadow for softness
                mCtx.shadowBlur = 50; 
                mCtx.shadowColor = 'black';
                mCtx.fillStyle = 'black';
                mCtx.beginPath();
                mCtx.moveTo(window.innerWidth + 500, -500);
                for (let p of jaggedPath) mCtx.lineTo(p.x, p.y);
                mCtx.lineTo(-500, window.innerHeight + 500);
                mCtx.lineTo(window.innerWidth + 500, window.innerHeight + 500);
                mCtx.closePath();
                mCtx.fill();
                mCtx.restore();

                // Composite snapshot onto main canvas using the mask
                ctx.save();
                ctx.drawImage(snapshot, 0, 0);
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(maskCanvas, 0, 0);
                ctx.restore();
            }

            // 3. Update & Draw Particles
            const totalActive = activeClustersCount * CONFIG.grainsPerCluster;
            const revealLimit = progress * (window.innerWidth + window.innerHeight) * 1.25;
            
            let allAbsorbed = true;
            for (let g of grains) {
                if (g.absorbed) continue;
                allAbsorbed = false;
                const score = (window.innerHeight - g.oy) + g.ox;
                if (score + g.spawnNoise < revealLimit) g.update(tx, ty);
                g.draw(ctx, totalActive);
            }

            blackHoleScale = CONFIG.blackHoleBaseScale + (CONFIG.blackHoleMaxScale - CONFIG.blackHoleBaseScale) * (1 - activeClustersCount / initialGrainsCount);
            drawSingularity(tx, ty, blackHoleScale);
            renderNoise();

            if (allAbsorbed && progress > 1.3) window.location.href = url;
            else requestAnimationFrame(render);
        }
        render();
    }

    async function checkEntrance() {
        const snapData = sessionStorage.getItem(CONFIG.storageKey);
        if (!snapData) return;
        sessionStorage.removeItem(CONFIG.storageKey);
        initCanvas();
        snapshotImg = new Image();
        snapshotImg.onload = () => {
            const off = document.createElement('canvas');
            off.width = snapshotImg.width; off.height = snapshotImg.height;
            const oCtx = off.getContext('2d');
            oCtx.drawImage(snapshotImg, 0, 0);
            processSnapshot(off);
            entranceLoop();
        };
        snapshotImg.src = snapData;
    }

    function entranceLoop() {
        const tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let finalCollapse = false;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const totalActive = activeClustersCount * CONFIG.grainsPerCluster;
            for (let g of grains) {
                if (g.absorbed) continue;
                g.update(tx, ty);
                g.draw(ctx, totalActive);
            }
            blackHoleScale = CONFIG.blackHoleBaseScale + (CONFIG.blackHoleMaxScale - CONFIG.blackHoleBaseScale) * (1 - activeClustersCount / initialGrainsCount);
            if (activeClustersCount <= 0 && !finalCollapse) {
                finalCollapse = true;
                triggerShockwave(tx, ty);
                return;
            }
            drawSingularity(tx, ty, blackHoleScale);
            renderNoise();
            requestAnimationFrame(render);
        }
        render();
    }

    function triggerShockwave(x, y) {
        shockwaveOrigin = { x, y }; shockwaveStartTime = Date.now();
        const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.6;
        function loop() {
            const elapsed = Date.now() - shockwaveStartTime;
            const progress = Math.min(elapsed / CONFIG.shockwaveDuration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentR = ease * maxR;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mesh.update(x, y, currentR, progress);
            mesh.draw(ctx, snapshotImg);
            ctx.beginPath(); ctx.arc(x, y, currentR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.5 * (1 - progress)})`;
            ctx.lineWidth = 12 * (1 - progress); ctx.stroke();
            if (progress < 0.25) drawSingularity(x, y, blackHoleScale * (1 - progress / 0.25));
            if (progress < 1) requestAnimationFrame(loop);
            else { canvas.remove(); if (window.triggerGridShockwave) window.triggerGridShockwave(x, y); }
        }
        loop();
    }

    async function ensureHtml2Canvas() {
        if (window.html2canvas) return;
        return new Promise(res => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            s.onload = res; document.head.appendChild(s);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', e => {
            const a = e.target.closest('a');
            if (a && a.hostname === window.location.hostname && !a.hasAttribute('target')) {
                const href = a.getAttribute('href');
                if (href && !href.startsWith('#')) window.transitionToPage(href, e);
            }
        });
        checkEntrance();
    });
})();
