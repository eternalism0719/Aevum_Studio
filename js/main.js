/* ============================================================
   AINA VISUALS — main.js v3.0
   ============================================================ */

/* ------ Project Data ------ */
const projects = [
    {
        id: 1,
        title: "凱基銀行 2024",
        role: "Modeling · UI Design · Material · Animation · Lighting · Render · Compositing",
        description: "負責凱基專案 360 度環境建模以及金屬材質表現，使用 Blender 與 Arnold 渲染。",
        video: "https://vimeo.com/1178407017?fl=tl&fe=ec",
        thumbnail: "images/凱基銀行.png",
        orientation: "landscape",
        tags: ["Blender"],
        category: "motion"
    },
    {
        id: 2,
        title: "大金空調 100年",
        role: "Hardsurface Modeling · Material · Animation · Particle Simulation · Lighting · Render · Compositing",
        description: "大金空調百年紀念影片，處理 3D 動態與視覺特效合成設計。",
        video: "https://vimeo.com/1178406852?fl=tl&fe=ec",
        thumbnail: "images/大金空調.png",
        orientation: "landscape",
        tags: ["Blender"],
        category: "houdini"
    },
    {
        id: 3,
        title: "麥當勞歡樂送系列",
        role: "VFX Technical Director",
        description: "麥當勞相關系列廣告視覺特效，使用 Houdini 處理物理與流體動力學。",
        video: "https://vimeo.com/1178406993?fl=tl&fe=ec",
        thumbnail: "images/麥當勞.png",
        orientation: "landscape",
        tags: ["Houdini", "Fluid FX", "Compositing"],
        category: "houdini"
    },
    {
        id: 4,
        title: "蘭諾 Lenor 衣物芳香豆",
        role: "Lead 3D Artist",
        description: "高階產品外觀著色與 3D 動畫模擬，負責粒子與材質特效。",
        video: "https://vimeo.com/1178406922?fl=tl&fe=ec",
        thumbnail: "images/蘭諾_Lenor.png",
        orientation: "landscape",
        tags: ["Lighting", "Motion Graphics", "Particles"],
        category: "motion"
    },
    {
        id: 5,
        title: "7-11 寶可夢 Pokémon",
        role: "3D Motion Designer",
        description: "針對社群媒體製作的宣傳影片，整合 IP 授權角色與 3D 環境。",
        video: "https://vimeo.com/1178406654?fl=tl&fe=ec",
        thumbnail: "images/7-11_寶可夢.png",
        orientation: "portrait",
        tags: ["Blender", "Motion Design", "Social Media"],
        category: "blender"
    }
];

/* ------ Gallery ------ */
function initGallery() {
    const grid = document.getElementById('project-list');
    if (!grid) return;

    const limit = parseInt(grid.dataset.limit, 10) || Infinity;
    const filterData = projects.slice(0, limit);

    filterData.forEach((project, idx) => {
        const card = document.createElement('div');
        card.className = 'project-card reveal-item';
        card.style.setProperty('--delay', `${idx * 0.1}s`);
        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', project.title);
        card.dataset.category = project.category;
        card.dataset.orientation = project.orientation;

        const isVimeo = project.video.includes('vimeo.com');
        let mediaHtml = '';
        let vimeoId = '';

        if (isVimeo) {
            // Extract Vimeo ID for fetching thumbnail
            vimeoId = project.video.split('/').pop().split('?')[0];
            if (project.video.includes('vimeo.com/video/')) {
                vimeoId = project.video.split('vimeo.com/video/')[1].split('?')[0];
            } else if (project.video.includes('vimeo.com/')) {
                const matches = project.video.match(/vimeo\.com\/(\d+)/);
                if (matches && matches[1]) {
                    vimeoId = matches[1];
                }
            }
            mediaHtml = `<img id="vimeo-thumb-${project.id}" src="${project.thumbnail}" alt="${project.title} thumbnail" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0; background:#111;">`;
        } else {
            mediaHtml = `
                <video muted loop playsinline preload="none">
                    <source src="${project.video}" type="video/mp4">
                    <source src="${project.video}" type="video/quicktime">
                </video>
            `;
        }

        card.innerHTML = `
            <div class="thumb-wrapper ${project.orientation}">
                ${mediaHtml}
                <div class="thumb-overlay">
                    <div class="thumb-play-icon">&#9654;</div>
                </div>
                <span class="card-category">${project.tags.join(' / ')}</span>
            </div>
            <div class="info">
                <h3>${project.title}</h3>
                <p class="role-text">${project.role}</p>
            </div>
        `;

        const video = card.querySelector('video');
        if (video) {
            card.addEventListener('mouseenter', () => video.play().catch(() => {}));
            card.addEventListener('mouseleave', () => { video.pause(); });
        }
        card.addEventListener('click', () => openModal(project));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') openModal(project);
        });

        grid.appendChild(card);

        // Fetch Vimeo thumbnail dynamically if needed
        if (isVimeo && vimeoId) {
            fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data && data[0] && data[0].thumbnail_large) {
                        const img = document.getElementById(`vimeo-thumb-${project.id}`);
                        if (img) img.src = data[0].thumbnail_large;
                    }
                })
                .catch(err => console.log('Vimeo thumb fetch error:', err));
        }
    });

    // Trigger reveal for already-visible cards
    setTimeout(() => {
        observeRevealItems();
        if (window.refreshCursorHover) window.refreshCursorHover();
    }, 100);
}

/* ------ Filter Tabs ------ */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const grid = document.getElementById('project-list');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filter = tab.dataset.filter;
            const cards = grid?.querySelectorAll('.project-card');
            cards?.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.transition = 'opacity 0.3s, transform 0.3s';
                if (match) {
                    card.style.opacity = '1';
                    card.style.transform = '';
                    card.style.pointerEvents = '';
                } else {
                    card.style.opacity = '0.15';
                    card.style.transform = 'scale(0.97)';
                    card.style.pointerEvents = 'none';
                }
            });
        });
    });
}

/* ------ Modal ------ */
const modal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalRole = document.getElementById('modal-role');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');

function openModal(project) {
    if (!modal) return;

    modalTitle.textContent = project.title;
    modalRole.textContent = project.role;
    modalDesc.textContent = project.description;

    // Tags
    if (modalTags && project.tags) {
        modalTags.innerHTML = project.tags
            .map(t => `<span class="modal-tag">${t}</span>`)
            .join('');
    }

    // Video / Vimeo Iframe Handling
    const isVimeo = project.video.includes('vimeo.com');
    const oldIframe = modalVideo.parentElement.querySelector('iframe.vimeo-modal-iframe');
    if (oldIframe) oldIframe.remove();

    if (isVimeo) {
        modalVideo.style.display = 'none';
        modalVideo.pause();
        
        // Extract Vimeo ID (supports both vimeo.com/123456... and player.vimeo.com/video/123456...)
        let vimeoId = project.video.split('/').pop().split('?')[0];
        if (project.video.includes('vimeo.com/video/')) {
            vimeoId = project.video.split('vimeo.com/video/')[1].split('?')[0];
        } else if (project.video.includes('vimeo.com/')) {
            const matches = project.video.match(/vimeo\.com\/(\d+)/);
            if (matches && matches[1]) {
                vimeoId = matches[1];
            }
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'vimeo-modal-iframe';
        iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.zIndex = '1';

        // Force Aspect Ratio to prevent zero-height collapse
        modalVideo.parentElement.style.aspectRatio = '16 / 9';
        modalVideo.parentElement.style.maxHeight = '70vh';
        
        modalVideo.parentElement.appendChild(iframe);
    } else {
        modalVideo.parentElement.style.aspectRatio = '';
        modalVideo.parentElement.style.maxHeight = '';
        
        modalVideo.style.display = 'block';
        modalVideo.innerHTML = `
            <source src="${project.video}" type="video/mp4">
            <source src="${project.video}" type="video/quicktime">
        `;
        modalVideo.load();
        modalVideo.play().catch(() => {});
    }

    modal.style.display = 'flex';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Stop local video
    modalVideo?.pause();
    
    // Stop Vimeo iframe by removing or resetting its src
    const iframe = modalVideo?.parentElement.querySelector('iframe.vimeo-modal-iframe');
    if (iframe) {
        iframe.src = '';
        iframe.remove();
    }
    
    // Reset wrapper aspect ratio
    if (modalVideo?.parentElement) {
        modalVideo.parentElement.style.aspectRatio = '';
        modalVideo.parentElement.style.maxHeight = '';
    }
}

document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ------ Showreel ------ */
function openShowreel() {
    openModal({
        title: "SHOWREEL",
        role: "Director / 3D Artist",
        description: "Aevum Studio Showreel",
        video: "https://vimeo.com/1197317114",
        tags: ["Showreel", "VFX", "3D"]
    });
}

/* ------ Magnetic & Pro Cursor ------ */
function initCursor() {
    const outer = document.getElementById('cursor-outer');
    const inner = document.getElementById('cursor-inner');
    const trail = document.getElementById('cursor-trail');
    const text  = document.getElementById('cursor-text');
    if (!outer || !inner) return;

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let outerX = 0, outerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Spotlight variables
        document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);

        // Inner follows instantly
        inner.style.left = `${mouseX}px`;
        inner.style.top  = `${mouseY}px`;
        
        if (text) {
            text.style.left = `${mouseX}px`;
            text.style.top  = `${mouseY}px`;
        }
    });

    // ... (rest of animateCursor logic remains the same inside the function)
    function animateCursor() {
        outerX += (mouseX - outerX) * 0.2;
        outerY += (mouseY - outerY) * 0.2;
        outer.style.left = `${outerX}px`;
        outer.style.top  = `${outerY}px`;

        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        if (trail) {
            trail.style.left = `${trailX}px`;
            trail.style.top  = `${trailY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Magnetic & Tilt Logic for Cards
    function initInteractions() {
        const interactables = document.querySelectorAll('.project-card, .skill-card');
        
        interactables.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                const dx = x - xc;
                const dy = y - yc;
                
                // Tilt
                const tiltX = (dy / yc) * -10;
                const tiltY = (dx / xc) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
                card.style.transition = 'none'; // Instant follow
                
                // Subtle shine/spotlight on the card itself
                if (card.classList.contains('skill-card')) {
                    card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
                    card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all 0.5s var(--ease-pro)'; // Smooth reset
            });
        });

        // Magnetic for buttons
        const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link, .burger-btn, .filter-tab');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const moveX = (e.clientX - centerX) * 0.4;
                const moveY = (e.clientY - centerY) * 0.4;
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                outerX += (centerX - outerX) * 0.1;
                outerY += (centerY - outerY) * 0.1;
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; });
        });
    }

    initInteractions();

    // Universal Hover Logic
    function refreshHoverStates() {
        document.querySelectorAll('a, button, .project-card, .filter-tab, .close-modal').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('project-card')) {
                    outer.classList.add('view');
                    if (text) text.textContent = 'EXPLORE';
                } else {
                    outer.classList.add('hover');
                }
                inner.style.transform = 'translate(-50%, -50%) scale(0)';
            });
            el.addEventListener('mouseleave', () => {
                outer.classList.remove('hover', 'view');
                inner.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    window.refreshCursorHover = refreshHoverStates;
    refreshHoverStates();
    return refreshHoverStates;
}

/* ------ Scroll Reveal (IntersectionObserver) ------ */
function observeRevealItems() {
    const items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => obs.observe(el));
}

/* ------ Skill Bar Animation ------ */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.dataset.level || '0';
                setTimeout(() => {
                    bar.style.width = `${level}%`;
                }, 200);
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => obs.observe(bar));
}

/* ------ Stat Counter Animation ------ */
function initStatCounters() {
    const nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                let current = 0;
                const step = Math.ceil(target / 60);
                const interval = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = current;
                    if (current >= target) clearInterval(interval);
                }, 20);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
}

/* ------ Nav Scroll State ------ */
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    const hero = document.getElementById('hero');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        // Use hero height if available to clear the showreel exactly, else 80px
        const threshold = hero ? hero.offsetHeight : 80;
        nav.classList.toggle('scrolled', window.scrollY >= threshold);
    }, { passive: true });
}


/* ------ Preloader ------ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const digitList = document.getElementById('digit-list');

    // Skip loader if seen in this session
    if (sessionStorage.getItem('vfx-loader-done')) {
        if (preloader) preloader.style.display = 'none';
        const heroVideo = document.getElementById('hero-video');
        heroVideo?.play().catch(() => {});
        return;
    }

    if (digitList) {
        setTimeout(() => {
            digitList.style.transform = 'translateY(-14rem)';
            digitList.addEventListener('transitionend', () => {
                digitList.classList.add('reached-target');
            }, { once: true });
        }, 500);
    }

    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            const heroVideo = document.getElementById('hero-video');
            heroVideo?.play().catch(() => {});
            sessionStorage.setItem('vfx-loader-done', 'true');
        }, 3200);
    }
});

/* ------ Smooth Scroll for anchor links ------ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80; // nav height compensation
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ------ Hero Snap Scroll to About ------ */
function initHeroScrollToAbout() {
    const hero = document.getElementById('hero');
    const target = document.getElementById('about');
    if (!hero || !target) return;

    let isSnapping = false;
    const navOffset = 80;

    window.addEventListener('wheel', (e) => {
        if (isSnapping) return;
        
        const scrollThreshold = window.innerHeight * 0.15;
        // When near top and scrolling down
        if (window.scrollY < scrollThreshold && e.deltaY > 0) {
            isSnapping = true;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            setTimeout(() => { isSnapping = false; }, 800);
        }
        // When near About top and scrolling up
        else if (window.scrollY > target.offsetTop - 150 && window.scrollY < target.offsetTop + 150 && e.deltaY < 0) {
            isSnapping = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { isSnapping = false; }, 800);
        }
    }, { passive: true });

    let startY;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isSnapping || !startY) return;
        let deltaY = startY - e.touches[0].clientY;
        // Swipe up (scrolling down the page)
        if (window.scrollY < 50 && deltaY > 20) {
            isSnapping = true;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            setTimeout(() => { isSnapping = false; }, 800);
        }
        // Swipe down (scrolling up the page) from About top
        else if (window.scrollY > target.offsetTop - 10 && window.scrollY < target.offsetTop + 10 && deltaY < -20) {
            isSnapping = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => { isSnapping = false; }, 800);
        }
    }, { passive: true });
}

/* ------ Hero Interactive Mouse Tilt ------ */
function initHeroMouseTilt() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

        hero.style.setProperty('--mouse-x', (x * 2).toFixed(3)); // -1 to 1
        hero.style.setProperty('--mouse-y', (y * 2).toFixed(3)); // -1 to 1
    });

    hero.addEventListener('mouseleave', () => {
        hero.style.setProperty('--mouse-x', 0);
        hero.style.setProperty('--mouse-y', 0);
    });
}

/* ------ Hero Video Loop (0-20s) ------ */
function initHeroVideoLoop() {
    const iframe = document.getElementById('hero-video');
    if (!iframe || typeof Vimeo === 'undefined') return;

    const player = new Vimeo.Player(iframe);
    
    player.on('timeupdate', function(data) {
        if (data.seconds >= 20) {
            player.setCurrentTime(0);
        }
    });
}

/* ------ Init ------ */
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initFilterTabs();
    initCursor();
    observeRevealItems();
    initSkillBars();
    initNavScroll();
    initSmoothScroll();
    initHeroScrollToAbout();
    initHeroMouseTilt();
    initGamesLockdown();
    initHeroVideoLoop();
});

/* ------ Games Lockdown & Purge Logic ------ */
function initGamesLockdown() {
    const vault = document.getElementById('lockdown-vault'); 
    const purgeBtn = document.getElementById('btn-purge');
    const resetBtn = document.getElementById('reset-vault');
    const vaultCore = document.getElementById('vault-core');
    const outerShell = document.getElementById('outer-shell');
    const pBar = document.querySelector('.system-progress-bar');
    const pText = document.getElementById('percent-text');
    const shatterOverlay = document.getElementById('shatter-overlay');
    const purgedLabel = document.getElementById('purged-label');

    if (!vault || !purgeBtn) return;

    // Helper: Digital Scramble Effect
    const scrambleText = (el, duration = 1200) => {
        if (!el) return Promise.resolve();
        const originalText = el.innerText;
        const chars = "!<>-_\\/[]{}—=+*^?#________0123456789";
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        return new Promise(resolve => {
            el.style.display = 'block';
            const interval = setInterval(() => {
                let scrambled = "";
                for (let i = 0; i < originalText.length; i++) {
                    if (originalText[i] === "\n") { scrambled += "\n"; continue; }
                    if (originalText[i] === " ") { scrambled += " "; continue; }
                    scrambled += chars[Math.floor(Math.random() * chars.length)];
                }
                el.innerText = scrambled;
                frame++;
                if (frame >= totalFrames) {
                    clearInterval(interval);
                    el.innerText = originalText;
                    resolve();
                }
            }, 1000 / frameRate);
        });
    };

    // 1. Initial State Randomization
    const randomizeBackground = () => {
        const labels = document.querySelectorAll('.coarse-warning');
        labels.forEach(label => {
            gsap.set(label, {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                rotation: (Math.random() - 0.5) * 30,
                scale: 0.9 + Math.random() * 0.4
            });
        });
        
        // Subtle drift for hazard bands
        gsap.to('.hazard-band', {
            x: "random(-100, 100)",
            y: "random(-50, 50)",
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    };
    randomizeBackground();

    // 2. Volatile Progress
    let progress = 38.2;
    const progressTimer = setInterval(() => {
        if (document.body.classList.contains('purge-mode')) return;
        const jitter = (Math.random() - 0.5) * 8;
        progress = Math.max(10, Math.min(90, progress + jitter));
        if (pBar) pBar.style.width = `${progress}%`;
        if (pText) pText.innerText = `${progress.toFixed(1)}%`;
    }, 500);

    // 3. The Breach Sequence (Shatter & Color Flip)
    purgeBtn.addEventListener('click', async () => {
        if (document.body.classList.contains('purge-mode')) return;
        
        // Start Sequence
        document.body.classList.add('purge-mode');
        clearInterval(progressTimer);
        
        // Intense Screen Shake
        gsap.to(vault, { 
            x: "random(-15, 15)", 
            y: "random(-15, 15)", 
            duration: 0.05, 
            repeat: 20, 
            yoyo: true 
        });

        // Background Text Randomization Shift
        gsap.to('.coarse-warning', {
            x: "random(-400, 400)",
            y: "random(-400, 400)",
            rotation: "random(-90, 90)",
            opacity: 1,
            duration: 0.4,
            stagger: 0.05
        });

        // Hide Viewport Layers (Tapes & Shell)
        if (outerShell) gsap.to(outerShell, { opacity: 0, scale: 1.1, duration: 0.4 });
        gsap.to('.security-tape', {
            opacity: 0,
            x: (i) => i % 2 === 0 ? 1500 : -1500,
            duration: 0.6,
            ease: "power4.in"
        });

        // Fade out original content
        gsap.to('.vault-content-original', { opacity: 0, scale: 0.9, duration: 0.3 });

        // 1. DISPERSION ANIMATION (Digital Slices)
        const slices = document.querySelectorAll('.glitch-slice');
        gsap.to(slices, {
            opacity: 1,
            duration: 0.2,
            stagger: 0.02
        });

        slices.forEach((slice, i) => {
            const direction = i % 2 === 0 ? 1 : -1;
            const distance = 100 + Math.random() * 200;
            
            gsap.to(slice, {
                x: direction * distance,
                opacity: 0,
                scaleY: 0.1,
                duration: 0.8 + Math.random() * 0.4,
                ease: "power4.inOut",
                delay: i * 0.03
            });
        });

        // 2. Hide Content with Glitch
        gsap.to('.vault-content-original', {
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px) contrast(2)",
            duration: 0.4,
            ease: "power2.in"
        });

        // 3. Reveal the Purged Label in the center vacuum
        if (purgedLabel) {
            gsap.set(purgedLabel, { display: 'block', opacity: 0, scale: 0.8 });
            await gsap.to(purgedLabel, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
            await scrambleText(purgedLabel, 1200);
            gsap.to(purgedLabel, { scale: 1.1, duration: 0.4, yoyo: true, repeat: -1 });
        }

        // Show Reset Orb
        if (resetBtn) {
            resetBtn.classList.add('active');
        }
    });

    // 4. System Re-initialization
    resetBtn.addEventListener('click', () => {
        gsap.to('body', { opacity: 0, duration: 0.5, onComplete: () => location.reload() });
    });
}
