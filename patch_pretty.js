const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Update Header Letter Spacing
html = html.replace(/<div class="mb-2" style="font-family: 'Anson', sans-serif; letter-spacing: 4px;">/g, '<div class="mb-2" style="font-family: \'Anson\', sans-serif; letter-spacing: 12px; margin-right: -12px;">'); // Negative margin to offset the extra spacing on the last letter for better alignment

// 2. Remove manual <br> and apply text-pretty to the main paragraph
const oldPRegex = /<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-6 leading-loose">[\s\S]*?<\/p>/;
const newP = `<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-6 leading-loose text-pretty">
                感謝您對 AEVUM STUDIO 的關注。為了能更精準評估您的需求並提供初步估價，請花費 2 分鐘填寫以下意向表單。收到表單後，我將於 2 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-4 font-normal leading-relaxed text-pretty">
                    Thank you for your interest in AEVUM STUDIO. To help us accurately assess your needs and provide a preliminary quote, please take 2 minutes to fill out the form below. We will contact you within 2 business days.
                </span>
            </p>`;
html = html.replace(oldPRegex, newP);

// 3. Remove manual <br> and apply text-pretty to the lightbulb reminder
const oldReminderRegex = /<div class="font-body-md text-body-md text-text-muted flex items-start justify-center md:justify-start gap-3">[\s\S]*?<\/div>\s*<\/div>/;
const newReminder = `<div class="font-body-md text-body-md text-text-muted flex items-start justify-center md:justify-start gap-3">
    <span class="material-symbols-outlined text-secondary mt-1">lightbulb</span>
    <div class="leading-loose text-pretty">
        填寫本表單不代表合作成立。正式合作皆需簽署合約並支付訂金後方開始排程製作。<br>
        <span class="text-sm opacity-60 mt-2 block leading-relaxed text-pretty">
            Submitting this form does not constitute a formal agreement. Official projects require a signed contract and deposit before production scheduling.
        </span>
    </div>
</div>`;
html = html.replace(oldReminderRegex, newReminder);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Text-pretty applied and letter-spacing increased!');
