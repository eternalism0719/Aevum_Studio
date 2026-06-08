const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

const newPlatformHTML = `
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="platform-group">
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="電視廣告 / 戶外大螢幕"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">電視廣告 / 戶外大螢幕</span> <span class="text-xs opacity-50 whitespace-nowrap">TVC / Billboard</span></span>
    </label>
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="網路廣告 / 社群影片"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">網路廣告 / 社群影片</span> <span class="text-xs opacity-50 whitespace-nowrap">Social Media Ad</span></span>
    </label>
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="遊戲特效"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">遊戲特效</span> <span class="text-xs opacity-50 whitespace-nowrap">Game VFX</span></span>
    </label>
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="音樂 MV"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">音樂 MV</span> <span class="text-xs opacity-50 whitespace-nowrap">Music Video</span></span>
    </label>
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="個人作品"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">個人作品</span> <span class="text-xs opacity-50 whitespace-nowrap">Personal Project</span></span>
    </label>
    <label class="flex items-center space-x-3 cursor-pointer group">
        <input name="platform_cb" id="platform_other_cb" class="form-checkbox h-5 w-5 text-primary-container border-outline-variant bg-surface-container-low rounded focus:ring-primary-container focus:ring-offset-background" type="checkbox" value="其他"/>
        <span class="font-body-md text-text-primary break-keep group-hover:text-primary-container transition-colors"><span class="whitespace-nowrap">其他</span> <span class="text-xs opacity-50 whitespace-nowrap">Other</span></span>
    </label>
</div>
<input type="text" id="platform_other_input" name="platform_other_input" class="hidden w-full bg-surface-container-low border border-outline-variant text-text-primary rounded focus:ring-1 focus:ring-primary-container focus:border-primary-container input-scanline transition-all px-4 py-3 font-body-md mt-3" placeholder="請輸入其他投放平台 / Please specify">
`;

// Replace the old grid div for platform checkboxes
html = html.replace(/<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">[\s\S]*?<\/div>/, newPlatformHTML);

// Add the JS event listener logic for this new field
// And replace the payload mapping
const jsToggleLogic = `    // Toggle logic for 'Other' project type
    const ptypeOtherCb = document.getElementById('ptype_other_cb');
    const ptypeOtherInput = document.getElementById('project_type_other');
    if (ptypeOtherCb) {
        ptypeOtherCb.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                ptypeOtherInput.classList.remove('hidden');
                ptypeOtherInput.focus();
            } else {
                ptypeOtherInput.classList.add('hidden');
                ptypeOtherInput.value = '';
            }
        });
    }

    // Toggle logic for 'Other' platform
    const platformOtherCb = document.getElementById('platform_other_cb');
    const platformOtherInput = document.getElementById('platform_other_input');
    if (platformOtherCb) {
        platformOtherCb.addEventListener('change', (ev) => {
            if (ev.target.checked) {
                platformOtherInput.classList.remove('hidden');
                platformOtherInput.focus();
            } else {
                platformOtherInput.classList.add('hidden');
                platformOtherInput.value = '';
            }
        });
    }`;

// Wait, replacing the old toggle block.
html = html.replace(/    \/\/ Toggle logic for 'Other' project type[\s\S]*?    }\n/m, jsToggleLogic + '\n');


// Now replace the fetch mapping logic for platforms
const oldPlatformLogic = `        // 2. Get platforms
        const platformCheckboxes = Array.from(form.querySelectorAll('section:nth-of-type(2) input[type="checkbox"]:not([name="project_type_cb"]):checked'))
            .map(cb => cb.nextElementSibling.textContent.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim());`;

const newPlatformLogic = `        // 2. Get platforms
        let platformCheckboxes = Array.from(form.querySelectorAll('input[name="platform_cb"]:checked')).map(cb => cb.value);
        if (platformOtherCb && platformOtherCb.checked && platformOtherInput.value.trim() !== '') {
            platformCheckboxes = platformCheckboxes.filter(t => t !== '其他');
            platformCheckboxes.push(platformOtherInput.value.trim());
        }`;

html = html.replace(oldPlatformLogic, newPlatformLogic);

// Add hiding logic to the success block
html = html.replace("if(ptypeOtherInput) ptypeOtherInput.classList.add('hidden');", "if(ptypeOtherInput) ptypeOtherInput.classList.add('hidden');\n                if(platformOtherInput) platformOtherInput.classList.add('hidden');");

fs.writeFileSync('contact.html', html, 'utf8');
console.log('Platforms updated successfully!');
