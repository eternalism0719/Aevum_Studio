const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Extract footer from index.html
const footerMatch = indexHtml.match(/<footer class="site-footer" id="contact">[\s\S]*?<\/footer>/);
if (!footerMatch) {
    console.error("Could not find footer in index.html");
    process.exit(1);
}
const commonFooter = footerMatch[0];

// 2. Replace footer in contact.html
const oldFooterRegex = /<footer class="w-full py-8 bg-surface-dim border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-page gap-4 z-10 relative">[\s\S]*?<\/footer>/;
html = html.replace(oldFooterRegex, commonFooter);

// 3. Format the text exactly as requested: "收到表單後" on a new line.
const oldPRegex = /<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-6 leading-loose text-pretty">[\s\S]*?<\/p>/;
const newP = `<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-6 leading-loose text-pretty">
                感謝您對 AEVUM STUDIO 的關注。為了能更精準評估您的需求並提供初步估價，請花費 2 分鐘填寫以下意向表單。<br>
                收到表單後，我將於 2 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-4 font-normal leading-relaxed text-pretty">
                    Thank you for your interest in AEVUM STUDIO. To help us accurately assess your needs and provide a preliminary quote, please take 2 minutes to fill out the form below.<br>
                    We will contact you within 2 business days.
                </span>
            </p>`;
html = html.replace(oldPRegex, newP);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Footer replaced and paragraph formatted!');
