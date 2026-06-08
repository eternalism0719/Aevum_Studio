const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

const oldHeaderRegex = /<h1 class="font-display-hero[^>]*>[\s\S]*?<\/h1>/;
const newHeader = `<h1 class="font-display-hero text-4xl md:text-5xl lg:text-6xl text-primary mb-8 uppercase tracking-widest leading-tight break-keep">
    <div class="mb-4 text-6xl md:text-7xl lg:text-8xl" style="font-family: 'Anson', sans-serif; letter-spacing: 12px; margin-right: -12px;">
        AEVUM <span class="text-primary-container" style="text-shadow: 0 0 20px rgba(0,243,255,0.5);">STUDIO</span>
    </div>
    <div>
        <span class="text-white">合作洽談</span><span class="text-primary-container">預約表</span>
    </div>
</h1>`;

html = html.replace(oldHeaderRegex, newHeader);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Header styles updated!');
