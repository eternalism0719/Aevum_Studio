const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Remove emoji
html = html.replace('💡 填寫本表單不代表合作成立', '填寫本表單不代表合作成立');

// 2. Add icons to labels and fix text wrapping (break-keep)
const iconMap = {
    '稱呼 / 單位名稱': 'corporate_fare',
    '聯絡人姓名': 'badge',
    '聯絡信箱': 'mail',
    '方便聯絡的時間': 'schedule',
    '專案名稱': 'edit_square',
    '預計結案日期': 'event',
    '作品最終用途 / 投放平台': 'devices',
    '參考風格影片連結': 'link',
    '預期視覺風格關鍵字': 'style',
    '專案預算區間': 'payments',
    '其他備註或想對我說的話': 'chat'
};

for (const [text, icon] of Object.entries(iconMap)) {
    const escapedText = text.split('/').join('\\/');
    const regex = new RegExp(`<label class="(.*?)">(.*?)${escapedText}(.*?)<\\/label>`, 'g');
    
    html = html.replace(regex, (match, p1, p2, p3) => {
        let newClass = p1;
        if (!newClass.includes('flex')) newClass += ' flex items-center gap-2 mb-2 break-keep';
        else newClass += ' break-keep mb-2';
        
        return `<label class="${newClass}"><span class="material-symbols-outlined text-[16px] text-primary-container/70">${icon}</span>${text}</label>`;
    });
}

// Ensure the spans for radio and checkbox have break-keep
html = html.replace(/<span class="font-body-md text-text-primary(.*?)">/g, '<span class="font-body-md text-text-primary break-keep$1">');
html = html.replace(/<span class="inline-block px-4 py-2 (.*?)">/g, '<span class="inline-block px-4 py-2 break-keep $1">');

fs.writeFileSync('contact.html', html, 'utf8');
console.log('contact.html updated with UX/UI improvements!');
