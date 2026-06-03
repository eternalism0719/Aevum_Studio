/**
 * AEVUM STUDIO - Page Enter VFX
 * ??敺?銝??瘣??湧?靘???湔郭蝝??????(Gradient Refraction Prism)
 */

document.addEventListener("DOMContentLoaded", async () => {
    // 瑼Ｘ?臬??頧??????
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('from_transition')) return;

    // 皜 URL ?嚗??雯??嗾瘛?
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);

    // ??暺????憪漣璅??亦??閮剔?恍甇?葉憭?
    const expX = urlParams.has('bh_x') ? parseInt(urlParams.get('bh_x')) : window.innerWidth / 2;
    const expY = urlParams.has('bh_y') ? parseInt(urlParams.get('bh_y')) : window.innerHeight / 2;

    // 撱園銝銝Ⅱ靽?DOM 摰皞?憟?
    setTimeout(async () => {
        // ??頛 PixiJS & Filters
        if (typeof PIXI === 'undefined') {
            await loadScript("https://unpkg.com/pixi.js@8.x/dist/pixi.min.js");
            await loadScript("https://unpkg.com/pixi-filters@6.x/dist/pixi-filters.js");
        }

        startEntranceVFX(expX, expY);
    }, 100);
});

// ??頛 script ??helper
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function startEntranceVFX(x, y) {
    // ?萄遣?刻撟??臬??券???Pixi App
    const app = new PIXI.Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0, // ???
        resizeTo: window,
        preference: 'webgl'
    });
    
    // 閮剖?擃?z-index 銝西身??pointer-events: none 蝣箔?銝??曌?雿?
    app.canvas.style.position = 'fixed';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    app.canvas.style.pointerEvents = 'none';
    app.canvas.style.zIndex = '999998'; // ?曉頧暺?摨??I銋?
    document.body.appendChild(app.canvas);

    const uiContainer = new PIXI.Container();
    app.stage.addChild(uiContainer);

    // 蝛粹??剜瞈暸
    const shockwaveOptions = {
        center: { x, y },
        amplitude: 80, 
        wavelength: 400, 
        speed: 600,  // 皜楨蝛粹??剜瘜Ｙ????漲
        brightness: 1.2,
        radius: -1,
        time: 0
    };
    const shockwaveFilter = new PIXI.filters.ShockwaveFilter(shockwaveOptions);
    app.stage.filters = [shockwaveFilter];

    // 鋆賭?摰??撓撅斗?撠???
    function createRingTexture(radius) {
        const padding = 10;
        const canvas = document.createElement('canvas');
        canvas.width = (radius + padding) * 2;
        canvas.height = (radius + padding) * 2;
        const ctx = canvas.getContext('2d');
        
        const cx = radius + padding;
        const cy = radius + padding;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.02)');
        grad.addColorStop(0.96, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        return PIXI.Texture.from(canvas);
    }

    const ringTexture = createRingTexture(256);

    const spriteRed = new PIXI.Sprite(ringTexture);
    const spriteGreen = new PIXI.Sprite(ringTexture);
    const spriteBlue = new PIXI.Sprite(ringTexture);

    spriteRed.anchor.set(0.5);
    spriteGreen.anchor.set(0.5);
    spriteBlue.anchor.set(0.5);

    spriteRed.tint = 0xff0000;
    spriteGreen.tint = 0x00ff00;
    spriteBlue.tint = 0x0000ff;

    spriteRed.blendMode = 'add';
    spriteGreen.blendMode = 'add';
    spriteBlue.blendMode = 'add';

    spriteRed.position.set(x, y);
    spriteGreen.position.set(x, y);
    spriteBlue.position.set(x, y);

    uiContainer.addChild(spriteRed);
    uiContainer.addChild(spriteGreen);
    uiContainer.addChild(spriteBlue);

    // ???怨
    const sparkContainer = new PIXI.Container();
    uiContainer.addChild(sparkContainer);
    const activeSparks = [];

    for(let i = 0; i < 40; i++) {
        const spark = new PIXI.Graphics();
        spark.blendMode = 'add';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 1000 + Math.random() * 2500;
        const length = 20 + Math.random() * 80;
        const thickness = 1 + Math.random() * 2;
        
        const colors = [0xffffff, 0x00f3ff, 0xffaa00];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        spark.rect(0, -thickness/2, length, thickness).fill(color);
        
        let startOffset = 50 + Math.random() * 100;
        spark.position.set(x + Math.cos(angle)*startOffset, y + Math.sin(angle)*startOffset);
        spark.rotation = angle;
        
        sparkContainer.addChild(spark);
        activeSparks.push({
            sprite: spark,
            vx: Math.cos(angle) * velocity * 0.5, // ?怨??蝺?
            vy: Math.sin(angle) * velocity * 0.5,
            life: 1.0, 
            decayRate: 0.8 + Math.random() * 1.2 // ?怨瘨?漲皜楨嚗??銋?
        });
    }

    let expTime = 0;
    const maxTime = 2.5; // 蝮賢??急??辣?瘀?霈??唳撅???

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    const ticker = new PIXI.Ticker();
    ticker.add(() => {
        const dt = ticker.deltaMS / 1000;
        expTime += dt;
        
        let progress = expTime / maxTime;
        if (progress > 1) progress = 1;
        
        let easeOut = easeOutExpo(progress);

        // 蝛粹??剜
        shockwaveFilter.time += dt;
        shockwaveFilter.amplitude = 80 * (1 - progress); 

        // 瞍詨惜????
        const baseScale = easeOut * 12;
        const masterAlpha = 0.5 * (1 - Math.pow(progress, 1.5));
        
        spriteRed.scale.set(baseScale * 1.05);
        spriteGreen.scale.set(baseScale * 1.00);
        spriteBlue.scale.set(baseScale * 0.95);

        spriteRed.alpha = masterAlpha;
        spriteGreen.alpha = masterAlpha;
        spriteBlue.alpha = masterAlpha;

        // ??撠?
        for(let i = activeSparks.length - 1; i >= 0; i--) {
            let s = activeSparks[i];
            s.life -= dt * s.decayRate;
            
            if (s.life <= 0) {
                sparkContainer.removeChild(s.sprite);
                activeSparks.splice(i, 1);
                continue;
            }
            
            s.vx *= 0.85;
            s.vy *= 0.85;
            
            s.sprite.x += s.vx * dt;
            s.sprite.y += s.vy * dt;
            s.sprite.alpha = Math.pow(s.life, 2);
            s.sprite.scale.x = s.life; 
        }

        // ?蝯?嚗瘥銝阡??曇??園?
        if (progress >= 1) {
            ticker.stop();
            app.destroy(true, { children: true, texture: true, baseTexture: true });
            if (app.canvas && app.canvas.parentNode) {
                app.canvas.parentNode.removeChild(app.canvas);
            }
        }
    });
    
    ticker.start();
}
