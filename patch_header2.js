const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Update Header (Remove English subtitles, Apply Anson font)
const oldHeaderRegex = /<h1 class="font-display-hero[^>]*>[\s\S]*?<\/h1>/;
const newHeader = `<h1 class="font-display-hero text-4xl md:text-5xl lg:text-6xl text-primary mb-8 uppercase tracking-widest leading-tight break-keep">
    <div class="mb-2" style="font-family: 'Anson', sans-serif; letter-spacing: 4px;">
        AEVUM STUDIO
    </div>
    <div class="text-primary-container">
        合作洽談預約表
    </div>
</h1>`;
html = html.replace(oldHeaderRegex, newHeader);

// 2. Format the main paragraph to break at punctuation
const oldPRegex = /<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-4 leading-relaxed">[\s\S]*?<\/p>/;
const newP = `<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-6 leading-loose">
                感謝您對 AEVUM STUDIO 的關注。<br class="hidden sm:inline">
                為了能更精準評估您的需求並提供初步估價，<br class="hidden lg:inline">
                請花費 2 分鐘填寫以下意向表單。<br class="hidden sm:inline">
                收到表單後，我將於 2 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-4 font-normal leading-relaxed">
                    Thank you for your interest in AEVUM STUDIO.<br class="hidden sm:inline">
                    To help us accurately assess your needs and provide a preliminary quote,<br class="hidden lg:inline">
                    please take 2 minutes to fill out the form below.<br class="hidden sm:inline">
                    We will contact you within 2 business days.
                </span>
            </p>`;
html = html.replace(oldPRegex, newP);

// 3. Format the lightbulb reminder paragraph to break at punctuation
const oldReminderRegex = /<div class="font-body-md text-body-md text-text-muted flex items-start justify-center md:justify-start gap-2">[\s\S]*?<\/div>\s*<\/div>/;
const newReminder = `<div class="font-body-md text-body-md text-text-muted flex items-start justify-center md:justify-start gap-3">
    <span class="material-symbols-outlined text-secondary mt-1">lightbulb</span>
    <div class="leading-loose">
        填寫本表單不代表合作成立。<br class="hidden sm:inline">
        正式合作皆需簽署合約並支付訂金後方開始排程製作。<br>
        <span class="text-sm opacity-60 mt-2 block leading-relaxed">
            Submitting this form does not constitute a formal agreement.<br class="hidden sm:inline">
            Official projects require a signed contract and deposit before production scheduling.
        </span>
    </div>
</div>`;
html = html.replace(oldReminderRegex, newReminder);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Header, fonts, and line breaks updated!');
