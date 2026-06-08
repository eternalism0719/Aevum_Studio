const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// Replace the h1 block
const oldH1 = `<h1 class="font-display-hero text-display-hero text-primary mb-6 uppercase tracking-widest">
                3D 特效與動態設計<br/>
<span class="text-primary-container">合作洽談預約表</span>
</h1>`;

const newH1 = `<h1 class="font-display-hero text-3xl md:text-5xl lg:text-6xl text-primary mb-8 uppercase tracking-widest leading-tight break-keep">
    <div class="mb-4">
        3D 特效與動態設計
        <span class="text-lg md:text-2xl opacity-50 block mt-1 tracking-normal font-body-md uppercase">3D VFX & Motion Design</span>
    </div>
    <div class="text-primary-container">
        合作洽談預約表
        <span class="text-lg md:text-2xl opacity-50 block mt-1 tracking-normal font-body-md uppercase">Project Inquiry Form</span>
    </div>
</h1>`;

html = html.replace(oldH1, newH1);

// Replace the paragraph block
const oldP = `<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-4 leading-relaxed">
                感謝您對 AEVUM STUDIO 的關注。為了能更精準評估您的需求並提供初步估價，請花費 2 分鐘填寫以下意向表單。收到表單後，我將於 2 個工作天內主動與您聯絡。
            </p>`;

const newP = `<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-4 leading-relaxed">
                感謝您對 AEVUM STUDIO 的關注。為了能更精準評估您的需求並提供初步估價，請花費 2 分鐘填寫以下意向表單。收到表單後，我將於 2 個工作天內主動與您聯絡。<br>
                <span class="text-sm opacity-60 block mt-2 font-normal">Thank you for your interest in AEVUM STUDIO. To help us accurately assess your needs and provide a preliminary quote, please take 2 minutes to fill out the form below. We will contact you within 2 business days.</span>
            </p>`;

html = html.replace(oldP, newP);

// Also add English to the lightbulb reminder
const oldReminder = `<p class="font-body-md text-body-md text-text-muted flex items-center justify-center md:justify-start gap-2">
<span class="material-symbols-outlined text-secondary">lightbulb</span>
                填寫本表單不代表合作成立。正式合作皆需簽署合約並支付訂金後方開始排程製作。
            </p>`;

const newReminder = `<div class="font-body-md text-body-md text-text-muted flex items-start justify-center md:justify-start gap-2">
    <span class="material-symbols-outlined text-secondary mt-1">lightbulb</span>
    <div>
        填寫本表單不代表合作成立。正式合作皆需簽署合約並支付訂金後方開始排程製作。<br>
        <span class="text-sm opacity-60 mt-1 block">Submitting this form does not constitute a formal agreement. Official projects require a signed contract and deposit before production scheduling.</span>
    </div>
</div>`;

html = html.replace(oldReminder, newReminder);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('contact.html updated with smaller responsive header and bilingual text!');
