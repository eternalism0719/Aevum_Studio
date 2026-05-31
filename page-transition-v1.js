/**
 * AINA VISUALS - Optimized Clustered Physics Particle Transition
 * Features: 2x2 Physics Clusters + Individual Micro-Jitter for High-Fidelity 60FPS
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
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        zIndex: '999999', pointerEvents: 'none'
    });
    document.documentElement.appendChild(canvas);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let width, height;
    let clusters = []; // Group of particles
    let isAnimating = false;
    let currentCutoff = 0; 
    let pixelStride = 2; // Reduced to 2px for even finer sand particles
    let clusterStride = 5; // 5x5 clusters (25 particles per cluster)
    let snapshotImg = null;

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
            this.x = x; 
            this.y = y; 
            this.ox = x;
            this.oy = y;
            this.vx = 0;
            this.vy = 0;
            this.active = false;
            this.particles = []; 
        }
        
        addParticle(offsetX, offsetY, color, id) {
            this.particles.push({ offsetX, offsetY, color, id });
        }
        
        update(time) {
            if (!this.active) return;
            
            // Macro Wind Physics (Flow Field)
            const noise = Math.sin(this.ox * 0.005 + time) + Math.cos(this.oy * 0.008 - time * 0.5); 
            const targetVx = 15 + Math.sin(noise) * 10;
            const targetVy = Math.cos(noise) * 8;
            
            this.vx += (targetVx - this.vx) * 0.08;
            this.vy += (targetVy - this.vy) * 0.08;
            
            this.x += this.vx;
            this.y += this.vy;
        }

        draw(ctx, time) {
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                
                // DUAL-LAYER JITTER NOISE (User Request)
                // Layer 1: High-freq "Shiver" (Wind friction)
                const s1 = Math.sin(time * 8 + p.id);
                const c1 = Math.cos(time * 6 - p.id);
                // Layer 2: Low-freq "Undulation" (Air turbulence)
                const s2 = Math.sin(time * 2 + p.id * 0.5);
                const c2 = Math.cos(time * 1.5 + p.id * 0.3);
                
                const jitterX = s1 * 1.5 + s2 * 4; 
                const jitterY = c1 * 2 + c2 * 5;
                
                ctx.fillStyle = p.color;
                ctx.fillRect(this.x + p.offsetX + jitterX, this.y + p.offsetY + jitterY, pixelStride, pixelStride);
            }
        }
    }

    function startDisintegration() {
        isAnimating = true;
        currentCutoff = 0; 
        
        ctx.drawImage(snapshotImg, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        clusters = [];
        
        let particleId = 0;
        
        // Scan in 5x5 grid (Macro Clusters)
        for (let y = 0; y < height; y += pixelStride * clusterStride) {
            for (let x = 0; x < width; x += pixelStride * clusterStride) {
                
                const cluster = new DustCluster(x, y);
                let hasVisiblePixels = false;
                
                // Sub-scan inside the 5x5 cluster area
                for (let sy = 0; sy < clusterStride; sy++) {
                    for (let sx = 0; sx < clusterStride; sx++) {
                        const px = x + sx * pixelStride;
                        const py = y + sy * pixelStride;
                        
                        if (px >= width || py >= height) continue;
                        
                        const idx = (py * width + px) * 4;
                        const r = data[idx];
                        const g = data[idx+1];
                        const b = data[idx+2];
                        const a = data[idx+3];
                        
                        if (a > 20 && (r + g + b) > 30) {
                            cluster.addParticle(sx * pixelStride, sy * pixelStride, `rgba(${r},${g},${b},1)`, particleId++);
                            hasVisiblePixels = true;
                        }
                    }
                }
                
                if (hasVisiblePixels) {
                    clusters.push(cluster);
                }
            }
        }
        
        ctx.clearRect(0, 0, width, height);
        renderShatter();
    }

    function renderShatter() {
        if (!isAnimating) return;
        requestAnimationFrame(renderShatter);
        ctx.clearRect(0, 0, width, height);

        currentCutoff += 20; 
        const time = Date.now() * 0.002;

        // Masking logic: Stationary portion of image
        ctx.save();
        ctx.beginPath();
        ctx.rect(currentCutoff, 0, width - currentCutoff, height);
        ctx.clip();
        ctx.drawImage(snapshotImg, 0, 0, width, height);
        ctx.restore();

        // Flying Clusters
        for (let i = 0; i < clusters.length; i++) {
            const c = clusters[i];
            if (!c.active && currentCutoff > c.ox) c.active = true;
            
            if (c.active) {
                c.update(time);
                // Selective cull if very far off right
                if (c.x < width + 150) {
                    c.draw(ctx, time);
                }
            }
        }

        if (currentCutoff > width + 1500) {
            isAnimating = false;
            canvas.style.display = 'none';
        }
    }

    window.transitionToPage = function(targetUrl, e) {
        if (isAnimating) return;
        
        canvas.style.pointerEvents = 'all';
        ctx.fillStyle = 'rgba(5, 5, 8, 0.5)';
        ctx.fillRect(0, 0, width, height);
        
        const navFallback = setTimeout(() => { window.location.href = targetUrl; }, 2500);

        loadHtml2Canvas(() => {
            html2canvas(document.body, { 
                backgroundColor: '#050508', 
                scale: 0.5, 
                useCORS: true,
                allowTaint: true,
                ignoreElements: (el) => el.id === 'dust-transition'
            }).then(capturedCanvas => {
                const dataUrl = capturedCanvas.toDataURL('image/jpeg', 0.8);
                try {
                    sessionStorage.setItem('pt_snapshot', dataUrl);
                    clearTimeout(navFallback);
                    window.location.href = targetUrl;
                } catch (e) {
                    window.location.href = targetUrl; 
                }
            }).catch(() => { window.location.href = targetUrl; });
        });
    };

    function checkEntrance() {
        const storedImage = sessionStorage.getItem('pt_snapshot');
        if (storedImage) {
            sessionStorage.removeItem('pt_snapshot');
            canvas.style.pointerEvents = 'all';
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, width, height);
            
            snapshotImg = new Image();
            snapshotImg.onload = () => startDisintegration();
            snapshotImg.src = storedImage;
        }
    }

    checkEntrance();
    loadHtml2Canvas(() => console.log('[Transition] Clustered Engine Ready.'));
})();
