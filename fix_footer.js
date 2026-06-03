const fs = require('fs');
let brand = fs.readFileSync('brand.html', 'utf8');

const messyFooterRegex = /<div class="footer-inner">[\s\S]*?<div class="modal-backdrop" id="modal-backdrop"><\/div>\r?\n\r?\n/m;

const correctFooter =     <footer class="site-footer" id="contact">
        <div class="footer-inner">
            <div class="footer-top">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="images/PJ_LOGO_s.webp" alt="Aevum Studio Logo" class="footer-logo-img">
                        AEVUM <span>STUDIO</span>
                    </div>
                    <div class="footer-location">
                        <span class="badge-dot"></span>
                        TAIPEI, TAIWAN // APAC
                    </div>
                    <p class="footer-tagline">Available for commercial work worldwide.</p>
                </div>
                <div class="footer-links-col">
                    <h4 class="footer-col-title">NAVIGATE</h4>
                    <a href="index.html" class="footer-link">Home</a>
                    <a href="project.html" class="footer-link">Portfolio Projects</a>
                    <a href="brand.html" class="footer-link">Brand Story</a>
                    <a href="experiment.html" class="footer-link">Experiment</a>
                    <a href="games.html" class="footer-link">Games</a>
                </div>
                <div class="footer-links-col">
                    <h4 class="footer-col-title">CONTACT</h4>
                    <a href="#" class="footer-link" onclick="navigator.clipboard.writeText('eternalframePJ@gmail.com'); alert('Copied to clipboard!'); return false;" title="Click to copy">eternalframePJ@gmail.com</a>
                    <a href="#" class="footer-link" id="footer-artstation">ArtStation</a>
                    <a href="https://www.instagram.com/pj_meit/" target="_blank" class="footer-link" id="footer-instagram">Instagram</a>
                    <a href="https://vimeo.com/showcase/12236387" target="_blank" class="footer-link" id="footer-vimeo">Vimeo</a>
                </div>
                <div class="footer-cta-col">
                    <h4 class="footer-col-title">START A PROJECT</h4>
                    <p class="footer-cta-text">Open to freelance & studio collaboration.</p>
                    <a href="https://line.me/ti/p/bFn92JRpQz" target="_blank" class="btn-primary btn-small" id="footer-contact-btn">
                        GET IN TOUCH
                        <span class="btn-line"></span>
                    </a>
                </div>
            </div>
            <div class="footer-bottom">
                <span class="footer-copy">&copy; 2026 AEVUM STUDIO. All rights reserved.</span>
                <span class="footer-build">BUILD: v3.0.0 // CYBER_UI</span>
            </div>
        </div>
    </footer>
;

brand = brand.replace(messyFooterRegex, correctFooter);
fs.writeFileSync('brand.html', brand, 'utf8');
