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
    let snapshotImg = null;        // ?????
    let pixelStride = 3;           // 蝮桀? 20% (??4 -> 3)
    let clusterStride = 5;         // ??蝮桀?隤踵甇仿脣偕撖?
    let palette = ['#050508', '#00ffc8', '#ffffff', '#1a1a1a'];
    let maskStartTime = null;      // ?桃蔗撱園閮?
    const MASK_DELAY_MS = 250;     // ?桃蔗??摮?甇亙辣?莎?ms嚗?
    let isBlackHole = false;       // 暺?璅∪???
    let mouseX = 0, mouseY = 0;  // ??resize() 銋??身摰??踹? width ??undefined
    
    // UI ?????(White Circle Fade/Scale)
    let suctionAlpha = 0, suctionScale = 0;
    let isFadingOut = false;
    let isExitAnim    = false;
    let exitAnimStart = 0;
    let exitCursorX   = 0;
    let exitCursorY   = 0;
    // 暺??靽嚗?摮?嗉?憭?憭改??詨?敹恍葬??
    let bhGrowth      = 1.0;
    let totalClusters = 1;
    let collapseStartTime = 0;

    // --- WebGL Black Hole Cursor Buffer ---
    const bhGLCanvas = document.createElement('canvas');
    bhGLCanvas.width = 800; bhGLCanvas.height = 800;
    const gl = bhGLCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    let bhProgram = null, uTimeLoc, uAlphaLoc, uScaleLoc;
    let bhCurrentX = 0, bhCurrentY = 0;

    if (gl) {
        const vsSource = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                v_texCoord = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
        const fsSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform float u_time;
            uniform float u_alpha;
            uniform float u_scale;
            #define NUM_OCTAVES 5
            vec2 random2(vec2 st) {
                st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
                return -1.0 + 2.0 * fract(sin(st) * 43758.5453123 * 0.7897);
            }
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                               dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                           mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                               dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
            }
            float fbm(vec2 x) {
                float v = 0.0; float a = 0.5;
                vec2 shift = vec2(100.0);
                mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
                for (int i = 0; i < NUM_OCTAVES; ++i) {
                    v += a * noise(x);
                    x = rot * x * 2.0 + shift;
                    a *= 0.5;
                }
                return v;
            }
            mat2 rotate(float angle) {
                float c = cos(angle); float s = sin(angle);
                return mat2(c, -s, s, c);
            }
            void main() {
                // 甇???漣璅頂蝯?
                vec2 uv = (v_texCoord - 0.5) * 2.0;
                float dist = length(uv) / max(0.01, u_scale);
                
                // 蝬剜?敺桀?撠箏站 (bhRadius 0.054)
                float bhRadius = 0.054; 
                
                // 蝬剜?閬死蝛拙? (銝???
                float slowTime = u_time * 0.2; 
                float n = fbm(uv * 5.0 * rotate(slowTime)) * 0.4 + 1.0; 
                
                // ?脰矽敺株矽嚗像銵⊥??脰?? (蝔凝憓?蝬??嚗??曄?璈?
                vec3 col = vec3(smoothstep(0.12, 0.0, dist - bhRadius)) * vec3(1.0, 0.58, 0.12);
                col += smoothstep(0.08, 0.0, dist - bhRadius) * vec3(1.0, 0.35, 0.05); 
                
                col *= smoothstep(bhRadius, bhRadius + 0.01, dist) * n; 
                col *= fbm((uv + 1.0 / (dist + bhRadius)) * 1.5 * (dist - bhRadius) * rotate(slowTime * 0.5)) * 0.3 + 1.0;
                
                float edgeFade = 1.0 - smoothstep(0.2 * u_scale, 0.35 * u_scale, length(uv));
                
                // 蝣箔?暺??詨?銝?嚗?憭???銋?摰??
                //?詨????(dist < bhRadius) alpha ??1.0嚗??典??寞??撥摨?(length(col)) 瘙箏?
                float finalAlpha = max(smoothstep(bhRadius + 0.01, bhRadius, dist), length(col)) * edgeFade * u_alpha;
                gl_FragColor = vec4(col, finalAlpha);
            }
        `;

        function createShader(gl, type, source) {
            const s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            return s;
        }

        bhProgram = gl.createProgram();
        gl.attachShader(bhProgram, createShader(gl, gl.VERTEX_SHADER, vsSource));
        gl.attachShader(bhProgram, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(bhProgram);
        gl.useProgram(bhProgram);

        const vertices = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(bhProgram, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        uTimeLoc = gl.getUniformLocation(bhProgram, 'u_time');
        uAlphaLoc = gl.getUniformLocation(bhProgram, 'u_alpha');
        uScaleLoc = gl.getUniformLocation(bhProgram, 'u_scale');
    }


    // ??????雿 Palette ???桃蔗?芸?
    (function initStaticImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            snapshotImg = img; // ?湔雿輻?????粹蝵?
            const c = document.createElement('canvas');
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
        img.src = '../images/system_page.png';
    })();

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();
    mouseX = width / 2;   // resize() 敺?width 撌脩Ⅱ摰?銝剖?????
    mouseY = height / 2;
    bhCurrentX = mouseX;
    bhCurrentY = mouseY;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    class DustCluster {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.ox = x; this.oy = y;
            this.triggerNoise = Math.random() * 200 - 100;
            const speedBase = Math.random() * 1.5 + 1.0; // 蝔凝?矽???漲
            // 敺桀凝?矽?喳?憸典?嚗?蝎??Ｙ????＊?寞???銝?摨?
            this.vx = speedBase * (3.5 + Math.random() * 4.0);
            this.vy = -(speedBase * (2.0 + Math.random() * 3.0));
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
            // ??芸?嚗?舀???暺蝎?嚗? 30% 璈??湔銝???
            const rgbMatch = typeof color === 'string' ? color.match(/\d+/g) : null;
            if (rgbMatch && rgbMatch.length >= 3) {
                const lum = rgbMatch[0] * 0.299 + rgbMatch[1] * 0.587 + rgbMatch[2] * 0.114;
                if (lum < 40 && Math.random() < 0.90) { // ?芷 90% ???脩?摮?
                    return; 
                }
            }

            this.particles.push({
                dx, dy, color, id,
                // per-particle ?函?瞍宏?漲嚗roup ??noise嚗?
                nvx: (Math.random() - 0.5) * 1.5,   // 皜??嚗? 3.5嚗?
                nvy: (Math.random() - 0.5) * 1.0,   // 皜??嚗? 2.5嚗?
                speedMult: 0.2 + Math.random() * 0.5, // ?漲??嚗? 0.4??.6嚗?
                // 蝝舐?雿宏
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

                if (dist < 35) {
                    this.life = 0; // 蝣啣皜豢?蝭??香鈭?
                } else if (this.x < -200 || this.x > canvas.width + 200 || this.y < -200 || this.y > canvas.height + 200) {
                    this.life = 0; // ?拙?恍??摮?交香鈭?
                } else {
                    // 甈?瞍貉?嚗?????頧??批????豢
                    const normalizedDist = Math.max(0, Math.min(1.0, dist / 1200));
                    let swirlWeight  = Math.pow(normalizedDist, 0.8);  
                    let radialWeight = 1.0 - swirlWeight;              
                    
                    // 蝚砌??挾 (0% ~ 65%)嚗凝撘勗?敹?嚗蜓??頧?
                    let forceMag = 1.5 + Math.pow(radialWeight, 2) * 8.0;
                    let baseGravity = 300 / (dist + 50); // 憭批???蝚砌??挾??嗅?
                    let currentTiltY = 0.35; // 2.5D 閬死?像????

                    // 蝚砌??挾?葬嚗 65% 蝎?鋡怠?嗅?嚗?孛?潭????嗆?
                    const absorbed = 1 - clusters.length / totalClusters;
                    if (absorbed > 0.65) {
                        if (collapseStartTime === 0) collapseStartTime = Date.now();
                        const t = (Date.now() - collapseStartTime) / 1000.0; // ?葬蝬?蝘

                        swirlWeight = 0.0;
                        radialWeight = 1.0;
                        currentTiltY = 1.0; // ?葬??瘨?Y 頠詨?蝮殷?霈?摮蝺???璅葉敹?

                        // Slow motion ???
                        if (t < 0.40) {
                            // ??0.40 蝘?瘝??????芣?敺桀摹???典? (?湧???皛舐征??
                            forceMag = 0.0; 
                            baseGravity = -20 / (dist + 50); // 撠??典?????
                        } else {
                            // 0.40 蝘?嚗??批??????貊??曉之
                            const progress = t - 0.40;
                            forceMag = 2.0 + 10.0 * progress; 
                            // ?刻???鈭活?寞憭改?銝??敺嚗敺????
                            baseGravity = (40 + 1000 * Math.pow(progress, 2)) / (dist + 50); 
                        }
                    }

                    const invDist = 1 / dist;
                    const nx = dx * invDist;
                    const ny = dy * invDist;
                    const tx = -ny, ty = nx;

                    // 瘛瑕??孵?
                    const dirX = tx * swirlWeight + nx * radialWeight;
                    const dirY = (ty * swirlWeight + ny * radialWeight) * currentTiltY;

                    this.vx += dirX * forceMag;
                    this.vy += dirY * forceMag;

                    this.vx += nx * baseGravity;
                    this.vy += ny * baseGravity * currentTiltY;
                }

                const drag = 0.86 + Math.min(0.10, dist / 1200);
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

            // ?詨?挾嚗誑?漲? 4 ??撅支??箇?摮?撠?
            if (useSuction) {
                const trailSteps = 4;
                const maxP       = Math.min(this.particles.length, 8); // ?? 8 憿?????
                for (let ts = trailSteps; ts >= 1; ts--) {
                    const ta = alpha * (1 - ts / (trailSteps + 1)) * 0.40;
                    if (ta < 0.01) continue;
                    ctx.globalAlpha = ta;
                    const ox = -this.vx * ts * 1.8;  // ?漲???蝘?
                    const oy = -this.vy * ts * 1.8;
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
                // 瘥?蝝舐? per-particle 瞍宏嚗?蝎???group ?折撓?嚗?
                p.lx += p.nvx * p.speedMult;
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
        // ?湔?????
        const targetA = active && !isFadingOut ? 1.0 : 0.0;
        const targetS = active && !isFadingOut ? 1.0 : 0.0;
        suctionAlpha += (targetA - suctionAlpha) * 0.10;
        suctionScale += (targetS - suctionScale) * 0.35;

        if (suctionAlpha < 0.01 || !gl) return;

        // ?拍???扯蕭頩?(Lerp)
        bhCurrentX += (mouseX - bhCurrentX) * 0.15;
        bhCurrentY += (mouseY - bhCurrentY) * 0.15;

        // ?湔 WebGL 蝺抵??
        gl.viewport(0, 0, 800, 800);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(bhProgram);
        gl.uniform1f(uTimeLoc, Date.now() * 0.001);
        gl.uniform1f(uAlphaLoc, suctionAlpha);
        gl.uniform1f(uScaleLoc, bhGrowth * suctionScale);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // 撠?WebGL 蝯?蝜芾ˊ?唬蜓 2D ?怠?
        ctx.save();
        ctx.translate(bhCurrentX, bhCurrentY);
        // 皜脫?撠箏站閮剖???800px
        ctx.drawImage(bhGLCanvas, -400, -400, 800, 800);
        ctx.restore();
    }

    function navigateToNextPage() {
        if (nextUrl) {
            // ?刻歲頧?蝣箔??霈?嚗甇Ｘ???Ｖ漱?踵????
            document.documentElement.style.backgroundColor = '#050508';
            document.body.style.backgroundColor = '#050508';
            
            const urlObj = new URL(nextUrl, window.location.origin);
            urlObj.searchParams.set('from_transition', '1');
            urlObj.searchParams.set('bh_x', Math.round(bhCurrentX));
            urlObj.searchParams.set('bh_y', Math.round(bhCurrentY));
            window.location.href = urlObj.toString();
        }
    }

    function startBlackHoleMode() {
        if (clusters.length === 0) { canvas.style.display = 'none'; return; }
        isBlackHole   = true;
        isFadingOut   = false;
        bhGrowth      = 1.0;
        totalClusters = Math.max(1, clusters.length);
        collapseStartTime = 0;
        canvas.style.display = 'block';
        document.body.style.cursor = 'none';
        
        // ?梯??芾?皜豢???嚗??典椰銝?
        const customCursors = document.querySelectorAll('.cursor-outer, .cursor-inner, .cursor-trail, .cursor-text');
        customCursors.forEach(c => c.style.opacity = '0');
        
        renderBlackHole();
    }

    function renderBlackHole() {
        if (!isBlackHole) return;
        requestAnimationFrame(renderBlackHole);
        ctx.clearRect(0, 0, width, height);

        // ?菜葫?臬?詨?
        if (clusters.length === 0 && !isFadingOut) {
            isFadingOut = true;
        }

        drawBlackHoleCursor(true);
        const timeFactor = Date.now() * 0.003;
        const targetX = bhCurrentX; // 蝎??詨??瑟???抒? WebGL 暺?銝剖?
        const targetY = bhCurrentY;

        for (let i = clusters.length - 1; i >= 0; i--) {
            const c = clusters[i];
            c.update(targetX, targetY, true);
            c.draw(ctx, timeFactor, width * 10, true);
            if (c.life <= 0) clusters.splice(i, 1);
        }

        // 暺?????亙援憛?
        if (!isFadingOut) {
            const absorbed    = 1 - clusters.length / totalClusters;
            // ?批暺??詨蝎?敺??瘥? (隤踵?箸??之撠?
            const growTarget  = 1.0 + absorbed * 0.8;
            bhGrowth += (growTarget - bhGrowth) * 0.02; // ?暹暺???漲
        } else {
            bhGrowth += (0.01 - bhGrowth) * 0.35;  // 璆萄漲?暹??葬?漲嚗??閰拇?????
        }

        if (isFadingOut && suctionAlpha < 0.4 && suctionScale < 0.5) {
            // 銝?蝡?梯??怠?嚗?啗歲頧?雿銵?
            isBlackHole = false;
            navigateToNextPage();
        }
    }
    // ?? 蝯曹?????Noise 瞍?瘜?????????????????????????????????

    function getFrontierNoise(x, y, time, progress) {
        // 隤蹂??餌?嚗征??(0.01 -> 0.005), ?? (1.0 -> 0.3)
        // ??霈??脩???游楊憭抒?瘜Ｙ?嚗?蝘餃??渡楨?Ｕ瘝帘
        const noiseBase = Math.sin(x * 0.005 + y * 0.005 + time * 0.3) * 60;
        const highFreq = Math.cos(x * 0.008 - y * 0.006 + time * 0.4) * 20;
        const jitterScale = (1.0 + progress * 1.5); // ???渡?????
        return (noiseBase + highFreq) * jitterScale;
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
        maskStartTime = null; // ?蔭撱園閮???
        const cols = Math.ceil(width / (pixelStride * clusterStride));
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
        // ?桃蔗??箝?Ｗ敹怒?銝??璆菜?啣??踝??嗅??券脣漲?閫?
        const sweepSpeed = 4.0 + Math.pow(progress, 2.5) * 60; 
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
                        // 頞??Ｙ???摮?憸典?頞之嚗???Ｗ敹怎??西圾蝭憟?
                        cluster.vx += Math.pow(progress, 2) * 4.0;  
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

            // 蝜芾ˊ????蝺??閬箄???(Pixel Blocks along frontier, feather ??)
            ctx.globalAlpha = 0.25; // ?? Alpha嚗?????憛?芰銝??
            for (let i = 0; i <= segments * 4; i++) {
                const segProgress = i / (segments * 4);
                const py = height * segProgress;
                const px = k - (height - py);
                const noise = getFrontierNoise(px, py, timeFactor, progress);
                
                // ?冽????宏?Ｙ? Feather 蝢賢???蝝???
                const driftX = (Math.random() - 0.5) * 60;
                const driftY = (Math.random() - 0.5) * 60;
                
                ctx.fillStyle = palette[i % palette.length];
                const size = 5 + Math.random() * 15; // 蝮桀???憛偕撖?
                ctx.fillRect(px + noise + driftX - size/2, py + driftY - size/2, Math.floor(size/5)*5, Math.floor(size/5)*5);
            }
            ctx.globalAlpha = 1.0;
        }

        for (let i = clusters.length - 1; i >= 0; i--) {
            const c = clusters[i];
            // [??芸?]嚗蝵?2/3 敺???伐?銝血??UI ???
            const useSuction = (progress > 0.40);
            c.update(bhCurrentX, bhCurrentY, useSuction);
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
        if (e) {
            e.preventDefault();
            // 暺??祇??郊?湔皜豢?雿蔭嚗甇?mouse ?芰宏?? mouseX/Y ?????
            if (e.clientX !== undefined && e.clientX > 0) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        }
        if (isAnimating || isBlackHole) return;

        nextUrl = targetUrl;
        canvas.style.display = 'block';

        // 蝡?刻??臭誑 iframe ???圈??ｇ?霈??急???歇?典?銝??末
        // ?嗅??怎???撠撟曆??祇?摰?嚗?皞歇敹怠?嚗?閬死銝停?胯?銝??
        if (!document.getElementById('transition-preload-iframe')) {
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

        // ??蝣???游???
        if (snapshotImg && snapshotImg.complete) {
            ctx.drawImage(snapshotImg, 0, 0, width, height);
            startDisintegration();
        } else {
            // 憒???撠 Ready嚗??湔暺?蝣?
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, width, height);
            startDisintegration();
        }
    };

    // ????蝬脣???<a> ???嚗?摰?渲??
    document.addEventListener('DOMContentLoaded', () => {
    // 5. ???????芸??.bh-transition 憿??蝝?
    function initBHTriggers() {
        document.querySelectorAll('.bh-transition').forEach(el => {
            el.addEventListener('click', function(e) {
                const href = this.getAttribute('href') || this.dataset.href;
                
                // ??⊥????
                if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
                    return;
                }

                // ?瑁?暺?頧?寞?
                e.preventDefault();
                transitionToPage(href, e);
            });
        });
    }
        initBHTriggers();
    });
})();
