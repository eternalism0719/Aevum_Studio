/**
 * Depression Gravity Well - CyberVFX
 * Simulates a 3D dent/hole in a 2D grid.
 */

const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];
const spacing = 30; // Dense grid
const mouse = { x: -1000, y: -1000 };
let explosion = { active: false, x: 0, y: 0, radius: 0, maxRadius: 1500, speed: 45 };

class Point {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
    }

    update() {
        const dx = mouse.x - this.baseX;
        const dy = mouse.y - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250; // Influence area

        if (dist < maxDist) {
            // Depression effect: Pull points TOWARDS the mouse
            const force = (maxDist - dist) / maxDist;
            this.x = this.baseX + dx * force * force * 0.5;
            this.y = this.baseY + dy * force * force * 0.5;
        } else {
            this.x = this.baseX;
            this.y = this.baseY;
        }

        // --- NEW: PHYSICAL EXPLOSION SHOCKWAVE ---
        if (explosion.active) {
            const ex = explosion.x - this.baseX;
            const ey = explosion.y - this.baseY;
            const edist = Math.sqrt(ex * ex + ey * ey);
            
            // If the shockwave rim passes over the point
            const diff = Math.abs(edist - explosion.radius);
            const spread = 200; // Physical width of the wave
            
            if (diff < spread) {
                // Wave PUSH: Inversely proportional to distance from the wavefront
                const pushForce = (1 - diff / spread) * 150; // Massively move points out
                const angle = Math.atan2(ey, ex);
                this.x -= Math.cos(angle) * pushForce;
                this.y -= Math.sin(angle) * pushForce;
            }
        }
    }
}

function initGrid() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    points = [];

    for (let y = 0; y < height + spacing; y += spacing) {
        let row = [];
        for (let x = 0; x < width + spacing; x += spacing) {
            row.push(new Point(x, y));
        }
        points.push(row);
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw horizontal lines with distance-based blooming
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[i].length - 1; j++) {
            const p1 = points[i][j];
            const p2 = points[i][j+1];
            p1.update();
            p2.update();

            const dist = Math.sqrt(Math.pow(mouse.x - p1.x, 2) + Math.pow(mouse.y - p1.y, 2));
            const opacity = Math.max(0.12, 0.8 - dist / 400); // Bloom effect
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
            ctx.lineWidth = opacity > 0.4 ? 1 : 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }

    // Draw vertical lines with distance-based blooming
    for (let j = 0; j < points[0].length; j++) {
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i][j];
            const p2 = points[i+1][j];
            
            const dist = Math.sqrt(Math.pow(mouse.x - p1.x, 2) + Math.pow(mouse.y - p1.y, 2));
            const opacity = Math.max(0.12, 0.8 - dist / 400);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${opacity})`;
            ctx.lineWidth = opacity > 0.4 ? 1 : 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }

    requestAnimationFrame(draw);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', initGrid);

// --- GLOBAL TRIGGER: SHOCKWAVE HANDOFF FROM TRANSITION ---
window.triggerGridShockwave = window.triggerGridExplosion = function(x, y) {
    explosion.x = x;
    explosion.y = y;
    explosion.radius = 0;
    explosion.active = true;
    
    // Automatic cleanup timer
    const animateExplosion = () => {
        if (!explosion.active) return;
        explosion.radius += explosion.speed;
        explosion.speed *= 0.98; // Subtle deceleration

        if (explosion.radius > explosion.maxRadius || explosion.speed < 2) {
            explosion.active = false;
        } else {
            requestAnimationFrame(animateExplosion);
        }
    };
    animateExplosion();
};

initGrid();
draw();
