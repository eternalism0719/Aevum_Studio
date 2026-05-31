/**
 * PAGE-TRANSITION V4×6.2 (Hybrid Engine)
 * ─────────────────────────────────────────────────────────────────
 * [EXIT]   V4 Abstract Soul Dust — diagonal sweep bottom-left → top-right
 * [ENTER]  V6.2 Black Hole Physics — Shatter → Orbit → Absorb → Shockwave
 * ─────────────────────────────────────────────────────────────────
 */
(function () {

    const STORAGE_KEY = 'pt_v4x62_snapshot';

    const V62 = {
        pixelStride: 12,
        grainsPerCluster: 25,
        friction: 0.94,
        blackHoleBaseScale: 0.4,
        blackHoleMaxScale: 1.1,
        shockwaveDuration: 1300,
        glowThreshold: 2000,
        gridCols: 32,
        gridRows: 24
    };

    let canvas, ctx, noisePattern = null, snapshotImg = null;
    let grains = [], initialGrainsCount = 0, activeClustersCount = 0;
    let blackHoleScale = V62.blackHoleBaseScale;
    let isExiting = false;

    // ── CANVAS ──────────────────────────────────────────────────────────────
    function initCanvas() {
        if (canvas) canvas.remove();
        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;inset:0;z-index:9999999;pointer-events:none;';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
    }

    function renderNoise() {
        if (!noisePattern) {
            const nC = document.createElement('canvas');
            nC.width = 100; nC.height = 100;
            const nCtx = nC.getContext('2d');
            const id = nCtx.createImageData(100, 100);
            for (let i = 0; i < id.data.length; i += 4) {
                const v = Math.random() * 255;
                id.data[i] = id.data[i+1] = id.data[i+2] = v;
                id.data[i+3] = 20;
            }
            nCtx.putImageData(id, 0, 0);
            noisePattern = ctx.createPattern(nC, 'repeat');
        }
        ctx.save();
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // EXIT ENGINE — V4 Abstract Soul Dust
    // ══════════════════════════════════════════════════════════════════════════
    class V4Cluster {
        constructor(x, y, palette) {
            this.x = x; this.y = y;
            this.triggerNoise = Math.random() * 200 - 100;
            const spd = Math.random() * 18 + 5;
            this.vx = spd * 1.5;
            this.vy = -(spd * 0.9);
            this.amplitude = Math.random() * 3 + 1;
            this.frequency = Math.random() * 0.1 + 0.04;
            this.phase = Math.random() * Math.PI * 2;
            this.life = Math.random() * 120 + (100 / (spd * 0.05));
            this.particles = [];
            const ps = 4, cs = 4;
            const pCount = (cs * cs) / 1.1;
            for (let i = 0; i < pCount; i++) {
                this.particles.push({
                    dx: Math.random() * cs * ps,
                    dy: Math.random() * cs * ps,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    id: Math.random() * 1000
                });
            }
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.phase += this.frequency;
            this.y += Math.sin(this.phase) * this.amplitude;
            this.life--;
        }
        draw(time, W) {
            if (this.life <= 0) return;
            let alpha = this.life < 40 ? this.life / 40 : 1.0;
            const fadeStart = W * 0.75;
            if (this.x > fadeStart) alpha *= Math.max(0, 1 - (this.x - fadeStart) / (W - fadeStart));
            if (alpha <= 0.01) return;
            ctx.globalAlpha = alpha;
            for (const p of this.particles) {
                ctx.fillStyle = p.color;
                ctx.fillRect(this.x + p.dx, this.y + p.dy + Math.sin(time + p.id) * 1.5, 4, 4);
            }
            ctx.globalAlpha = 1.0;
        }
    }

    function runExit(url, capturedCanvas) {
        // Extract palette from snapshot
        let palette = ['#050508', '#00ffc8', '#ffffff', '#1a1a1a'];
        try {
            const pCtx = capturedCanvas.getContext('2d');
            const pData = pCtx.getImageData(0, 0, capturedCanvas.width, capturedCanvas.height).data;
            const cols = [];
            for (let i = 0; i < pData.length; i += 60) {
                if (pData[i+3] > 100) cols.push(`rgb(${pData[i]},${pData[i+1]},${pData[i+2]})`);
            }
            if (cols.length > 10) palette = cols;
        } catch(e) {}

        const W = window.innerWidth, H = window.innerHeight;
        const step = 16; // pixelStride(4) * clusterStride(4)
        const cols  = Math.ceil(W / step);
        const rows  = Math.ceil(H / step);
        const statusMap = new Uint8Array(cols * rows);
        let clusters = [];
        let cutoff = 0;
        let navigated = false;

        function render() {
            ctx.clearRect(0, 0, W, H);
            const tf = Date.now() * 0.003;
            const progress = Math.min(1.0, cutoff / (W + H + 500));
            cutoff += 18;

            // Spawn V4 dust clusters along diagonal front
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const idx = r * cols + c;
                    if (statusMap[idx] === 0) {
                        const x = c * step, y = r * step;
                        const score = x + (H - y);
                        const noise = ((Math.sin(x*0.01)*60) + (Math.cos(y*0.01)*60)) * (0.5 + progress * 1.8);
                        if (score + noise < cutoff) {
                            clusters.push(new V4Cluster(x, y, palette));
                            statusMap[idx] = 1;
                        }
                    }
                }
            }

            // Black mask sweeps in from bottom-left → top-right (covering the page)
            ctx.save();
            ctx.fillStyle = '#050508';
            ctx.beginPath();
            ctx.moveTo(0, H);
            for (let i = 0; i <= 12; i++) {
                const t = i / 12;
                const px = cutoff - (H * (1 - t));
                const py = H * t;
                const jitter = Math.sin(tf * 3 + i) * (40 + progress * 80);
                ctx.lineTo(Math.max(0, px + jitter), py);
            }
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Draw dust
            for (let i = clusters.length - 1; i >= 0; i--) {
                clusters[i].update();
                clusters[i].draw(tf, W);
                if (clusters[i].life <= 0) clusters.splice(i, 1);
            }

            renderNoise();

            if (cutoff > W + H + 500 && !navigated) {
                navigated = true;
                window.location.href = url;
                return;
            }
            requestAnimationFrame(render);
        }
        render();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ENTRANCE ENGINE — V6.2 Black Hole
    // ══════════════════════════════════════════════════════════════════════════
    class V62Cluster {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            this.vx = (Math.random() - 0.5) * 12;
            this.vy = (Math.random() - 0.5) * 12;
            this.color = color;
            this.absorbed = false;
            this.phase = 'shatter';
            this.spawnNoise = Math.random() * 180 - 90;
            this.sub = [];
            for (let i = 0; i < V62.grainsPerCluster; i++) {
                this.sub.push({ x: (Math.random()-0.5)*15, y: (Math.random()-0.5)*15, s: Math.random()*2+0.5 });
            }
        }
        update(tx, ty) {
            if (this.absorbed) return;
            const dx = tx - this.x, dy = ty - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (this.phase === 'shatter') {
                this.x += this.vx; this.y += this.vy;
                this.vx *= V62.friction; this.vy *= V62.friction;
                if (Math.abs(this.vx) < 0.3) this.phase = 'orbit';
            } else if (this.phase === 'orbit') {
                const a = Math.atan2(dy, dx);
                this.vx += Math.cos(a + Math.PI/2) * 2.2 + dx * 0.015;
                this.vy += Math.sin(a + Math.PI/2) * 2.2 + dy * 0.015;
                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.94; this.vy *= 0.94;
                if (dist < 380) this.phase = 'absorb';
            } else {
                const force = Math.max(3, 4000 / (dist + 40));
                this.vx += (dx/dist)*force; this.vy += (dy/dist)*force;
                this.x += this.vx; this.y += this.vy;
                this.vx *= 0.85; this.vy *= 0.85;
                if (dist < 15) { this.absorbed = true; activeClustersCount--; }
            }
        }
        draw(total) {
            const lit = total > V62.glowThreshold;
            ctx.save();
            if (lit) { ctx.shadowBlur = 12; ctx.shadowColor = '#00f3ff'; ctx.fillStyle = '#ffffff'; }
            else { ctx.fillStyle = this.color; }
            for (const p of this.sub) ctx.fillRect(this.x + p.x, this.y + p.y, p.s, p.s);
            ctx.restore();
        }
    }

    class RefractionMesh {
        constructor() { this.cols = V62.gridCols; this.rows = V62.gridRows; this.pts = []; }
        init() {
            this.pts = [];
            const dw = window.innerWidth / this.cols, dh = window.innerHeight / this.rows;
            for (let y = 0; y <= this.rows; y++)
                for (let x = 0; x <= this.cols; x++)
                    this.pts.push({ bx: x*dw, by: y*dh, x: x*dw, y: y*dh, u: x/this.cols, v: y/this.rows });
        }
        update(ox, oy, radius, progress) {
            const maxPush = 160*(1-progress), spread = 280;
            for (const p of this.pts) {
                const dx = p.bx-ox, dy = p.by-oy, dist = Math.sqrt(dx*dx+dy*dy);
                const diff = Math.abs(dist - radius);
                if (diff < spread) {
                    const f = 1 - diff/spread, a = Math.atan2(dy,dx);
                    p.x = p.bx + Math.cos(a)*f*maxPush;
                    p.y = p.by + Math.sin(a)*f*maxPush;
                } else { p.x = p.bx; p.y = p.by; }
            }
        }
        draw(img) {
            if (!img) return;
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < this.cols; x++) {
                    const i = y*(this.cols+1)+x;
                    const p1=this.pts[i], p2=this.pts[i+1], p3=this.pts[i+this.cols+1], p4=this.pts[i+this.cols+2];
                    this._tri(p1,p2,p3,img); this._tri(p2,p4,p3,img);
                }
            }
        }
        _tri(p1,p2,p3,img) {
            ctx.save(); ctx.beginPath();
            ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.lineTo(p3.x,p3.y);
            ctx.closePath(); ctx.clip();
            const sx=p1.u*img.width, sy=p1.v*img.height;
            const sw=(p2.u-p1.u)*img.width||2, sh=(p3.v-p1.v)*img.height||2;
            const dx=Math.min(p1.x,p2.x,p3.x), dy=Math.min(p1.y,p2.y,p3.y);
            ctx.drawImage(img,sx,sy,sw,sh,dx,dy,Math.max(p1.x,p2.x,p3.x)-dx+1,Math.max(p1.y,p2.y,p3.y)-dy+1);
            ctx.restore();
        }
    }

    const mesh = new RefractionMesh();

    function drawSingularity(x, y, scale) {
        ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
        const g = ctx.createRadialGradient(0,0,10,0,0,130);
        g.addColorStop(0,   'rgba(0,0,0,1)');
        g.addColorStop(0.3, 'rgba(0,243,255,0.45)');
        g.addColorStop(0.7, 'rgba(0,243,255,0.1)');
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(0,0,130,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(0,0,75,0,Math.PI*2);
        ctx.shadowBlur=90; ctx.shadowColor='#00f3ff'; ctx.fillStyle='#000'; ctx.fill();
        ctx.restore();
    }

    function processSnapshot(snap) {
        const sc = snap.getContext('2d');
        const data = sc.getImageData(0,0,snap.width,snap.height).data;
        const W = snap.width, scale = snap.width / window.innerWidth;
        grains = [];
        for (let y = 0; y < snap.height; y += V62.pixelStride) {
            for (let x = 0; x < W; x += V62.pixelStride) {
                const i = (y*W+x)*4;
                if (data[i+3] > 100) {
                    grains.push(new V62Cluster(x/scale, y/scale, `rgb(${data[i]},${data[i+1]},${data[i+2]})`));
                }
            }
        }
        initialGrainsCount = activeClustersCount = grains.length;
    }

    function triggerShockwave(x, y) {
        const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.6;
        const t0 = Date.now();
        function loop() {
            const prog = Math.min((Date.now()-t0) / V62.shockwaveDuration, 1);
            const ease = 1 - Math.pow(1-prog, 4);
            const r = ease * maxR;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mesh.update(x, y, r, prog);
            mesh.draw(snapshotImg);
            ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
            ctx.strokeStyle = `rgba(0,243,255,${0.5*(1-prog)})`;
            ctx.lineWidth = 12*(1-prog); ctx.stroke();
            if (prog < 0.25) drawSingularity(x, y, blackHoleScale*(1-prog/0.25));
            if (prog < 1) requestAnimationFrame(loop);
            else canvas.remove();
        }
        loop();
    }

    function runEntrance() {
        const tx = window.innerWidth/2, ty = window.innerHeight/2;
        let collapsed = false;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const total = activeClustersCount * V62.grainsPerCluster;
            for (const g of grains) {
                if (g.absorbed) continue;
                g.update(tx, ty);
                g.draw(total);
            }
            blackHoleScale = V62.blackHoleBaseScale + (V62.blackHoleMaxScale - V62.blackHoleBaseScale) * (1 - activeClustersCount / initialGrainsCount);
            if (activeClustersCount <= 0 && !collapsed) {
                collapsed = true;
                triggerShockwave(tx, ty);
                return;
            }
            drawSingularity(tx, ty, blackHoleScale);
            renderNoise();
            requestAnimationFrame(render);
        }
        render();
    }

    // ── PUBLIC API ────────────────────────────────────────────────────────────
    function ensureHtml2Canvas() {
        if (window.html2canvas) return Promise.resolve();
        return new Promise(res => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            s.onload = res;
            document.head.appendChild(s);
        });
    }

    window.transitionToPage = async function(url, e) {
        if (e && e.preventDefault) e.preventDefault();
        if (isExiting) return;
        isExiting = true;
        initCanvas();
        try {
            await ensureHtml2Canvas();
            const snap = await html2canvas(document.body, {
                scale: 0.4, backgroundColor: '#050508', useCORS: true,
                ignoreElements: el => el === canvas
            });
            // Store snapshot for V6.2 entrance on the next page
            sessionStorage.setItem(STORAGE_KEY, snap.toDataURL('image/jpeg', 0.8));
            // Play V4 exit animation
            runExit(url, snap);
        } catch(err) {
            window.location.href = url;
        }
    };

    async function checkEntrance() {
        const data = sessionStorage.getItem(STORAGE_KEY);
        if (!data) return;
        sessionStorage.removeItem(STORAGE_KEY);
        initCanvas();
        mesh.init();
        snapshotImg = new Image();
        snapshotImg.onload = () => {
            const off = document.createElement('canvas');
            off.width = snapshotImg.width; off.height = snapshotImg.height;
            off.getContext('2d').drawImage(snapshotImg, 0, 0);
            processSnapshot(off);
            runEntrance();
        };
        snapshotImg.src = data;
    }

    // Auto-intercept anchor links
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
