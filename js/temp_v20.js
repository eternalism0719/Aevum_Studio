/**
 * AINA VISUALS - V4 Abstract Soul Dust (INCOMING MODE)
 * Behavior: Click -> Immediate Redirect. Next Page -> Shatter (reveals content).
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
    canvas.id = 'dust-transition-v4';
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
    let snapshotImg = null;        // ?????    let pixelStride = 3;           // 蝮桀? 20% (??4 -> 3)
    let clusterStride = 5;         // ??蝮桀?隤踵甇仿脣偕撖?    let palette = ['#050508', '#00ffc8', '#ffffff', '#1a1a1a'];
    let maskStartTime = null;      // ?桃蔗撱園閮?
    const MASK_DELAY_MS = 250;     // ?桃蔗??摮?甇亙辣?莎?ms嚗?    let isBlackHole = false;       // 暺?璅∪???
    let mouseX = width / 2 || 0, mouseY = height / 2 || 0;
    
    // UI ?????(White Circle Fade/Scale)
    let suctionAlpha = 0, suctionScale = 0;
    let isFadingOut = false;
    let isExitAnim   = false;  // 暺?蝮桀?敺?皜豢?瘚桃???
    let exitAnimStart = 0;     // ?韏瑕??? (ms)

    // ??????雿 Palette ???桃蔗?芸?
    (function initStaticImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            snapshotImg = img; // ?湔雿輻?????粹蝵?            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            const pCtx = c.getContext('2d');
            pCtx.drawImage(img, 0, 0);
            const data = pCtx.getImageData(0, 0, c.width, c.height).data;
            const colors = [];
            for (let i = 0; i < data.length; i += 48) {
                if (data[i+3] > 120) colors.push(`rgb(${data[i]},${data[i+1]},${data[i+2]})`);
            }
            if (colors.length > 10) palette = colors;
        };
        // img.src = '../images/system_page.png'; // temporarily disabled to save 2.2MB
    })();

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    class DustCluster {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.ox = x; this.oy = y;
            this.triggerNoise = Math.random() * 200 - 100;
            const speedBase = Math.random() * 2.5 + 1.0; // ?撥?箇??漲
            // 撘琿◢?寥???嚗 頠豢????Y 頠訾?????+20%
            this.vx = speedBase * (6.6 + Math.random() * 6.0);
            this.vy = -(speedBase * (3.0 + Math.random() * 4.2));
            this.amplitude = Math.random() * 3 + 1;
            this.frequency = Math.random() * 0.05 + 0.02;
            this.phase = Math.random() * Math.PI * 2;
            this.life = 500 + Math.random() * 300; 
            this.particles = [];
            
            const pCount = (clusterStride * clusterStride) / 1.1;
            for (let i = 0; i < pCount; i++) {
                this.addParticle(
                    Math.random() * clusterStride * pixelStride,
                    Math.random() * clusterStride * pixelStride,
                    palette[Math.floor(Math.random() * palette.length)], 
                    Math.random() * 1000
                );
            }
        }
        addParticle(dx, dy, color, id) {
            this.particles.push({
                dx, dy, color, id,
                // per-particle ?函?瞍宏?漲嚗roup ??noise嚗?                nvx: (Math.random() - 0.5) * 1.5,   // 皜??嚗? 3.5嚗?                nvy: (Math.random() - 0.5) * 1.0,   // 皜??嚗? 2.5嚗?                speedMult: 0.2 + Math.random() * 0.5, // ?漲??嚗? 0.4??.6嚗?                // 蝝舐?雿宏
                lx: 0, ly: 0
            });
        }
        update(targetX, targetY, useSuction = false) {
            // ?蝛箸除敺格 (Turbulence)
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
            
            // 銝??餃側 (0.985)
            this.vx *= 0.985;
            this.vy *= 0.985;

            if (useSuction) {
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // 蝣啣曌?(???之)撠梁?交香鈭?                if (dist < 35) {
                    this.life = 0; 
                } else {
                    // ?撥?詨?????撠岷????????憭扳瘞游像
                    const force = Math.min(4.0, 6000 / (dist * dist + 500));
                    this.vx += (dx / dist) * force * 0.8;
                    this.vy += (dy / dist) * force * 1.3;

                    // 璈Ｗ?敶Ｘ?頧?(撌血撖?嚗 頠詨????漲敹恬?Y 頠詨????漲??                    const swirlAmt = Math.min(0.8, 300 / (dist + 50)); 
                    this.vx += (dy / dist) * swirlAmt * 1.8;
                    this.vy += -(dx / dist) * swirlAmt * 0.4;
                    
                    const suck = Math.min(4.0, 200 / (dist + 5));
                    this.vx += (dx / dist) * suck * 0.8;
                    this.vy += (dy / dist) * suck * 1.3;
                }
                
                // 憓?暺趙??(Viscosity)嚗???銝剖??拇???餃?頞之 (0.83 ~ 0.95)
                const drag = 0.83 + Math.max(0, Math.min(0.12, dist / 800));
                this.vx *= drag;
                this.vy *= drag;
            }

            this.x += this.vx; this.y += this.vy;
            this.phase += this.frequency;
            this.y += Math.sin(this.phase) * this.amplitude;
            this.life--;

            // ?箇?甇颱滿璈
            if (this.x < -100 || this.x > (window.innerWidth + 100) || 
                this.y < -100 || this.y > (window.innerHeight + 100)) {
                this.life = 0;
            }
        }
        draw(ctx, time, screenW, useSuction = false) {
            if (this.life <= 0) return;
            let alpha = 1.0;
            if (this.life < 40) alpha *= (this.life / 40);
            const fadeStart = screenW * 0.75;
            if (this.x > fadeStart) alpha *= Math.max(0, 1 - (this.x - fadeStart) / (screenW - fadeStart));
            
            // ??曌???摨阡撓??
            if (useSuction) {
                const distToMouse = Math.hypot(mouseX - this.x, mouseY - this.y);
                if (distToMouse < 150) {
                    alpha *= Math.max(0.0, (distToMouse - 35) / 115);
                }
            }
            
            if (alpha <= 0.01) return;

            // ?詨?挾嚗誑?漲? 4 ??撅支??箇?摮?撠?            if (useSuction) {
                const trailSteps = 4;
                const maxP       = Math.min(this.particles.length, 8); // ?? 8 憿?????                for (let ts = trailSteps; ts >= 1; ts--) {
                    const ta = alpha * (1 - ts / (trailSteps + 1)) * 0.40;
                    if (ta < 0.01) continue;
                    ctx.globalAlpha = ta;
                    const ox = -this.vx * ts * 1.8;  // ?漲???蝘?                    const oy = -this.vy * ts * 1.8;
                    const sz = pixelStride * (1 - ts * 0.14);
                    for (let pi = 0; pi < maxP; pi++) {
                        const p = this.particles[pi];
                        ctx.fillStyle = p.color;
                        ctx.fillRect(
                            this.x + p.dx + p.lx + ox,
                            this.y + p.dy + p.ly + oy + Math.sin(time + p.id) * 1.5,
                            sz, sz
                        );
                    }
                }
            }

            ctx.globalAlpha = alpha;
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                // 瘥?蝝舐? per-particle 瞍宏嚗?蝎???group ?折撓?嚗?                p.lx += p.nvx * p.speedMult;
                p.ly += p.nvy * p.speedMult;
                ctx.fillStyle = p.color;
                ctx.fillRect(
                    this.x + p.dx + p.lx,
                    this.y + p.dy + p.ly + Math.sin(time + p.id) * 1.5,
                    pixelStride, pixelStride
                );
            }
            ctx.globalAlpha = 1.0;
        }
    }

    // ?? 暺?璅∪?嚗??clusters ?扳???摮??????????????????????????

    function drawBlackHoleCursor(active = false) {
        // isFadingOut ??targetS 甇賊 ??蝮桅?瘨仃嚗lpha ?郊瘛∪
        const targetA = active && !isFadingOut ? 1.0 : 0.0;
        const targetS = active && !isFadingOut ? 1.0 : 0.0;  // 蝮桀??        suctionAlpha += (targetA - suctionAlpha) * 0.10;
        suctionScale += (targetS - suctionScale) * 0.07;     // scale 瘨仃?交嚗?閬箸鞊?

        if (suctionAlpha < 0.01) return;

        const t   = Date.now() * 0.001;
        const R   = 26 * suctionScale;
        const rng = R * 1.20;
        const mx  = mouseX, my = mouseY;

        // 璆萄??歲???踹? degenerate gradient crash嚗?        if (R < 0.5) { return; }

        ctx.save();

        // ?? 1. 憭惜?湔?餅? (corona) ???????????????????????????????
        const coronaR = R * 5.5;
        const corona  = ctx.createRadialGradient(mx, my, R * 0.4, mx, my, coronaR);
        corona.addColorStop(0,   `rgba(255, 150, 30,  ${0.22 * suctionAlpha})`);
        corona.addColorStop(0.3, `rgba(255, 80,  0,   ${0.10 * suctionAlpha})`);
        corona.addColorStop(0.7, `rgba(100, 30,  0,   ${0.04 * suctionAlpha})`);
        corona.addColorStop(1,   'rgba(0, 0, 0, 0)');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(mx, my, coronaR, 0, Math.PI * 2);
        ctx.fill();

        // ?? 2. 瘨脫??惇??????????????????????????????????????????
        // 48 畾菟挾蝜芾ˊ嚗?蝯?sine 瘜Ｙ??芋?祆??漁暺??惇?黎
        const segs  = 48;
        const step  = (Math.PI * 2) / segs;
        const tOrb  = t * 1.5;   // 銝颱漁暺?銵漲
        const tShim = t * 3.2;   // ?惇???漲

        for (let layer = 0; layer < 3; layer++) {
            const rr    = rng + layer * 2.2;
            const baseW = 2.8 - layer * 0.65;
            const layerA = (1.0 - layer * 0.26) * suctionAlpha;

            for (let s = 0; s < segs; s++) {
                const angle = s * step;

                // 銝颱漁暺?1 憿?暺?銵??餃蔣??
                const primary = (Math.sin(angle - tOrb) + 1) * 0.5;
                // 敹恍?撅祇???3 憿?蝭暺??蔣??
                const shimmer = (Math.sin(angle * 3.0 + tShim) + 1) * 0.5;
                // 蝺拇?湧??澆嚗iscous liquid嚗?                const breath  = (Math.cos(angle * 0.5 - t * 0.25) + 1) * 0.5;

                const b = primary * 0.55 + shimmer * 0.28 + breath * 0.17;

                // 瘨脫??惇?脰?嚗??? ??????鈭桃??                const cr = Math.round(175 + b * 80);
                const cg = Math.round(95  + b * 148);
                const cb = Math.round(8   + b * 192);
                const ca = (0.30 + b * 0.70) * layerA;

                ctx.strokeStyle = `rgba(${cr},${cg},${cb},${ca})`;
                ctx.lineWidth   = baseW * (0.35 + b * 1.0);
                ctx.globalAlpha = 1.0;
                ctx.beginPath();
                ctx.arc(mx, my, rr, angle, angle + step + 0.02); // 敺桀? overlap 瘨蝮恍?
                ctx.stroke();
            }
        }

        // ?? 3. 憟? (singularity) ???????腹 ???????????????????
        // radialGradient ?芸葆 alpha 瞍詨惜嚗??斤′??拇?
        const singRadius = R * 1.12;  // 敺桅?撱嗡撓?亙?摮摨鋆賡楛摨?        const singGrad   = ctx.createRadialGradient(mx, my, 0, mx, my, singRadius);
        singGrad.addColorStop(0,    `rgba(0,  0,  0,  ${suctionAlpha})`);
        singGrad.addColorStop(0.68, `rgba(2,  7,  5,  ${suctionAlpha})`);
        singGrad.addColorStop(0.82, `rgba(8,  22, 16, ${0.90 * suctionAlpha})`); // ??瞍貊
        singGrad.addColorStop(0.92, `rgba(14, 36, 26, ${0.52 * suctionAlpha})`);
        singGrad.addColorStop(1,    `rgba(20, 48, 34, 0)`);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle   = singGrad;
        ctx.beginPath();
        ctx.arc(mx, my, singRadius, 0, Math.PI * 2);
        ctx.fill();

        // ?? 4. ?批???嚗nner photon flash嚗??????????????????
        const pulse     = 0.5 + Math.sin(t * 3.5) * 0.15;
        const flashGrad = ctx.createRadialGradient(mx, my, R * 0.4, mx, my, R);
        flashGrad.addColorStop(0,   'rgba(200, 240, 255, 0.0)');
        flashGrad.addColorStop(0.7, `rgba(180, 220, 255, ${0.09 * pulse * suctionAlpha})`);
        flashGrad.addColorStop(1,   `rgba(100, 180, 255, ${0.24 * pulse * suctionAlpha})`);
        ctx.fillStyle   = flashGrad;
        ctx.beginPath();
        ctx.arc(mx, my, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.globalAlpha = 1.0;
    }

    // ?? ??湔虜璅筑?曉????????????????????????????????????????????????
    // 暺?蝮桀?敺??賡?敺?0 ?游撐?單虜璅之撠?璈蝟餌絞皜豢??踹??
    const EXIT_ANIM_MS = 380;

    function drawCursorGrow() {
        const elapsed  = Date.now() - exitAnimStart;
        const progress = Math.min(1.0, elapsed / EXIT_ANIM_MS);
        const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out

        ctx.clearRect(0, 0, width, height);

        const dotR = eased * 5.5;
        if (dotR > 0.1) {
            const dotGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, dotR);
            dotGrad.addColorStop(0, `rgba(255, 255, 255, ${eased * 0.85})`);
            dotGrad.addColorStop(1, 'rgba(220, 220, 220, 0)');
            ctx.fillStyle = dotGrad;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, dotR, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        if (progress >= 1.0) {
            isExitAnim             = false;
            isBlackHole            = false;
            canvas.style.display   = 'none';
            document.body.style.cursor = '';
            if (nextUrl) window.location.href = nextUrl;
        }
    }

    function startBlackHoleMode() {
        if (clusters.length === 0) { canvas.style.display = 'none'; return; }
        isBlackHole = true;
        isFadingOut = false;
        canvas.style.display = 'block';
        document.body.style.cursor = 'none';
        renderBlackHole();
    }

    function renderBlackHole() {
        if (!isBlackHole) return;
        requestAnimationFrame(renderBlackHole);
        ctx.clearRect(0, 0, width, height);

        // 暺?蝮桀?敺??剜撠暺撘萄??怠?頝唾?嚗?虜璅??橘?
        if (isExitAnim) { drawCursorGrow(); return; }

        // ?菜葫?臬?詨?
        if (clusters.length === 0 && !isFadingOut) {
            isFadingOut = true;
        }

        drawBlackHoleCursor(true);
        const timeFactor = Date.now() * 0.003;

        for (let i = clusters.length - 1; i >= 0; i--) {
            const c = clusters[i];
            c.update(mouseX, mouseY, true);
            c.draw(ctx, timeFactor, width * 10, true);
            if (c.life <= 0) clusters.splice(i, 1);
        }

        // alpha ??scale ?質隅餈敺??虜璅筑?曉???        if (isFadingOut && suctionAlpha < 0.02 && suctionScale < 0.04) {
            isExitAnim    = true;
            exitAnimStart = Date.now();
        }
    }
    // ?? 蝯曹?????Noise 瞍?瘜?????????????????????????????????

    function getFrontierNoise(x, y, time, progress) {
        // 隤蹂??餌?嚗征??(0.01 -> 0.005), ?? (1.0 -> 0.3)
        // ??霈??脩???游楊憭抒?瘜Ｙ?嚗?蝘餃??渡楨?Ｕ瘝帘
        const noiseBase = Math.sin(x * 0.005 + y * 0.005 + time * 0.3) * 60;
        const highFreq = Math.cos(x * 0.008 - y * 0.006 + time * 0.4) * 20;
        const jitterScale = (1.0 + progress * 1.5); // ???渡?????        return (noiseBase + highFreq) * jitterScale;
    }

    function extractPalette(capturedCanvas) {
        const pCtx = capturedCanvas.getContext('2d');
        const pData = pCtx.getImageData(0, 0, capturedCanvas.width, capturedCanvas.height).data;
        const colors = [];
        for (let i = 0; i < pData.length; i += 60) {
            if (pData[i+3] > 100) colors.push(`rgb(${pData[i]},${pData[i+1]},${pData[i+2]})`);
        }
        if (colors.length > 5) palette = colors;
    }

    function startDisintegration() {
        isAnimating = true;
        currentCutoff = 0;
        maskStartTime = null; // ?蔭撱園閮???        const cols = Math.ceil(width / (pixelStride * clusterStride));
        const rows = Math.ceil(height / (pixelStride * clusterStride));
        clusterStatusMap = new Uint8Array(cols * rows);
        clusters = [];
        canvas.style.pointerEvents = 'all';
        ctx.clearRect(0, 0, width, height);
        renderShatter();
    }

    function renderShatter() {
        if (!isAnimating) return;
        requestAnimationFrame(renderShatter);
        ctx.clearRect(0, 0, width, height);

        drawBlackHoleCursor(true);

        const now = Date.now();
        if (maskStartTime === null) maskStartTime = now;
        const elapsed = now - maskStartTime;

        if (elapsed < MASK_DELAY_MS) {
            if (snapshotImg) ctx.drawImage(snapshotImg, 0, 0, width, height);
            return;
        }

        const step = pixelStride * clusterStride;
        const timeFactor = now * 0.003;
        const progress = Math.min(1.0, currentCutoff / (width + height + 500));
        const sweepSpeed = 3.6 + progress * progress * 54; // ?湧? +20%
        currentCutoff += sweepSpeed;

        const cols = Math.ceil(width / step);
        const rows = Math.ceil(height / step);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const mapIdx = r * cols + c;
                if (clusterStatusMap[mapIdx] === 0) {
                    const x = c * step;
                    const y = r * step;
                    const score = x + (height - y);
                    const triggerOffset = getFrontierNoise(x, y, timeFactor, progress);
                    if (score - triggerOffset < currentCutoff) {
                        const cluster = new DustCluster(x, y);
                        cluster.vx += progress * 4;
                        clusters.push(cluster);
                        clusterStatusMap[mapIdx] = 1;
                    }
                }
            }
        }

        // MASK REVEAL: ?????脤?蝺?(Pixelated Edge)
        // ?芣? frontier 隞?Ｗ??扳??蝜芾ˊ敹怎?桃蔗嚗?翰?批???憛急遛?函撣???
        const k = currentCutoff;
        const frontierLeft = k - height; // frontier 撌虫?閫? X 摨扳?
        if (frontierLeft < width) {
            ctx.save();
            ctx.beginPath();
            const segments = 12;

            ctx.moveTo(k - height - 200, 0);
            for (let i = 0; i <= segments; i++) {
                const segProgress = i / segments;
                const segmentY = height * segProgress;
                const segmentX = k - (height - segmentY);
                const noise = getFrontierNoise(segmentX, segmentY, timeFactor, progress);
                ctx.lineTo(segmentX + noise, segmentY);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(width, 0);
            ctx.closePath();
            ctx.clip();

            if (snapshotImg) {
                ctx.drawImage(snapshotImg, 0, 0, width, height);
            } else {
                ctx.fillStyle = '#050508';
                ctx.fillRect(-width, -height, width * 3, height * 3);
            }
            ctx.restore();

            // 蝜芾ˊ????蝺??閬箄???(Pixel Blocks along frontier)
            for (let i = 0; i <= segments; i += 2) {
                const segProgress = i / segments;
                const py = height * segProgress;
                const px = k - (height - py);
                const noise = getFrontierNoise(px, py, timeFactor, progress);
                ctx.fillStyle = palette[i % palette.length];
                const size = 3 + Math.random() * 8;
                ctx.fillRect(px + noise - size/2, py - size/2, size, size);
            }
        }

        for (let i = clusters.length - 1; i >= 0; i--) {
            const c = clusters[i];
            // [??芸?]嚗蝵?2/3 敺???伐?銝血??UI ???            const useSuction = (progress > 0.66);
            c.update(mouseX, mouseY, useSuction);
            c.draw(ctx, timeFactor, width, useSuction);
            if (c.life <= 0) clusters.splice(i, 1);
        }

        if (currentCutoff > width + height + 1000) {
            isAnimating = false;
            startBlackHoleMode();
        }
    }

    let nextUrl = null;

    window.transitionToPage = function(targetUrl, e) {
        if (e) e.preventDefault();
        if (isAnimating || isBlackHole) return; // ?銝剖蕭?仿?銴???
        nextUrl = targetUrl;
        canvas.style.display = 'block';

        // 蝡?刻??臭誑 iframe ???圈??ｇ?霈??急???歇?典?銝??末
        // ?嗅??怎???撠撟曆??祇?摰?嚗?皞歇敹怠?嚗?閬死銝停?胯?銝??        if (!document.getElementById('transition-preload-iframe')) {
            const preloadIframe = document.createElement('iframe');
            preloadIframe.id = 'transition-preload-iframe';
            preloadIframe.src = targetUrl;
            Object.assign(preloadIframe.style, {
                position: 'fixed', top: '0', left: '0',
                width: '100%', height: '100%',
                border: 'none',
                zIndex: String(parseInt(canvas.style.zIndex || '999999') - 1),
                pointerEvents: 'none'
            });
            document.body.appendChild(preloadIframe);
        }

        // ??蝣???游???        if (snapshotImg && snapshotImg.complete) {
            ctx.drawImage(snapshotImg, 0, 0, width, height);
            startDisintegration();
        } else {
            // 憒???撠 Ready嚗??湔暺?蝣?
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, width, height);
            startDisintegration();
        }
    };

    // ????蝬脣???<a> ???嚗?摰?渲??    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if(anchor.hostname === window.location.hostname && href && !href.startsWith('#') && !href.startsWith('mailto:')) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    transitionToPage(this.href, e);
                });
            }
        });
    });
})();
