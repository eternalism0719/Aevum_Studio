const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Remove the missing glitch.css
html = html.replace('<link rel="stylesheet" href="css/glitch.css">', '');

// 2. Add id and name to the text inputs and link them to labels
const inputsMap = [
    { text: '稱呼 / 單位名稱', id: 'client_name', type: 'text' },
    { text: '聯絡人姓名', id: 'contact_person', type: 'text' },
    { text: '聯絡信箱', id: 'email', type: 'email' },
    { text: '方便聯絡的時間', id: 'contact_time', type: 'text' },
    { text: '專案名稱', id: 'project_name', type: 'text' },
    { text: '預計結案日期', id: 'deadline', type: 'date' },
    { text: '參考風格影片連結', id: 'reference_url', type: 'textarea' },
    { text: '其他備註或想對我說的話', id: 'notes', type: 'textarea' }
];

inputsMap.forEach(item => {
    // Escape text for regex
    const escapedText = item.text.replace(/\//g, '\\/');
    
    // Replace <label ...> with <label for="id" ...>
    const labelRegex = new RegExp(`(<label class="[^"]*")>(<span[^>]*><\\/span>)?${escapedText}`, 'g');
    html = html.replace(labelRegex, `$1 for="${item.id}">$2${item.text}`);
    
    // Replace the input following it. This is slightly tricky, we'll do it by replacing the first input/textarea after the label.
    // Actually, safer to just replace the placeholders or exact classes.
});

// Manual exact string replacements for the inputs to add id and name:
html = html.replace(/placeholder="例如：XX 製作公司、個人創作者" type="text"/, 'id="client_name" name="client_name" placeholder="例如：XX 製作公司、個人創作者" type="text"');
html = html.replace(/placeholder="如何稱呼您" type="text"/, 'id="contact_person" name="contact_person" placeholder="如何稱呼您" type="text"');
html = html.replace(/placeholder="name@example\.com" type="email"/, 'id="email" name="email" placeholder="name@example.com" type="email"');
html = html.replace(/placeholder="例如：平日 10:00-18:00、隨時皆可" type="text"/, 'id="contact_time" name="contact_time" placeholder="例如：平日 10:00-18:00、隨時皆可" type="text"');
html = html.replace(/placeholder="例如：2026 夏季新品發表、音樂 MV 特效" type="text"/, 'id="project_name" name="project_name" placeholder="例如：2026 夏季新品發表、音樂 MV 特效" type="text"');
html = html.replace(/color-scheme-dark" type="date"\/>/, 'color-scheme-dark" id="deadline" name="deadline" type="date"/>');
html = html.replace(/placeholder="請提供 1-2 個 YouTube \/ Vimeo 連結" rows="2"><\/textarea>/, 'id="reference_url" name="reference_url" placeholder="請提供 1-2 個 YouTube / Vimeo 連結" rows="2"></textarea>');
html = html.replace(/placeholder="有任何特殊需求\.\.\." rows="4"><\/textarea>/, 'id="notes" name="notes" placeholder="有任何特殊需求..." rows="4"></textarea>');

// For checkboxes, Chrome says "form field element should have an id or name".
// They are inside <label> so they are associated, but they lack `name`.
html = html.replace(/<input class="form-checkbox/g, '<input name="platform_or_other" class="form-checkbox');
html = html.replace(/<input class="peer sr-only" type="checkbox"\/>/g, '<input name="style_checkbox" class="peer sr-only" type="checkbox"/>');

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Accessibility issues fixed!');
