/**
 * AEVUM STUDIO - Page Enter VFX
 * 處理從上一頁黑洞轉場過來的「入場波紋與折射」特效 (Gradient Refraction Prism)
 */

document.addEventListener("DOMContentLoaded", async () => {
    // 檢查是否有從轉場過來的參數
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('from_transition')) return;

    // 清除 URL 參數，保持網址列乾淨
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);

    // 取得黑洞爆炸的原始座標，若無則預設為畫面正中央
    const expX = urlParams.has('bh_x') ? parseInt(urlParams.get('bh_x')) : window.innerWidth / 2;
    const expY = urlParams.has('bh_y') ? parseInt(urlParams.get('bh_y')) : window.innerHeight / 2;

    // 延遲一下確保 DOM 完全準備好
    setTimeout(async () => {
        // 動態載入 PixiJS & Filters
        if (typeof PIXI === 'undefined') {
            await loadScript("https://unpkg.com/pixi.js@8.x/dist/pixi.min.js");
            await loadScript("https://unpkg.com/pixi-filters@6.x/dist/pixi-filters.js");
        }

        startEntranceVFX(expX, expY);
    }, 100);
});

// 動態載入 script 的 helper
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
    // 創建全螢幕、背景完全透明的 Pixi App
    const app = new PIXI.Application();
    await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0, // 透明背景
        resizeTo: window,
        preference: 'webgl'
    });
    
    // 設定高 z-index 並設為 pointer-events: none 確保不阻擋滑鼠操作
    app.canvas.style.position = 'fixed';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    app.canvas.style.pointerEvents = 'none';
    app.canvas.style.zIndex = '999998'; // 放在轉場黑洞底下或UI之上
    document.body.appendChild(app.canvas);

    const uiContainer = new PIXI.Container();
    app.stage.addChild(uiContainer);

    // 空間扭曲濾鏡
    const shockwaveOptions = {
        center: { x, y },
        amplitude: 80, 
        wavelength: 400, 
        speed: 600,  // 減緩空間扭曲波紋的擴散速度
        brightness: 1.2,
        radius: -1,
        time: 0
    };
    const shockwaveFilter = new PIXI.filters.ShockwaveFilter(shockwaveOptions);
    app.stage.filters = [shockwaveFilter];

    // 製作完美的漸層折射紋理
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

    // 光束火花
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
            vx: Math.cos(angle) * velocity * 0.5, // 火花初速減緩
            vy: Math.sin(angle) * velocity * 0.5,
            life: 1.0, 
            decayRate: 0.8 + Math.random() * 1.2 // 火花消散速度減緩，停留更久
        });
    }

    let expTime = 0;
    const maxTime = 2.5; // 總動畫時間延長，讓光環擴展變慢

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

        // 空間扭曲
        shockwaveFilter.time += dt;
        shockwaveFilter.amplitude = 80 * (1 - progress); 

        // 漸層折射環
        const baseScale = easeOut * 12;
        const masterAlpha = 0.5 * (1 - Math.pow(progress, 1.5));
        
        spriteRed.scale.set(baseScale * 1.05);
        spriteGreen.scale.set(baseScale * 1.00);
        spriteBlue.scale.set(baseScale * 0.95);

        spriteRed.alpha = masterAlpha;
        spriteGreen.alpha = masterAlpha;
        spriteBlue.alpha = masterAlpha;

        // 星屑射線
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

        // 動畫結束，銷毀並釋放記憶體
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
