const fs = require('fs');
let html = fs.readFileSync('contact.html', 'utf8');

// 1. Update Header
html = html.replace('3D 特效與動態設計', 'AEVUM STUDIO');
html = html.replace('3D VFX & Motion Design', 'Creative Studio');

// 2. Insert new "Project Type" section right after "預計結案日期" block
const projectTypeHTML = `
</div>

<div class="space-y-4 mb-8">
    <label class="font-label-data text-lg text-on-surface-variant uppercase flex items-center gap-2 mb-2 break-keep" for="project_type">
        <span class="material-symbols-outlined text-[16px] text-primary-container/70">category</span>
        案子類型 <span class="text-sm opacity-50 font-normal ml-2">Project Type</span>
    </label>
    <div class="flex flex-wrap gap-3" id="project-type-group">
        <label class="cursor-pointer">
            <input name="project_type_cb" class="peer sr-only" type="checkbox" value="3D"/>
            <span class="inline-block px-4 py-2 break-keep border border-outline-variant rounded-full font-body-md text-text-primary peer-checked:border-primary-container peer-checked:text-primary-container peer-checked:bg-[rgba(0,243,255,0.1)] transition-all">
                <span class="whitespace-nowrap">3D</span>
            </span>
        </label>
        <label class="cursor-pointer">
            <input name="project_type_cb" class="peer sr-only" type="checkbox" value="MG"/>
            <span class="inline-block px-4 py-2 break-keep border border-outline-variant rounded-full font-body-md text-text-primary peer-checked:border-primary-container peer-checked:text-primary-container peer-checked:bg-[rgba(0,243,255,0.1)] transition-all">
                <span class="whitespace-nowrap">MG</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Motion Graphics</span>
            </span>
        </label>
        <label class="cursor-pointer">
            <input name="project_type_cb" class="peer sr-only" type="checkbox" value="AI"/>
            <span class="inline-block px-4 py-2 break-keep border border-outline-variant rounded-full font-body-md text-text-primary peer-checked:border-primary-container peer-checked:text-primary-container peer-checked:bg-[rgba(0,243,255,0.1)] transition-all">
                <span class="whitespace-nowrap">AI</span>
            </span>
        </label>
        <label class="cursor-pointer">
            <input name="project_type_cb" class="peer sr-only" type="checkbox" value="2D_VFX"/>
            <span class="inline-block px-4 py-2 break-keep border border-outline-variant rounded-full font-body-md text-text-primary peer-checked:border-primary-container peer-checked:text-primary-container peer-checked:bg-[rgba(0,243,255,0.1)] transition-all">
                <span class="whitespace-nowrap">2D VFX</span>
            </span>
        </label>
        <label class="cursor-pointer">
            <input name="project_type_cb" id="ptype_other_cb" class="peer sr-only" type="checkbox" value="其他"/>
            <span class="inline-block px-4 py-2 break-keep border border-outline-variant rounded-full font-body-md text-text-primary peer-checked:border-primary-container peer-checked:text-primary-container peer-checked:bg-[rgba(0,243,255,0.1)] transition-all">
                <span class="whitespace-nowrap">其他</span> <span class="text-xs opacity-50 whitespace-nowrap ml-1">Other</span>
            </span>
        </label>
    </div>
    <input type="text" id="project_type_other" name="project_type_other" class="hidden w-full bg-surface-container-low border border-outline-variant text-text-primary rounded focus:ring-1 focus:ring-primary-container focus:border-primary-container input-scanline transition-all px-4 py-3 font-body-md mt-3" placeholder="請輸入其他案子類型 / Please specify">
</div>
`;

// Inject into HTML by replacing the end of the date block
html = html.replace(/<\/div>\s*<div class="space-y-4">[\s]*<label class="font-label-data text-lg text-on-surface-variant uppercase flex items-center gap-2 mb-2 break-keep" for="undefined">[\s]*<span class="material-symbols-outlined text-\[16px\] text-primary-container\/70">devices<\/span>作品最終用途 \/ 投放平台/, projectTypeHTML + '\n<div class="space-y-4">\n<label class="font-label-data text-lg text-on-surface-variant uppercase flex items-center gap-2 mb-2 break-keep" for="undefined">\n<span class="material-symbols-outlined text-[16px] text-primary-container/70">devices</span>作品最終用途 / 投放平台');

// 3. Rewrite the javascript
const oldJSStart = `// 1. Get text inputs and textareas`;
const oldJSEnd = `            "備註": textInputs[7] ? textInputs[7].value : ""
        };`;

const newJS = `
        // Toggle logic for 'Other' project type
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
        
        // Form submit handler is already wrapping this. Wait, the event listener for toggle needs to be OUTSIDE the submit handler, but inside DOMContentLoaded.
`;

// Actually, I'll completely replace the <script> logic at the bottom to be clean and bug-free.
const fullNewScript = `<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if(!form) return;
    
    // Toggle logic for 'Other' project type
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin inline-block">sync</span> 傳送中...';
        btn.disabled = true;
        
        // 1. Get project types
        let projectTypes = Array.from(form.querySelectorAll('input[name="project_type_cb"]:checked')).map(cb => cb.value);
        if (ptypeOtherCb && ptypeOtherCb.checked && ptypeOtherInput.value.trim() !== '') {
            // Replace '其他' with the actual text or just append it
            projectTypes = projectTypes.filter(t => t !== '其他');
            projectTypes.push(ptypeOtherInput.value.trim());
        }

        // 2. Get platforms
        const platformCheckboxes = Array.from(form.querySelectorAll('section:nth-of-type(2) input[type="checkbox"]:not([name="project_type_cb"]):checked'))
            .map(cb => cb.nextElementSibling.textContent.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim());
            
        // 3. Get styles
        const styleCheckboxes = Array.from(form.querySelectorAll('section:nth-of-type(3) input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim());
            
        // 4. Get budget radio
        const budgetRadio = form.querySelector('input[name="budget"]:checked');
        const budget = budgetRadio ? budgetRadio.nextElementSibling.textContent.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim() : "";

        // Collect exact IDs for robust mapping
        const val = (id) => { const el = document.getElementById(id); return el ? el.value : ""; };

        const data = {
            "專案名稱": val('project_name'),
            "案子類型": projectTypes,
            "稱呼 / 單位名稱": val('client_name'),
            "聯絡人": val('contact_person'),
            "信箱": val('email'),
            "方便聯絡時間": val('contact_time'),
            "交期": val('deadline'),
            "投放平台": platformCheckboxes,
            "預期風格": styleCheckboxes,
            "預算區間": budget,
            "參考連結": val('reference_url'),
            "備註": val('notes')
        };

        try {
            const response = await fetch('https://hook.us2.make.com/uhkktf2193miwu5y2xckhqh4j6bafu2w', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if(response.ok || response.status === 200 || response.status === 201) {
                btn.innerHTML = '<span class="material-symbols-outlined inline-block">check_circle</span> 傳送成功！';
                btn.classList.add('bg-primary', 'text-on-primary');
                form.reset();
                if(ptypeOtherInput) ptypeOtherInput.classList.add('hidden');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-primary', 'text-on-primary');
                    btn.disabled = false;
                }, 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            btn.innerHTML = '<span class="material-symbols-outlined inline-block">error</span> 傳送失敗，請重試';
            btn.classList.add('bg-red-500', 'text-white');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-red-500', 'text-white');
                btn.disabled = false;
            }, 3000);
        }
    });
});
</script>`;

html = html.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/, fullNewScript);

fs.writeFileSync('contact.html', html, 'utf8');
console.log('contact.html updated with Project Type!');
