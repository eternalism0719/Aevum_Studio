/**
 * AINA VISUALS - Jagged Noise Sand Engine
 * Features: Fractal Masking, Randomized Triggering (Musgrave Style), and Lingering Dust.
 */

(function() {
    function loadHtml2Canvas(callback) {
        if (window.html2canvas) { callback(); return; }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'dust-transition';
    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        zIndex: '999999', pointerEvents: 'none'
    });
    document.documentElement.appendChild(canvas);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let width, height;
    let clusters = []; 
    let isAnimating = false;
    let currentCutoff = 0; 
    let pixelStride = 4; 
    let clusterStride = 4;
    let snapshotImg = null;
    let imgDataBuffer = null;
    let clusterStatusMap = null;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    class DustCluster {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.ox = x; this.oy = y;
            
            // MUSGRAVE-LIKE JITTER: Stagger the shatter time
            this.triggerNoise = Math.random() * 160 - 80;
            
            // DYNAMIC PROPULSION: Stronger vx for rightward bias
            const speedBase = Math.random() * 20 + 5;
            this.vx = speedBase * 1.5; // Bias towards right
            this.vy = -(speedBase * 0.85); 
            
            this.amplitude = Math.random() * 3 + 1;
            this.frequency = Math.random() * 0.1 + 0.04;
            this.phase = Math.random() * Math.PI * 2;
            
            // LINGER: Slow particles persist
            this.life = Math.random() * 80 + (60 / (speedBase * 0.08)); 
            this.particles = [];
        }
        addParticle(dx, dy, color, id) { this.particles.push({ dx, dy, color, id }); }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.phase += this.frequency;
            this.y += Math.sin(this.phase) * this.amplitude;
            this.life--;
        }
        draw(ctx, time, screenW) {
            if (this.life <= 0) return;
            let alpha = 1.0;
            if (this.life < 30) alpha *= (this.life / 30);
            const fadeStart = screenW * 0.75;
            if (this.x > fadeStart) alpha *= Math.max(0, 1 - (this.x - fadeStart) / (screenW - fadeStart));
            if (alpha <= 0.01) return;
            
            ctx.globalAlpha = alpha;
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                ctx.fillStyle = p.color;
                // Micro-swirl
                const s = Math.sin(time + p.id) * 2;
                ctx.fillRect(this.x + p.dx + s, this.y + p.dy + s, pixelStride, pixelStride);
            }
            ctx.globalAlpha = 1.0;
        }
    }

    function startDisintegration() {
        isAnimating = true;
        currentCutoff = -100; // Small buffer for noise
        ctx.drawImage(snapshotImg, 0, 0, width, height);
        imgDataBuffer = ctx.getImageData(0, 0, width, height).data;
        
        const cols = Math.ceil(width / (pixelStride * clusterStride));
        const rows = Math.ceil(height / (pixelStride * clusterStride));
        clusterStatusMap = new Uint8Array(cols * rows);
        
        clusters = [];
        ctx.clearRect(0, 0, width, height);
        renderShatter();
    }

    function renderShatter() {
        if (!isAnimating) return;
        requestAnimationFrame(renderShatter);
        ctx.clearRect(0, 0, width, height);

        const step = pixelStride * clusterStride;
        currentCutoff += 25; 
        const timeFactor = Date.now() * 0.003;
        
        // Progress (0 to 1) for scaling irregularity
        const progress = Math.min(1.0, currentCutoff / (width + height));
        const noiseScale = 0.5 + progress * 1.5; // Starts at 0.5x, peaks at 2x noise

        // 1. JITTERED TRIGGER GENERATION
        const cols = Math.ceil(width / step);
        const rows = Math.ceil(height / step);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const mapIdx = r * cols + c;
                if (clusterStatusMap[mapIdx] === 0) {
                    const x = c * step;
                    const y = r * step;
                    const score = x + (height - y); 
                    
                    // DYNAMIC JITTER: Increases as you go further right
                    const triggerOffset = ((Math.sin(x*0.01) * 40) + (Math.cos(y*0.01) * 40)) * noiseScale;
                    if (score + triggerOffset < currentCutoff) {
                        const cluster = new DustCluster(x, y);
                        // Randomized initial boost based on progress
                        cluster.vx += progress * 10;
                        let hasPixels = false;
                        for (let sy = 0; sy < clusterStride; sy++) {
                            for (let sx = 0; sx < clusterStride; sx++) {
                                const px = x + sx * pixelStride;
                                const py = y + sy * pixelStride;
                                if (px >= width || py >= height) continue;
                                const idx = (py * width + px) * 4;
                                if (imgDataBuffer[idx+3] > 20) {
                                    cluster.addParticle(sx * pixelStride, sy * pixelStride, `rgb(${imgDataBuffer[idx]},${imgDataBuffer[idx+1]},${imgDataBuffer[idx+2]})`, px+py);
                                    hasPixels = true;
                                }
                            }
                        }
                        if (hasPixels) clusters.push(cluster);
                        clusterStatusMap[mapIdx] = 1;
                    }
                }
            }
        }

        // 2. JAGGED FRACTAL MASKING ( / slant)
        ctx.save();
        ctx.beginPath();
        const k = currentCutoff;
        
        // Use multiple segments to hide the straight line
        const segments = 12;
        ctx.moveTo(k, 0); // Starting Top-Left of the reveal line
        for (let i = 1; i <= segments; i++) {
            const segProgress = i / segments;
            const segmentY = height * segProgress;
            const segmentX = k + segmentY;
            // SCALE JITTER: More fractal noise as the reveal progresses
            const jitterAmt = (60 + progress * 140); 
            const noise = (Math.sin(timeFactor * 2.5 + i) * jitterAmt) + (Math.cos(i * 2) * jitterAmt * 0.5);
            ctx.lineTo(segmentX + noise, segmentY);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(width, 0);
        ctx.closePath();
        ctx.clip();
        
        if (snapshotImg) ctx.drawImage(snapshotImg, 0, 0, width, height);
        ctx.restore();

        // 3. UPDATE & RENDER
        for (let i = clusters.length - 1; i >= 0; i--) {
            const c = clusters[i];
            c.update();
            c.draw(ctx, timeFactor, width);
            if (c.life <= 0) clusters.splice(i, 1);
        }

        if (currentCutoff > width + height + 500) {
            isAnimating = false;
            canvas.style.display = 'none';
        }
    }

    window.transitionToPage = function(targetUrl, e) {
        if (isAnimating) return;
        canvas.style.pointerEvents = 'all';
        ctx.fillStyle = 'rgba(5, 5, 8, 0.45)';
        ctx.fillRect(0, 0, width, height);
        const fallback = setTimeout(() => { window.location.href = targetUrl; }, 3500);

        setTimeout(() => {
            loadHtml2Canvas(async () => {
                try {
                const capturedCanvas = await html2canvas(document.body, { 
                    backgroundColor: '#050508', scale: 1, logging: false, useCORS: true, allowTaint: true,
                    ignoreElements: (el) => el.id === 'dust-transition'
                });
                const dataUrl = capturedCanvas.toDataURL('image/jpeg', 0.8);
                sessionStorage.setItem('pt_snapshot', dataUrl);
                clearTimeout(fallback);
                window.location.href = targetUrl;
                } catch (e) { window.location.href = targetUrl; }
            });
        }, 60);
    };

    function checkEntrance() {
        const storedImage = sessionStorage.getItem('pt_snapshot');
        if (storedImage) {
            sessionStorage.removeItem('pt_snapshot');
            canvas.style.pointerEvents = 'all';
            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, width, height);
            snapshotImg = new Image();
            snapshotImg.onload = () => startDisintegration();
            snapshotImg.src = storedImage;
        }
    }
    checkEntrance();
})();
