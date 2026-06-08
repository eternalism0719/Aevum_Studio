const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Remove redundant top nav
html = html.replace(/<nav class="fixed top-0 w-full h-\[80px\] bg-glass-surface backdrop-blur-xl border-b border-border-low shadow-\[0_0_20px_rgba\(0,243,255,0\.15\)\] flex justify-between items-center px-margin-page w-full max-w-full z-\[100\]">[\s\S]*?<\/nav>/g, '');

// 2. Increase label size and make them bilingual with formatting
const labelReplacements = [
    { old: '稱呼 / 單位名稱', new: '稱呼 / 單位名稱 <span class="text-sm opacity-50 font-normal ml-2">Company / Name</span>' },
    { old: '聯絡人姓名', new: '聯絡人姓名 <span class="text-sm opacity-50 font-normal ml-2">Contact Person</span>' },
    { old: '聯絡信箱', new: '聯絡信箱 <span class="text-sm opacity-50 font-normal ml-2">Email Address</span>' },
    { old: '方便聯絡的時間', new: '方便聯絡的時間 <span class="text-sm opacity-50 font-normal ml-2">Preferred Time</span>' },
    { old: '專案名稱', new: '專案名稱 <span class="text-sm opacity-50 font-normal ml-2">Project Name</span>' },
    { old: '預計結案日期', new: '預計結案日期 <span class="text-sm opacity-50 font-normal ml-2">Expected Deadline</span>' },
    { old: '作品最終用途 / 投放平台', new: '作品最終用途 / 投放平台 <span class="text-sm opacity-50 font-normal ml-2">Target Platform</span>' },
    { old: '參考風格影片連結', new: '參考風格影片連結 <span class="text-sm opacity-50 font-normal ml-2">Reference Links</span>' },
    { old: '預期視覺風格關鍵字', new: '預期視覺風格關鍵字 <span class="text-sm opacity-50 font-normal ml-2">Visual Style</span>' },
    { old: '專案預算區間', new: '專案預算區間 <span class="text-sm opacity-50 font-normal ml-2">Budget Range</span>' },
    { old: '其他備註或想對我說的話', new: '其他備註或想對我說的話 <span class="text-sm opacity-50 font-normal ml-2">Additional Notes</span>' }
];

labelReplacements.forEach(rep => {
    // We target the exact innerHTML. The Node script earlier changed it to include icons.
    // E.g.: <span class="material-symbols-outlined text-[16px] text-primary-container/70">corporate_fare</span>稱呼 / 單位名稱
    let oldRegex = new RegExp(`(<span class="material-symbols-outlined[^>]*>.*?</span>)${rep.old.replace(/\//g, '\\/')}`, 'g');
    html = html.replace(oldRegex, `$1${rep.new}`);
});

// Update label font size (text-label-data is 12px -> scale to 18px using text-lg)
html = html.replace(/text-label-data/g, 'text-lg');

// 3. Update Checkboxes/Radios to Bilingual and ensure no weird wraps
const optionReplacements = [
    { old: '電視廣告 (TVC) / 戶外大螢幕', new: '<span class="whitespace-nowrap">電視廣告 / 戶外大螢幕</span> <span class="text-xs opacity-50 whitespace-nowrap">TVC / Billboard</span>' },
    { old: '網路廣告 / 社群影片', new: '<span class="whitespace-nowrap">網路廣告 / 社群影片</span> <span class="text-xs opacity-50 whitespace-nowrap">Social Media Ad</span>' },
    { old: '遊戲特效 / 動畫影集', new: '<span class="whitespace-nowrap">遊戲特效 / 動畫影集</span> <span class="text-xs opacity-50 whitespace-nowrap">Game VFX / Animation</span>' },
    { old: 'MV / 藝人演出視覺', new: '<span class="whitespace-nowrap">MV / 藝人演出視覺</span> <span class="text-xs opacity-50 whitespace-nowrap">Music Video / Live Visuals</span>' },
    { old: 'AR / VR / 互動裝置', new: '<span class="whitespace-nowrap">AR / VR / 互動裝置</span> <span class="text-xs opacity-50 whitespace-nowrap">AR / VR / Interactive</span>' },
    { old: '其他', new: '<span class="whitespace-nowrap">其他</span> <span class="text-xs opacity-50 whitespace-nowrap">Other</span>' },
    
    { old: '科技未來 / 賽博朋克', new: '<span class="whitespace-nowrap">科技未來 / 賽博朋克</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Sci-Fi / Cyberpunk</span>' },
    { old: '寫實自然', new: '<span class="whitespace-nowrap">寫實自然</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Realistic / Natural</span>' },
    { old: '奇幻魔法', new: '<span class="whitespace-nowrap">奇幻魔法</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Fantasy / Magic</span>' },
    { old: '簡約現代', new: '<span class="whitespace-nowrap">簡約現代</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Minimal / Modern</span>' },
    { old: '微光半透明', new: '<span class="whitespace-nowrap">微光半透明</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Translucent</span>' },
    
    { old: 'NT\\$ 20,000 以下', new: '<span class="whitespace-nowrap">NT$ 20,000 以下</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Under 20k</span>' },
    { old: 'NT\\$ 20,000 - NT\\$ 50,000', new: '<span class="whitespace-nowrap">NT$ 20,000 - NT$ 50,000</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">20k - 50k</span>' },
    { old: 'NT\\$ 50,000 - NT\\$ 100,000', new: '<span class="whitespace-nowrap">NT$ 50,000 - NT$ 100,000</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">50k - 100k</span>' },
    { old: 'NT\\$ 100,000 以上', new: '<span class="whitespace-nowrap">NT$ 100,000 以上</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Above 100k</span>' },
    { old: '目前無明確預算，需聽取報價建議', new: '<span class="whitespace-nowrap">無明確預算，需聽取建議</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Open to Quote</span>' }
];

optionReplacements.forEach(rep => {
    // Match the inner text inside the span exactly
    let oldRegex = new RegExp(`>\\s*${rep.old.replace(/\//g, '\\/').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}\\s*<\\/span>`, 'g');
    html = html.replace(oldRegex, `>${rep.new}</span>`);
});

// Since the JS payload uses `textContent.trim()`, it will now grab the Chinese and English text concatenated. 
// E.g., "電視廣告 / 戶外大螢幕 TVC / Billboard". This is perfectly fine.

// Replace top padding gap to look better
html = html.replace(/<div style="padding-top: 100px;"><\/div>/g, '<div style="padding-top: 40px;"></div>');

fs.writeFileSync('contact.html', html, 'utf8');
console.log('contact.html updated successfully with bilingual texts and formatting!');
