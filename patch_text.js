const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

const oldText = `請花費 2 分鐘填寫以下意向表單。<br>
                收到表單後，我將於 2 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-4 font-normal leading-relaxed text-pretty">
                    Thank you for your interest in AEVUM STUDIO. To help us accurately assess your needs and provide a preliminary quote, please take 2 minutes to fill out the form below.<br>
                    We will contact you within 2 business days.
                </span>`;

const newText = `請花費幾分鐘填寫以下意向表單。<br>
                收到表單後，我將於 3-5 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-4 font-normal leading-relaxed text-pretty">
                    Thank you for your interest in AEVUM STUDIO. To help us accurately assess your needs and provide a preliminary quote, please take a few minutes to fill out the form below.<br>
                    We will contact you within 3-5 business days.
                </span>`;

html = html.replace(oldText, newText);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Text updated!');
