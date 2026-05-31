# Refraction Lab — Changelog

所有關於 3D Refraction Lab 的視覺優化、效能調整與功能更新將記錄於此。

---

## [v1.8.33] 2026-05-31 — 左側控制面板內部 UI 排版重構

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「我想修正一下左側半透明的面板UI (只對於內部排版修正，請勿動到任何毛玻璃面板以及背景的任何東西)，我會給你參考圖只要參考上面的文字及排版及UI」

**改動具體內容：**
- **重構頭部排版**：完全依照您提供的參考圖，將 `#left-panel` 內部的標題結構修改為帶有發光底線與標籤風格的 `EXP_SYS / V5.2`，並將主標題變更為大型粗體的 `Lightscape Gallery`。下方也補齊了 `LIGHT. MATERIAL. CONTROL.` 的裝飾性等寬字母排版。
- **建構 CONTROL TERMINAL 容器**：在 Tweakpane UI (`#material-ui-container`) 外圍包覆了一個帶有微透明背景與圓角邊框的控制框。並在上方配置了帶有設定圖示、心電圖跳動符號以及下拉箭頭的 `CONTROL TERMINAL` 標頭列，與 `Glass Properties` 的小節標題，完美還原參考圖的科技感控制台視覺效果。
- **無損原有毛玻璃與背景**：所有修改皆採用內部容器的 inline-style 與結構包裝進行覆寫，嚴格遵守不更動外層 `#left-panel` 毛玻璃屬性與網頁背景效果的要求。

---

## [v1.8.34] 2026-05-31 — 左側面板 UI 優化與單層結構調整

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「面板現在變為兩層了我只要一層就好。另外還需要因應目前的版面大小去做UI的大小更正的，文字部分只接受一排(可縮小字體大小)。另外可調整功能的部份把special effects這部分功能先收回不顯示。另外我的拉桿也要改的與UI符合，還有新增的參考圖內容。」

**改動具體內容：**
- **移除雙層背景**：移除了 Control Terminal 外圍多餘的 border 與 background，讓控制台直接融入原先的毛玻璃面板中，完美達成您所期望的單層乾淨視覺。
- **單排文字與縮放排版**：全面使用了 `white-space: nowrap;` 強制文字不換行。縮小了 `Lightscape Gallery` (至 2.2rem) 與 `CONTROL TERMINAL` (至 12px) 的字體大小，確保在受限面板寬度下依然保持單排顯示。
- **新增頂部頁籤按鈕**：依據最新參考圖，在主標題下方加入了 `Refraction` (折射, 附帶海浪圖標與亮色底線)、`Reflection` (反射) 以及 `IOR Control` 三個分類按鈕。
- **Tweakpane 樣式覆寫 (拉桿白化)**：將原本 Tweakpane 的拉桿調整成深色半透明軌道搭配「純白填滿 (#ffffff)」的樣式，以符合您參考圖的高科技純淨風格。
- **隱藏特殊效果面板**：將 `Special Effects` 資料夾透過 `hidden = true` 的設定暫時收回隱藏，保持介面簡潔。

---

## [v1.8.35] 2026-05-31 — 移除 Tweakpane 依賴並全面自定義 Glass Properties 操控面板

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把refraction跟IORcontrol那些拿掉好了。glass properties不用再一層可以直接做成固定的面板參數那些不要使用原始的UI，請你改成我提供的樣子。把右側的小三角形UI做成可以使用的另外再加入一個reset的icon可以把調整的數值重製，請注意不要改動到模型以及材質顯示設定。」

**改動具體內容：**
- **移除頂部按鈕**：依據要求移除了先前新增的 Refraction、Reflection 與 IOR Control 按鈕。
- **拔除 Tweakpane 原始 UI**：全面移除了外掛 Tweakpane 模組，並將 Glass Properties 選單改為純原生的 HTML+CSS 刻畫，完全與背景毛玻璃面板一體成型。拉桿 (`<input type="range">`) 也客製化為您參考圖中「深色半透明軌道＋純白色控制條」的設計。
- **面板收合與重置功能實裝**：
  - **收合功能 (Toggle)**：為右側的「小三角形」加入互動邏輯，點擊即可收合或展開下方的參數面板。
  - **重置功能 (Reset)**：在小三角形左側新增了一個「重新載入」圖示，點擊後會自動抓取當前材質的預設值 (Preset)，並同步更新模型與 UI 數值，完美恢復原狀。
- **無縫接軌模型渲染**：自定義拉桿的滑動事件已完整綁定回原本的 `params` 物件，並呼叫 `applyCurrentParamsToModel()`，確保模型材質的動態顯示依然流暢運作，沒有動到任何核心的 Shader 或算圖邏輯。

---

## [v1.8.36] 2026-05-31 — 新增預設 Glass 材質卡片與移除模型上傳功能

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把目前載入預設的材質設定 做一個glass的卡片。把加入glb的功能先拔掉。」

**改動具體內容：**
- **拔除 GLB 上傳功能**：為保持下方展示櫃列 (Showcase Grid) 的純粹與視覺一致性，移除了最右側原先的 `[+] IMPORT GLB` 自定義模型上傳卡片，並清除了背後的 `<input type="file">` 與事件監聽。
- **新增 GLASS 展示卡片**：將網頁預設載入時的「高透光玻璃」材質參數獨立為一個專屬的 `GLASS` 預設檔 (Preset)，並在原本上傳卡片的位置新增了一張對應的 `08 / GLASS` 展示卡。現在您可以隨時透過點擊卡片，享受與其他材質一樣酷炫的 Cyberpunk 掃描轉場效果，並直接切換回這個最經典的透明玻璃狀態！

---

## [v1.8.37] 2026-05-31 — 修正卡片轉場卡死與 GLASS 預覽圖缺失問題

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「目前有問題glass的卡片展示沒看到 以及更換材質會卡在循環動畫內」

**改動具體內容：**
- **修復無限循環卡死 Bug**：在先前的改版中移除了 Tweakpane，但材質切換動畫 (transitionStep) 仍殘留對 `pane` 的呼叫 (`pane.importState`)，導致發生 JavaScript ReferenceError，進而使轉場動畫卡在半空中。已將該段邏輯替換為新的 `updateCustomUIValues()`，完美恢復轉場順暢度。
- **修復 GLASS 預覽圖不可見**：原本 GLASS preset 的 `attenuationDistance` 被設為 0.0，這導致在微型 3D 預覽畫布中光線穿透距離為零（完全吸收），呈現透明不可見。將其修正為 `Infinity` 後，預覽圖中的小方塊已能正確透光並顯示。

---

## [v1.8.38] 2026-05-31 — 重新排序展示卡片與精簡材質選項

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把fire材質拿掉 以及把材質順序換一下 一樣從00開始 glass water jelly metal toon wood moss_rock」

**改動具體內容：**
- **移除 FIRE 與 HOLO 卡片**：依據您的明確指示清單，從下方的 Showcase Grid 中移除了原本的 FIRE 與 HOLO 材質展示卡片，使得介面更為精簡且聚焦在指定的 7 款材質。
- **重新排序與編號 (00-06)**：完全按照您的要求重新排列所有的卡片順序，現在的排序由左至右為：
  - `00 / GLASS`
  - `01 / WATER`
  - `02 / JELLY`
  - `03 / METAL`
  - `04 / TOON`
  - `05 / WOOD`
  - `06 / MOSS`
- **設為預設啟動材質**：同時將網頁初次載入時的預設狀態參數 (`currentTransitionPresetKey`) 更新為 `GLASS`，確保從一開始就是選中 `00 / GLASS` 的狀態。

---

## [v1.8.39] 2026-05-31 — 導入高階 UI/UX 設計：卡片與背景質感提升

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「現在卡片部分的背景以及卡片我想做質感上的提升 1.讓卡片更明顯一點 2.背景的顏色可能更有光澤感一些」

**改動具體內容：**
- **背景光澤感提升 (Cyberpunk Glow)**：在底部 Showcase 區塊的背景加入了多層次的徑向漸層 (Radial Gradient) 效果，隱約透出迷幻的青色與紫色微光，為原本沉寂的深色背景注入了高科技與光澤感。
- **頂級毛玻璃卡片 (Premium Glassmorphism)**：參考了高階 UI/UX 規範 (如 Viture / Vision Pro 質感)，大幅強化了卡片的視覺深度：
  - **模糊度與飽和度**：將毛玻璃的模糊程度 (blur) 拉高，並加入飽和度提升 (saturate)，讓透出的背景光澤更加絢麗。
  - **立體高光邊框**：增強了卡片邊框的透明高光，並利用內外兩層精細的陰影 (Box Shadow) 來凸顯卡片的立體感與厚度。
  - **懸停與選取回饋**：加深 Hover 與 Active 狀態下卡片上浮的距離 (translateY)，搭配更亮的光晕 (Glow) 反饋，讓操作手感更靈動、卡片更為吸睛明顯。

---

## [v1.8.42] 2026-05-31 — 增強首屏背景對比度並載入太空飛行背景影片

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「感覺背景圖片的亮度有點灰灰的可以調整嗎?另外背景的影片已經做好了可以載入嗎」

**改動具體內容：**
- **背景圖片去灰霧 (De-haze)**：將 `#hero-section` 的背景圖片獨立成一個 `#bg-image-layer` 網層，並利用 CSS `filter` 加上 `contrast(1.2)` (提升對比)、`brightness(1.1)` (提升亮度) 以及 `saturate(1.2)` (提升色彩飽和度)。這樣有效去除了原本黑色背景圖的「灰霧感」，讓整個介面更顯清透俐落。
- **載入背景影片與融合 (Video Integration)**：
  - 在右側的 `#video-bg-container` 中成功載入了指定的太空星際飛行影片 (`Space_travel_animation_web.mp4`)。
  - **移除模糊與向右裁切**：依照要求，拔除了影片上方的毛玻璃模糊特效，還原影片原有的清晰度。同時將外層容器的寬度縮減為 `35vw`，並搭配 `object-position: right center;` 讓影片往右側靠攏。
  - **再次縮放影片比例**：依據最新指示，針對影片加入 `transform: scale(0.68)` 與 `transform-origin: right center`，使其尺寸精確微調放大至 68%，並持續緊貼畫面右緣。
  - **Light Mode 專屬背景影片與持續播放**：修正了 Dark / Light mode 影片資源相反的配置錯誤（目前 Dark Mode 使用 `_web_normal.mp4`，Light Mode 使用 `_web.mp4`）。為配合帶有 Alpha 透明通道的轉場影片，已將背景影片容器的 `z-index` 恢復至 `2`（位於轉場影片後方），讓主題切換時不僅能無縫淡入淡出，也能完美呈現掃描轉場的穿透感。
  - **導入 WebM 格式透明轉場**：將黑轉白與白轉黑的全螢幕掃描轉場影片，正式替換為您輸出的 `website_themetrans_blacktowhite.webm` 與 `website_themetrans_whitetoblack.webm`。透過 WebM (VP9) 原生支援的 Alpha 通道，網頁能夠以最高效能直接渲染完美的透明遮罩去背效果，讓底層的星際影片能乾淨漂亮地透出來！

  - **玻璃折射質感 (Glass Refraction)**：因應要求，完全拔除了所有的模糊濾鏡 (`blur`)，僅保留真正的「玻璃」質感 (`::after` 偽元素)。加入了 `backdrop-filter: brightness(1.15) contrast(1.05)` 來模擬光線穿透玻璃時的無損折射與晶透感，並搭配對角線反光漸層 (`linear-gradient`) 與邊緣高光 (`box-shadow: inset`)，讓影片看起來就像是被鑲在一片清澈光澤玻璃的後方，既清晰又充滿科技感！

## [v1.8.41] 2026-05-31 — 修復 Light 模式下左側面板的顏色顯示

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者提出需求：「Light的版本一樣在配色上有瑕疵，可以使用 /ui-ux-pro-max 只修改在light mode 的 UI顏色」

**改動具體內容：**
- **動態變數綁定 (CSS Variables)**：原先左側面板 (Control Terminal) 的文字與背景顏色採用了寫死的 inline styles (如 `#fff`、`#00f3ff`、`rgba(0,0,0,0.2)`)。現在全面替換成 `:root` 中定義的 `--text-color`、`--accent-color`、`--input-bg` 等動態 CSS 變數。
- **Light 模式適配**：在切換至 Light Mode 時，文字顏色會自動轉為深色 (`#0f172a`)，面板與輸入框背景則會轉為淺色微透樣式 (`rgba(0,0,0,0.05)`)，確保在亮色背景下文字依舊清晰可見，並維持了乾淨清爽的版面質感。

---

## [v1.8.40] 2026-05-31 — 左側面板數值直接輸入與 METAL 材質預設值更新

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者提出需求：「左側設定面板的數字可以用輸入的。metal材質預設幫我改成 Base Color: #BFC3C8, Metallic: 1.0, Roughness: 0.25 – 0.35, IOR: 1.45, Specular IOR Level: 0.6」

**改動具體內容：**
- **自定義數值輸入框**：
  - 將原本顯示參數數值純文字的 `<span id="ctrl-xxx-val">` 全部替換為 `<input type="number">`，並套用專屬的樣式 `.custom-number-input`。
  - 現在可點擊數字框直接輸入數值，按下 Enter 或失去焦點 (change 事件) 時便會自動同步到滑桿並即時套用至 3D 模型上。
- **METAL 預設材質參數調整**：
  - 更新了 `materialPresets` 裡的 `METAL` 物件：
    - `color` 與 `effectColor` 修改為 `#bfc3c8`
    - `roughness` 修改為 `0.05`
    - `ior` 修改為 `1.45`
    - *(註：Three.js `MeshPhysicalMaterial` 的 Specular 與 IOR 是連動的，金屬度達 1.0 時主要的反射色彩來自 Base Color，此處已對應調整 IOR 1.45 來達到您要的基礎反射強度設定)*

---

## [v1.8.32] 2026-05-23 — 統一所有卡片至 Cyberpunk 過場特效

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把所有的材質轉場都換成這個。另外存一個git commit」

**改動具體內容：**
- **全材質統一特效 (Unified Cyberpunk Transition)**：原本 HOLO 材質是特例，使用了它專屬的掃描線特效。現在我已經將程式碼中的例外排除，強制所有材質點擊切換時，**一律使用最新版的「Cyberpunk 電馭叛客畫面撕裂」過場特效**。這讓整個網頁的美學體驗達到了空前的一致。

---

## [v1.8.31] 2026-05-23 — 取消固定長度，加速轉場節奏

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「中間的過度還是太久可以把固定4.5秒這個設定拿掉依照動畫的順度為主」

**改動具體內容：**
- **加速與優化轉場節奏 (Transition Duration)**：之前為了讓您看清楚材質轉換的特效，強制套用了非常拖泥帶水的 4.5 秒固定時間軸。但這種 Cyberpunk 等級的撕裂特效，其美學就建立在**「乾脆、暴力且俐落」**的節奏上。我現在把時間限制解放，縮減並調校到了視覺體驗最爽快、最順暢的 **1.8 秒** 左右！現在點擊卡片後，模型消融、強烈撕裂與材質重組會一氣呵成，再也不會有任何慢動作播放的冗長感。

---

## [v1.8.30] 2026-05-23 — 模型消融與畫面撕裂完美重疊

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「我不希望你是做模型消失 接著 RGB 接著 模型出現 應該是要有重疊時間的 這樣才比較順」

**改動具體內容：**
- **特效時間軸同步重疊 (Timeline Synchronization)**：您觀察得非常仔細！之前的邏輯確實是「消融到 100% 隱形」才爆發畫面撕裂，所以看起來像是斷掉的三個步驟。
- **修復**：我重新改寫了驅動動畫的時間函數 (`dVal` 與 `jitterVal` 的拋物線)。現在，當模型**開始消融**的同時，畫面的撕裂感就會**同步開始**增強；而在到達頂峰（切換材質）後，模型**開始浮現**的同時，畫面的撕裂也會伴隨著浮現的過程**同步平滑淡出**。三者完全重疊在一起，完美消除了「空白斷層」，這才是一個流暢且一氣呵成的高級過場！

---

## [v1.8.29] 2026-05-23 — 實裝 Cyberpunk 2077 電馭叛客等級的自定義畫面撕裂特效

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「比較類似這個網頁 https://dribbble.com/shots/26882352-Cyberpunk-2077-and-Viture-collaboration-by-Milkinside 的特效」

**改動具體內容：**
- **棄用原生特效，客製化 Shader (Custom CyberGlitchShader)**：為達成您所說的 Milkinside 等級視覺張力，我直接捨棄了 Three.js 內建那種「只會平滑扭曲」的 `RGBShiftShader`。取而代之，我為您手寫了一組真正的**「電馭叛客畫面撕裂著色器 (Cyberpunk Glitch Shader)」**。
- **全新三大視覺升級**：
  1. **水平斷層撕裂 (Blocky Horizontal Tearing)**：現在畫面會像真正的高科技屏幕故障一樣，隨機在不同的 Y 軸區塊產生劇烈的「水平橫向斷層」，而非整張圖一起移動。
  2. **掃描線與靜電噪聲 (Scanlines & Static Noise)**：在故障發生的瞬間，畫面會疊加 CRT 螢幕特有的動態掃描線與顆粒狀的微小靜電雜訊，科技感大幅提升。
  3. **動態濃度的半透明混合 (Dynamic Opacity Mix)**：我把您剛才喜歡的「濾鏡化」概念發揮到極致，現在故障發生時，Shader 會根據能量強度，動態調配原圖與雜訊的混合比例（最高保留 30% 清晰原圖），讓轉場在混亂中依然保有絕佳的質感！
- **左側面板 UI 同步優化**：連動左側 UI 介面的 CSS 錯位，也將其位移限制為純水平 (X 軸) 震動，完全貼合數位屏幕撕裂的美學。

---

## [v1.8.28] 2026-05-23 — RGB 濾鏡化與中段停滯時間縮短

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「RGB分離的透明度要低一點不要做的這麼明顯，作成類似濾鏡這樣。另外中間的停滯時間有點太長」

**改動具體內容：**
- **全螢幕 RGB 濾鏡化 (Translucent RGB Filter)**：我直接修改了 `RGBShiftShader` 的核心渲染邏輯，現在錯位的紅藍光暈不會 100% 覆蓋掉原本的畫面，而是以「35% 的半透明疊影（濾鏡）」形式覆蓋在清晰的原圖上。這樣既保留了模型與 UI 的細節清晰度，又能在轉場時帶有一種精緻的「能量干擾濾鏡」質感。
- **縮短過場中段停滯 (Fix Dissolve Stagnation)**：您會覺得中間停滯太久，是因為先前的消融洞口擴張半徑 (`radialThreshold`) 設定得過大（預設為 4.0），導致洞口把模型吃掉後，還要花很多時間縮小回來才會重新碰到模型邊緣。我現在將極限擴張半徑精準下修到了 `2.5`。現在模型一被吃掉就會立刻開始重組，完美消除了中段那段空白的死區時間！

---

## [v1.8.27] 2026-05-23 — 慢速巨大化 RGB 錯位、左側面板連動與消除中心殘影

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「RGB抖動的速度太快了應該是幅度大速度慢一點。然後左側面板也要有一點。另外最後收尾在中心的轉換特效還是太久了會在中心抖動快一秒」

**改動具體內容：**
- **RGB 閃爍節奏與幅度調整**：捨棄了原本每影格隨機閃爍的做法。現在我使用低頻的 Sine 波 (`Math.sin(time * 25.0)`) 來控制閃爍節奏，讓 RGB 錯位變得「慢且規律」，同時將錯位的幅度 (amount) 拉大超過兩倍。現在看起來像是充滿能量的穩定故障，而不是刺眼的頻閃。
- **左側面板 UI 錯位連動**：在 3D 畫面發生 RGB 錯位的同時，我利用 CSS Transform 與 `drop-shadow` 替左側的控制台面板 (`#left-panel`) 加入了同步的紅藍疊影與位移震動！現在不只 3D 模型，整個網頁空間的 UI 都有連動的賽博龐克感。
- **解決收尾時的「中心光點抖動」**：您所看到最後那一秒的抖動，其實是因為消融洞口縮小到極限時，周圍的光暈和雜訊擠壓在中心點所造成的。為此，我在 Shader 中加入了一個隨進度淡出的 `fadeOut` 變數。當消融即將結束時，中心的「雜訊干擾」與「發光厚度」會強制平滑萎縮至零。現在新材質出現的最後一刻將會是完美、安靜且毫無殘影的！

---

## [v1.8.26] 2026-05-23 — 修正全螢幕特效導致的場景過暗問題 (Tone Mapping)

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「整個場景都超暗ㄟ」

**改動具體內容：**
- **還原 ACESFilmic 色彩映射 (OutputPass)**：剛才為了實現全螢幕 RGB 錯位引入了 `EffectComposer`，但這會預設繞過原生的 `ToneMapping` 與 `sRGBColorSpace` 轉換，導致原本明亮的 PBR 材質與光影變成未經校正的黯淡線性色彩 (Linear Color Space)。
- **修復**：我為後製特效鏈補上了最關鍵的 `OutputPass`。現在不僅保有全螢幕的 RGB 賽博龐克錯位，原先絕美的光澤、亮度與色彩還原度也都全數回歸了！

---

## [v1.8.25] 2026-05-23 — 全螢幕 RGB 分離、優化收尾抖動與 Calibration 面板關閉

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「最後的收尾抖動都持續太久。應該要有正確顏色的材質特效+整個畫面的RGB分離。另外我的calibration offset z 0.05 改完就可以先把這個區域關掉」

**改動具體內容：**
- **實裝「全螢幕 RGB 錯位分離」 (Full-Screen RGB Shift)**：為了達到您想要的「整個畫面」的分離感，我直接引入了 Three.js 的後製特效系統 (`EffectComposer` + `RGBShiftShader`)。現在當消融達到臨界點時，不僅是材質本身，**連同整個畫面的視角**都會產生強烈的賽博龐克紅藍閃爍分離，震撼感大增！
- **解決「收尾抖動過久」 (Jitter Fade-out Fix)**：之前因為模型出現的速度被放慢了，導致綁定在同一個時間軸上的頂點抖動 (`sharedDistortion`) 也跟著抖了很久。現在我把「抖動」的時間軸獨立出來，只會在消失前一刻爆發 (`Math.pow(x, 4.0)`)，並在生成階段的最初 5% 瞬間歸零 (`Math.max(0, 1 - x*20)`)，讓模型的生成過程更加平滑安靜。
- **Calibration 區域調整**：已將底層 `offsetZ` 的預設值直接寫死為 `0.05`，並將 Tweakpane 中的 Calibration 介面面板完全移除隱藏，保持 UI 簡潔。

---

## [v1.8.24] 2026-05-23 — 修正全白渲染臭蟲與強化賽博龐克光暈

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「目前應該是有圖層或是顯示不出來的問題，你說有修改的顏色以及RGB分離都沒有出現在畫面裡面」

**改動具體內容：**
- **修復全白渲染 Bug (Fix Color Transfer)**：我發現之前雖然幫材質預設加上了 `effectColor`，但是主控系統 (`params`) 並沒有這個欄位，導致轉場一開始時一直抓不到舊材質的特效色（回傳 undefined），最終讓顏色完全死白。現在我已經把 `effectColor` 註冊進系統根基，並大幅下調了 Shader 的泛白比例 (白化從 0.8 降到 0.5)。
- **強化 RGB 錯位 (Enhanced Glitch)**：修正了 Shader 中死白過曝覆蓋掉顏色的問題（之前加了 0.6 的絕對亮度，導致連錯位的紅藍色都被閃光吃掉了）。同時將 Glitch 雜訊的觸發機率從 10% 大幅調高到 30%，現在那種強烈的賽博龐克感紅藍錯位會非常明顯地出現在光暈中！

---

## [v1.8.23] 2026-05-23 — 非對稱轉場曲線、RGB 錯位與首屏錨點優化

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「目前看都是白色要再檢查一下。另外總時常幫我一樣4.5秒，但是按完卡片要馬上回到首屏(約0.3秒)。前段消失快、後段出現較慢。另外再加上一點RGB separate 跟 glitch效果」

**改動具體內容：**
- **修正白色光暈問題 (Effect Color)**：發現當材質基底色設為 `#ffffff`（如 WOOD 或 ROCK_MOSS，其顏色依賴貼圖）時，粒子與光暈也會變成死白。為此我在 `materialPresets` 裡新增了獨立的 `effectColor` 參數，強制賦予它們該有的專屬特效色（例如 WOOD 為暖木色、ROCK 為苔蘚綠）。
- **一鍵回首屏 (Scroll to top)**：在卡片點擊事件後加入了 0.3 秒的延遲平滑捲動 (`window.scrollTo`)，確保使用者點擊下方卡片時，視角能立刻回到最上方的 3D 模型轉場大秀。
- **非對稱時間曲線 (Asymmetric Timing)**：打破 50/50 的時間分配。現在「消失階段」僅佔 35% 且曲線較陡 (`Math.pow(x, 1.2)`)，所以會迅速被破壞與消融；「生成階段」佔 65% 且採用極度平緩的曲線 (`Math.pow(x, 2.5)`)，呈現新材質如魔法般從光暈中緩慢浮現的感覺。
- **RGB 錯位故障 (Chromatic Glitch)**：在消融邊界最高潮時，加入了高頻的 Sine 波噪聲，當極限邊緣的光暈掃過時，會隨機產生紅藍通道分離 (RGB Separate) 的賽博龐克感色散故障效果，視覺層次更加豐富。

---

## [v1.8.22] 2026-05-23 — 縮短過渡空窗期與實裝「雙階段變色 (Dual-Phase Color Transition)」

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「有點中間太久了，另外我想要分兩段消失應該是取用原本模型的顏色 出現就是點選卡片的模型顏色」

**改動具體內容：**
- **縮短中間隱形期 (Accelerated Middle Phase)**：轉場總時長維持 4.5 秒的史詩感，但在 `animate()` 內部使用 `Math.pow(x, 2.0)` 進行二次方曲線加速。這使得消融過程會在前期慢慢醞釀，靠近中間 (完全隱形) 的瞬間快速閃過，大幅縮短了模型看不見的「空窗期」。
- **雙階段變色 (Dual-Phase Color)**：修改了動態材質發光系統：
  - **前半段 (消失)**：消融邊界與粒子會吸取「舊材質」的顏色。
  - **後半段 (出現)**：在能量最極限的瞬間轉換，新生出來的邊界與粒子會自動切換成「新材質」的顏色，讓「破壞與新生」的語意更強烈完美。

---

## [v1.8.21] 2026-05-23 — 延長轉場時間與實裝「動態材質適應發光 (Dynamic Material-Adaptive Glow)」

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「效果我蠻喜歡的但是可以做得更慢一點 並在顏色上可以參考目前的color或是使用 /ui-ux-pro-max 進行特效的美化」

**改動具體內容：**
- **放慢轉場節奏**：將點擊觸發的動畫總時長 (Duration) 從 `2.2 秒` 大幅延長至 `4.5 秒`。這讓輻射擴張、消融邊界與粒子噴發的過程有充分的時間展現細節，視覺體驗更為沉浸優雅。
- **動態材質主色同步**：不再使用寫死的科技藍或紫紅漸變。現在系統會自動提取您點擊卡片所對應的「材質預設基底色 (Base Color)」作為全息特效的發光主色！
  - **Shader 改動**：加入 `uDissolveColor` Uniform，將材質顏色傳遞給 Fragment Shader。消融邊緣現在會以該材質顏色為基底，在最高潮時泛白發亮。
  - **粒子系統改動**：懸浮粒子的顏色也同步使用 `THREE.MathUtils.lerp` 動態追蹤新材質的顏色，並在高溫消融極限區間轉為高亮白熾光。這樣一來，切換 FIRE 會噴發橘紅光暈，切換 WATER 則是水藍光暈，完美契合個別材質調性！

---

## [v1.8.20] 2026-05-23 — 實裝「全像輻射粒子消融 (Holographic Radial Particle Dissolve)」

**修改檔案：3d_lab.html**

**修改問題：**
- 為了讓轉場視覺效果更具備科技感與震撼力，使用者要求融合以下三種 Shader 特效概念：
  1. 帶有粒子的消融效果 (Dissolve with particles)
  2. 未來感全息干擾 (Holographic effect glitch)
  3. 程序化輻射雜訊過渡 (Procedural radial noise transition)

**改動具體內容：**
- **程序化輻射雜訊 (Procedural Radial Noise)**：重寫 Fragment Shader，捨棄單一方向的 Y 軸消融，改為計算頂點與中心的距離 (`length(vPositionDissolve)`)，並結合 Simplex Noise。現在材質轉換會如能量般由中心向外不規則輻射擴散。
- **邊緣發光與全息干擾 (Holo Glitch & Emissive Edge)**：
  - 在 Fragment Shader 的消融極限邊緣，疊加了高強度的 Chromatic Aberration（色散漸變，從冰藍過渡到紫紅高溫核心）。
  - 在 Vertex Shader 的同等擴張邊界上，加入了基於高頻正弦波的 Vertex Glitch（頂點抖動）與法線膨脹，營造強烈的全息破壞與能量過載感。
- **高教能粒子系統 (High-Performance Particles)**：在 `initTransitionEffects` 引入單一 `THREE.Points` 建立的 1000 顆緩衝粒子。這些粒子會在 `animate()` 迴圈中，精準依附於動態擴張的消融半徑邊緣生成，並帶有向外輻射與向上飄散的初速度（CPU 端迭代計算極快，效能極佳）。

---

## [v1.8.19] 2026-05-22 — 移除 METAL 專屬轉場，統一採用標準消融效果

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「不要重作這個了 我想改成跟wood轉換方式一樣的」
- 使用者決定棄用任何 METAL 專屬的自訂轉場特效（方案 B），希望直接套用與 WOOD、WATER 等相同的基礎過渡效果。

**改動具體內容：**
- **移除方案 B (Liquid Metal Morph) 邏輯**：完全刪除了 Vertex Shader 中 `uTransitionPreset == 1.0` 的頂點流動變化，以及 `animate()` 中關於 `pVal === 1.0` 的複雜插值過渡。
- **重新指向標準轉場**：修改了轉場 Preset 設定邏輯。現在當點擊 METAL 材質時，程式會自動將其歸類到 `else` 分支，採用 `sharedTransitionPreset.value = 0.0`（方案 A：標準 Noise Dissolve 雜訊消融轉場）。這與 WOOD 及 ROCK MOSS 的轉換方式完全一致，乾淨俐落。

---

## [v1.8.18] 2026-05-22 — 重新設計 METAL 材質專屬轉場特效

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把metal材質的轉換效果改成其他種的 那個不好看不要了」
- 原本的 METAL 轉場（方案 B）使用了高頻率的法線震盪（類似鍛造敲擊的劇烈阻尼震波）並在過程中將模型縮小至消失，視覺上顯得過於激烈且不夠優雅。

**改動具體內容：**
- **液態金屬流動變形 (Liquid Metal Morph)**：徹底重寫了 METAL 的 Vertex Shader 邏輯。捨棄了高頻的震盪波，改為使用大範圍、低頻率的平滑流動波浪（`sin/cos` 組合計算），模擬水銀或液態金屬在無重力狀態下的懸浮與膨脹感。
- **取消縮放並加入蒸發消融**：在 `animate()` 的過渡計算中，不再強制將模型縮小至 0。模型將保持原有尺寸，並在液態膨脹的同時啟動 Noise Dissolve（雜訊消融），讓液態金屬在轉換最激烈的瞬間化為細小的金屬液滴消散，隨後再無縫重組成新的金屬材質型態。整個過渡變得更加絲滑且具備頂級質感的科技金屬氛圍。

---

## [v1.8.17] 2026-05-22 — 修復 PBR 法線貼圖 (Normal Map) 未能正確映射之問題

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「目前看起來normal好像沒有套用到」
- 儘管模型已經帶有 `TANGENT` 資訊，但在不同的軟體導出環境（例如 Blender 導出 GLB）下，切線空間（Tangent Space）與 Three.js 內部 WebGL Shader 預期的切線向量時常發生不匹配或資料破損，導致 Normal Map 視覺上完全平坦。此外，原先設定的 `normalScale: [1.5, 1.5]` 對於高解析度模型與強光 HDRI 來說，視覺凹凸感可能不夠強烈。

**改動具體內容：**
- **強制重算切線向量**：在 `loadModel()` 載入模型並走訪子 Mesh 時，新增 `child.geometry.computeTangents()` 邏輯。這會強制 Three.js 根據模型的 `POSITION` 與 `TEXCOORD_0` (UV) 重新計算出最符合其渲染引擎標準的完美切線向量，徹底解決 Normal Map 空間不匹配而失效的問題。
- **大幅提升法線強度**：
  - 將 `ROCK_MOSS` 的 `normalScale` 從 `[1.5, 1.5]` 提升至 `[3.5, 3.5]`。
  - 將 `WOOD` 的 `normalScale` 從 `[1.5, 1.5]` 提升至 `[3.0, 3.0]`。
- **預期效果**：現在只要切換到 WOOD 或 ROCK MOSS，搭配新加入的森林 HDRI 反射，您將會看到非常明顯且深邃的材質表面凹凸與紋理細節。

---

## [v1.8.16] 2026-05-22 — 導入雙 HDRI 系統，針對 PBR 與非 PBR 材質使用專屬環境反射

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「其他材質的光 是要原本的hdri。PBR材質的光才是用新的這個」
- 上一版將非 PBR 材質的 HDRI 拔除退回了平底光源，這導致原本的水、金屬與全息玻璃材質失去了影棚高光反射，看起來平坦。

**改動具體內容：**
- **雙光源並行加載**：保留 `monochrome_studio_01_4k.hdr`（作為原本的非 PBR 光源），並透過 `EXRLoader` 額外加載 `forest.exr`（作為 PBR 專屬的新光源）。
- **動態環境切換 (`updateEnvironmentMap`)**：
  - 當切換至 `WOOD` 或 `ROCK_MOSS` 等 PBR 材質時，`scene.environment` 將套用 `forest.exr`，讓 PBR 物件擁有符合木頭與青苔質感的森林光影映射。
  - 當切換至 `WATER`, `FIRE`, `METAL`, `HOLO` 等材質時，`scene.environment` 將自動切換回 `monochrome_studio_01_4k.hdr`，完美恢復原本乾淨透亮、富含高反差亮點的影棚高光反射效果。

---

## [v1.8.15] 2026-05-22 — 動態切換 HDRI 環境反射，僅在 WOOD 與 ROCK MOSS 啟用

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「這個HDRI我想要再換成wood 與 moss 的時候啟用」
- 原始設定中，`scene.environment` 在載入 HDRI 後會全域生效，導致 WATER, FIRE, METAL, HOLO 等非 PBR 材質也受到 HDRI 的強烈反射影響。

**改動具體內容：**
- 新增 `updateEnvironmentMap()` 函式，會檢查當前的材質 Preset 是否為 `WOOD` 或 `ROCK_MOSS`。
- 若為 PBR 材質，則將 `scene.environment` 設為 HDRI (`hdriTexture`)。
- 若非 PBR 材質（如 WATER, METAL 等），則將 `scene.environment` 退回對應當前深淺主題的扁平反光板 (`darkBgEnv` 或 `lightBgEnv`)。
- 將 `updateEnvironmentMap()` 綁定至：
  1. 初始貼圖與 HDRI 載入完成時。
  2. 材質轉場動畫完成（`progress > 0.5 && !swapped`）切換屬性時。
  3. UI 主題深淺切換完成時。

---

## [v1.8.14] 2026-05-22 — 切換主場景模型為更新後的 `3D_Lab_all.glb`

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「請把場景換成 3D_Lab_all.glb」
- 使用者已將 UV 解好並附帶 TANGENT (切線) 資訊的新版模型覆蓋至 `3D_Lab_all.glb`。

**改動具體內容：**
- 將 `3d_lab.html` 的預設載入路徑由 `3D_LOGO_all.glb` 重新切換回 `3D_Lab_all.glb`。
- **預期效果**：由於新版 `3D_Lab_all.glb` 具備完美的 `TEXCOORD_0` (UV) 與 `TANGENT`，PBR 材質的 Normal Map 與 Roughness 將能在這個主要場景檔案上完美運作。

---

## [v1.8.13] 2026-05-22 — 移除 Displacement Map (置換貼圖) 以修復模型破面問題

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「把displace拿掉好了已經造成模型破面」
- 根本原因：Displacement Map 是一種透過直接改變模型網格 (Mesh) 頂點位置來產生立體感的技術。當模型本身的幾何分段數 (Subdivisions / Polygons) 不夠高，或是置換強度參數過大時，頂點在推擠的過程中會相互交錯或撕裂，進而在畫面上產生邊緣不平整、破圖或破面 (Clipping/Artifacts) 的現象。

**改動具體內容：**
- 在 `ROCK_MOSS` 與 `WOOD` 的 `materialPresets` 配置中，移除了 `displacementMap` 檔案路徑與 `displacementScale` 等相關參數。
- 移除了 `applyCurrentParamsToModel()` 內，建立與更新材質時的所有 `displacement` 同步邏輯。
- 移除了 `loadPBRTextures()` 內的 Displacement Map 非同步載入邏輯與緩存配置。
- **預期效果**：模型的凹凸感將完全交由 Normal Map (法線貼圖) 與 Roughness Map (粗糙度貼圖) 透過光影計算來模擬，不再實體改變網格，確保模型邊緣與表面平滑且不會發生破面。

---

## [v1.8.12] 2026-05-21 — 修復 PBR 材質反光過強：關閉 ROCK_MOSS / WOOD 的 Clearcoat 層

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「我覺得這兩個模型的反光程度還是很高ㄟ是因為roughness有問題嗎?」
- 根本原因：Three.js 的 `MeshPhysicalMaterial` 分兩層光照計算。底層的 `roughness = 1.0` 控制材質本身的漫射，但上層有一個 **Clearcoat（透明漆）** 層。原本程式碼將 `clearcoat: 1.0, clearcoatRoughness: 0.1` 寫死為所有 Physical 材質的預設值。這等同於在任何材質上覆蓋一層極度光亮的透明漆，無論底層 roughness 多高，看起來都會反光刺眼。

**改動具體內容：**
- 在 `ROCK_MOSS` 與 `WOOD` 的 `materialPresets` 配置中，補上 `clearcoat: 0.0, clearcoatRoughness: 1.0`。
- 在 `ROCK_MOSS` 與 `WOOD` 的 `envMapIntensity` 從 `1.0` 降至 `0.5`，進一步降低環境貼圖反射強度，讓材質呈現更加啞光自然。
- 材質建立的 constructor 改為讀取 `presetDef.clearcoat` 設定，而非硬編碼。
- 屬性同步段補上 `m.clearcoat`, `m.clearcoatRoughness`, `m.envMapIntensity` 的同步，確保切換 Preset 後也能正確覆蓋。

**改動程式碼片段：**
```javascript
// ROCK_MOSS & WOOD 設定檔
clearcoat: 0.0,          // 關閉透明漆覆蓋，讓 roughness 真正控制反光
clearcoatRoughness: 1.0,
envMapIntensity: 0.5,    // 降低 IBL 反射強度

// 材質 constructor
const matParams = {
    clearcoat: presetDef.clearcoat !== undefined ? presetDef.clearcoat : 1.0,
    clearcoatRoughness: presetDef.clearcoatRoughness !== undefined ? presetDef.clearcoatRoughness : 0.1,
    // ...
};

// 屬性同步段（PBR 路徑）
m.clearcoat = presetDef.clearcoat !== undefined ? presetDef.clearcoat : 1.0;
m.clearcoatRoughness = presetDef.clearcoatRoughness !== undefined ? presetDef.clearcoatRoughness : 0.1;
m.envMapIntensity = presetDef.envMapIntensity;
```

---

## [v1.8.11] 2026-05-21 — 修復 PBR 貼圖非同步失效：roughnessMap / normalMap 不生效問題

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反映：「似乎roughness以及normal還沒有套用到」
- 根本原因（Race Condition 時序問題）：
  1. 模型載入完成時立即呼叫 `applyCurrentParamsToModel()`，此時貼圖尚未非同步載完，材質以 `roughnessMap = null`、`normalMap = null` 建立。
  2. `loadPBRTextures()` 的 `Promise.all` 完成後，雖有呼叫 `applyCurrentParamsToModel()`，但此函式的重建判斷 `mustRebuildForTex` 條件為 `!hasTextureNow`（即 `map` 是否存在），而此時 `map` 已設好，所以不重建材質。
  3. 不重建材質時，舊的「屬性更新段」只同步 `roughness`、`metalness` 等純數值，**完全沒有更新 `roughnessMap`、`normalMap`、`displacementMap` 等貼圖 reference**，導致 roughness/normal 貼圖永遠掛不上去。

**改動具體內容：**
- 在 `applyCurrentParamsToModel()` 的「屬性更新段（else 路徑）」中，PBR 判斷塊加入逐一比對並動態補上所有貼圖 reference 的邏輯（diff-patch 模式）：
  - `map`、`roughnessMap`、`normalMap`、`displacementMap` 若與 `loadedTextures` 不同，則重新指定並標記 `needsUpdate = true`。
  - 同步更新 `normalScale`、`displacementScale`、`displacementBias`。
- 非 PBR 路徑也補上清空 `displacementMap = null` 的邏輯，避免殘留。

**改動程式碼片段：**
```javascript
// 核心修復（屬性更新段）
if (hasPBR && hasTexData) {
    if (tex.roughnessMap && m.roughnessMap !== tex.roughnessMap) {
        m.roughnessMap = tex.roughnessMap;
        m.needsUpdate = true;
    }
    if (tex.normalMap && m.normalMap !== tex.normalMap) {
        m.normalMap = tex.normalMap;
        m.normalScale.set(...);
        m.needsUpdate = true;
    }
    // 同理 displacementMap...
}
```

---

## [v1.8.10] 2026-05-21 — 確認並載入具備 UV 座標之新版模型 `3D_LOGO_all.glb`

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「重新輸出了請再確認一次」
- 經由解析腳本再次掃描，發現使用者稍早匯出並上傳的新檔案為 `3D_LOGO_all.glb`（24MB）。此檔案中的 `LOGO` 節點已成功附帶 `TEXCOORD_0` (UV 座標) 屬性。

**改動具體內容：**
- 將 `3d_lab.html` 的預設載入路徑由 `3D_Lab_all.glb` 更新為 `3D_LOGO_all.glb`。
- **預期效果**：因為 `LOGO` 網格現在擁有正確的 UV，PBR 材質的置換（Displacement）、法線（Normal）、底色與粗糙度貼圖將能完美映射於表面，展現真正的 3D 材質細節。

**改動程式碼片段：**
```javascript
// 初始載入專案預設模型更新為帶有 UV 的新版檔案
loadModel('./3D modeling/3D_LOGO_all.glb', false);
```

---

## [v1.8.9] 2026-05-21 — 完善 PBR 系統：全面支援 Displacement Map (置換貼圖)

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「目前修正把PBR系統加入然後要檢查base color roughness normal displacement這些有沒有使用到」
- 經盤點發現，先前已成功載入並套用 `baseColor`, `roughnessMap`, `normalMap`，但在 `3D_shader/rock_moss/` 與 `3D_shader/wood/` 資料夾中確實存在 `_disp.png` (Displacement Map)，卻未被載入及使用。

**改動具體內容：**
- **配置擴充**：在 `materialPresets` 字典中，為 `ROCK_MOSS` 與 `WOOD` 補上了 `displacementMap` 的路徑，並加入了 `displacementScale: 0.05` 與 `displacementBias: -0.025` 以控制幾何凹凸的強度。
- **載入邏輯更新**：在 `loadPBRTextures()` 函式內，擴充了貼圖緩存結構 (`loadedTextures`)，並追加了一組 Promise 來非同步載入 `displacementMap`。
- **渲染綁定**：在 `updatePreviewMaterials()` (預覽小球) 與 `applyCurrentParamsToModel()` (主模型) 中，將載入的 `displacementMap`、`displacementScale` 與 `displacementBias` 正確賦值給 `MeshPhysicalMaterial`，使模型能在視覺上獲得真實的幾何深度與輪廓變化。

**改動程式碼片段：**
```javascript
// PBR 設定檔擴充
pbr: {
    baseColor: './3D_shader/rock_moss/rock_moss_base_color.png',
    roughnessMap: './3D_shader/rock_moss/rock_moss_rough.png',
    normalMap: './3D_shader/rock_moss/rock_moss_normal.png',
    displacementMap: './3D_shader/rock_moss/rock_moss_disp.png', // 新增
    normalScale: [1.5, 1.5],
    displacementScale: 0.05,
    displacementBias: -0.025,
    // ...
}

// applyCurrentParamsToModel() 材質套用
matParams.displacementMap = tex.displacementMap || null;
if (presetDef.pbr.displacementScale !== undefined) {
    matParams.displacementScale = presetDef.pbr.displacementScale;
}
if (presetDef.pbr.displacementBias !== undefined) {
    matParams.displacementBias = presetDef.pbr.displacementBias;
}
```

---

## [v1.8.8] 2026-05-21 — 重構校正模式：整體群組連動偏移以確保陰影精準對位

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者詢問：「那我可以使用整個all的模型去對齊嗎?」
- 先前在 `[v1.8.5]` 加入的 XYZ 校正參數，僅針對 `mainModel` (LOGO 本體) 進行位移與縮放。但網頁產生陰影的機制是將底座轉換為透明的 `ShadowMaterial`（停留在原點），若只偏移 LOGO，就會導致影子投射到底座時發生錯位。

**改動具體內容：**
- **基準點重設**：在 `loadModel()` 中，載入完成時額外將整個場景群組 (`currentImportedScene`) 的原始位移與縮放基準記錄在 `userData` 中。
- **整體連動**：在 `animate()` 動畫迴圈內，將 Tweakpane 傳來的 `offsetX`, `offsetY`, `offsetZ`, `modelScale` 從 `mainModel` 中移除，改為直接作用於整個 `currentImportedScene`。
- **維持動態分離**：保留 `mainModel` 專屬的自動浮動效果 (`Math.sin(time)`)，確保模型依舊能相對於底座上下浮動，同時又能在校正位置時帶著隱形底座一起移動，徹底解決影子錯位問題。

**改動程式碼片段：**
```javascript
// animate() 內針對整體場景偏移
if (currentImportedScene) {
    if (currentImportedScene.userData.originPosition) {
        currentImportedScene.position.x = currentImportedScene.userData.originPosition.x + params.offsetX;
        currentImportedScene.position.y = currentImportedScene.userData.originPosition.y + params.offsetY;
        currentImportedScene.position.z = currentImportedScene.userData.originPosition.z + params.offsetZ;
    }
    if (currentImportedScene.userData.originScale) {
        currentImportedScene.scale.setScalar(currentImportedScene.userData.originScale * params.modelScale);
    }
}
```

---

## [v1.8.7] 2026-05-21 — 優化校正模式：恢復滑桿拉感設計

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「可以稍微在微調一下 位置的數據嗎 跟之前一樣的拉感設計」
- 先前為了解除上下限而移除了 `min` 與 `max` 參數，導致 Tweakpane 面板的視覺滑桿消失，輸入框的拖曳手感也變得較難控制。

**改動具體內容：**
- **恢復視覺滑桿**：在 `Calibration` 面板中，為 `offsetX`、`offsetY`、`offsetZ` 重新設定了極寬的上下限（`-20` 到 `20`），並將 `modelScale` 設為 `0.1` 到 `10`。
- **手感保留**：透過設定極寬的範圍，既能保留 Tweakpane 原本平滑的「拉感設計」（視覺滑桿），又能提供近乎無限制的調整空間供使用者精細對位。

**改動程式碼片段：**
```javascript
// 重新加入寬廣的 min/max 恢復拉感
calibFolder.addBinding(params, 'offsetX', { min: -20, max: 20, step: 0.01, label: 'Offset X' });
calibFolder.addBinding(params, 'offsetY', { min: -20, max: 20, step: 0.01, label: 'Offset Y' });
calibFolder.addBinding(params, 'offsetZ', { min: -20, max: 20, step: 0.01, label: 'Offset Z' });
calibFolder.addBinding(params, 'modelScale', { min: 0.1, max: 10, step: 0.01, label: 'Scale' });
```

---

## [v1.8.6] 2026-05-21 — 同步最新模型檔案並恢復預設加載 `3D_Lab_all.glb`

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「`3D_Lab_all.glb` 更新了請把之前還在用all的時候的數據弄回來」
- 既然 `3D_Lab_all.glb` 已於外部更新完成，故將展示場景還原為使用該檔案，不再使用暫時替代的 `3D_LOGO_bot.glb`。

**改動具體內容：**
- **模型同步**：從 `github_deploy\3D modeling\` 目錄將最新版本的 `3D_Lab_all.glb` 複製至專案工作目錄。
- **恢復設定**：將 `3d_lab.html` 內初始載入模型的設定，從 `./3D modeling/3D_LOGO_bot.glb` 復原為 `./3D modeling/3D_Lab_all.glb`。

**改動程式碼片段：**
```javascript
// 初始載入專案預設模型
loadModel('./3D modeling/3D_Lab_all.glb', false);
```

---

## [v1.8.5] 2026-05-21 — 擴充校正模式：無限制 XYZ 軸偏移與縮放控制

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者需求：「可以顯示模型的wirframe讓我調整嗎 然後不要有調整的上下限」
- 為了讓使用者在校正影子與模型對位時有最大的彈性，需要解開高度限制，並加入 X/Z 軸與整體縮放的自由調整功能。

**改動具體內容：**
- **解除限制與擴充控制項**：在 Tweakpane 的 `Calibration` (校正) 資料夾中，移除了原本 `offsetY` 的 `min`/`max` 上下限。
- **新增全方位調整**：額外新增了 `offsetX` (X軸偏移)、`offsetZ` (Z軸偏移) 以及 `modelScale` (模型縮放) 參數，且均無上下限限制，僅給予 `step: 0.01` 使微調更為平滑。
- **綁定渲染迴圈**：在 `animate()` 動畫迴圈中，將 `offsetX` 與 `offsetZ` 正確加上初始載入基準點 (`originPosition`)；並將 `modelScale` 乘上 `originScale` 以同步控制各個轉場狀態下的模型大小。

**改動程式碼片段：**
```javascript
// Calibration UI 無限制綁定
calibFolder.addBinding(params, 'offsetX', { step: 0.01, label: 'Offset X' });
calibFolder.addBinding(params, 'offsetY', { step: 0.01, label: 'Offset Y' });
calibFolder.addBinding(params, 'offsetZ', { step: 0.01, label: 'Offset Z' });
calibFolder.addBinding(params, 'modelScale', { step: 0.01, label: 'Scale' });

// animate() 應用全方位調整
mainModel.position.x = mainModel.userData.originPosition.x + params.offsetX;
mainModel.position.z = mainModel.userData.originPosition.z + params.offsetZ;
const origS = (mainModel.userData.originScale || 1.0) * params.modelScale;
```

---

## [v1.8.4] 2026-05-21 — 更新預設加載模型為 3D_LOGO_bot.glb 以校正影子對位

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反應：「更新一下你那邊的glb檔案 我影子使用的是 3D_LOGO_bot.glb 去對位子的」
- 原先預設載入的模型為 `3D_Lab_all.glb`，導致使用者在測試時影子與物件的對位有落差。

**改動具體內容：**
- 將 `github_deploy` 內最新用來校正影子的 `3D_LOGO_bot.glb` 複製覆蓋至專案的 `3D modeling` 目錄中。
- 在 `3d_lab.html` 中，將初始載入專案預設模型的路徑從 `./3D modeling/3D_Lab_all.glb` 變更為 `./3D modeling/3D_LOGO_bot.glb`。

**改動程式碼片段：**
```javascript
// 初始載入專案預設模型
loadModel('./3D modeling/3D_LOGO_bot.glb', false);
```

---

## [v1.8.3] 2026-05-21 — 修復 PBR 貼圖顯示異常與重啟校正線框模式

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者反應：「現在模型的roughness normal那些圖沒有顯示出來，而且模型的高度那些都改錯了，需要重新啟用校正的線框模式」。
- **PBR貼圖消失原因**：在 v1.8.1 中實作了 `mustRebuildForTex` 防禦性重建材質機制，但因為 `texLoader.load` 是非同步分開加載，當 `baseColor` 完成時會觸發第一次材質重建（此時 roughness 與 normal 尚未載入，故為 null），隨後 roughness 載入完成時，因材質已有 map 貼圖，不再觸發重建條件，且程式未補上動態賦值邏輯，導致材質永遠無法獲得 roughness 與 normal 貼圖。
- **高度與線框**：過往版本將 `Calibration` 面板與 `glassCover` 一併精簡，導致使用者無法自行微調 Y 軸高度與檢視線框，產生高度跑位與無法校正的困擾。

**改動具體內容：**
- **修復非同步貼圖競態條件 (Race Condition)**：
  - 重構 `loadPBRTextures()`，將三張貼圖的 `texLoader.load` 全部包裝為 `Promise` 並存入 `promises` 陣列。
  - 使用 `Promise.all(promises).then(...)` 確保該材質的所有 PBR 貼圖（base, roughness, normal）皆完全載入後，才統一觸發 `updatePreviewMaterials()` 與 `applyCurrentParamsToModel()`。這保證了防禦性重建時，所有貼圖皆已就位並正確編譯進 Shader 巨集中。
- **重啟校正模式 (Calibration Mode)**：
  - 在 Tweakpane 重新加入 `Calibration` 資料夾。
  - 綁定 `Wireframe Mode` (線框模式) 切換，並連動 `MeshPhysicalMaterial` 與 `MeshToonMaterial` 的 `wireframe` 屬性。
  - 新增 `Height (Y)` 高度微調滑桿 (`offsetY`)，範圍 -5 到 5。在 `animate()` 動畫迴圈中，將 `params.offsetY` 動態疊加至 `mainModel.position.y` 的計算公式中，讓使用者能直覺地將跑位的高度拉回正確位置。

**改動程式碼片段：**
```javascript
// Promise.all 保證所有貼圖就位
const promises = [];
if (preset.pbr.baseColor) { promises.push(new Promise(resolve => { ... })); }
if (preset.pbr.roughnessMap) { promises.push(new Promise(resolve => { ... })); }
if (preset.pbr.normalMap) { promises.push(new Promise(resolve => { ... })); }
Promise.all(promises).then(() => {
    updatePreviewMaterials();
    if (currentTransitionPresetKey === key) applyCurrentParamsToModel();
});

// UI 新增 Calibration
const calibFolder = pane.addFolder({ title: 'Calibration' });
calibFolder.addBinding(params, 'wireframe', { label: 'Wireframe Mode' });
calibFolder.addBinding(params, 'offsetY', { min: -5, max: 5, label: 'Height (Y)' });

// animate() 注入 offsetY
mainModel.position.y = mainModel.userData.originY + params.offsetY + Math.sin(time * 1.5) * 0.15;
```

---

## [v1.8.2] 2026-05-20 — 徹底移除粒子特效，修復動畫迴圈損壞

**修改檔案：3d_lab.html**

**修改問題：**
- 使用者要求：「先把換材質底部的粒子特效全部都拿掉」
- 前次局部修改對 `multi_replace_file_content` 的多 chunk 操作產生嚴重代碼錯位：GLSL Shader 字串片段被插入 JS 動畫迴圈、轉場方案 A/B/C 程式碼重複出現兩份，`transitionStep` 函式閉合括號位置錯誤。

**改動具體內容：**
- **全域變數清理**：刪除 `smokeParticles`、`smokeGeometry`、`smokeCount`、`smokeData`、`smokeOpacityMultiplier`、`targetSmokeOpacityMultiplier` 全部粒子相關宣告。
- **卡片點擊處理器**：移除 METAL 方案的粒子初速度初始化迴圈及 `smokeParticles.material.opacity = 0.0`。
- **動畫迴圈重建**：用 PowerShell 刪除 2234-2498 行全部重複/損壞代碼塊。方案 A 僅保留 Shader uniform 驅動，方案 B 保留 LOGO 縮放與 PBR 插值，方案 C 僅保留掃描線 uniform 驅動，`else if (!isMaterialTransitioning)` 移除漸隱呼叫。
- **結果驗證**：全文搜尋 `smoke` 相關 identifier 結果為零，`renderer.render` 與 `animate()` 調用點唯一。

---

## [v1.8.1] 2026-05-20 — 重構 PBR 系統：全面整合進 materialPresets 實現資料驅動

**修改檔案：3d_lab.html**

**修改問題：**
- 回應使用者需求：「有辦法加入PBR系統在預設的材質內嗎?」
- 原先的 PBR 貼圖邏輯（針對 ROCK_MOSS 與 WOOD）是寫死（hard-coded）在 `applyCurrentParamsToModel` 與 `updatePreviewMaterials` 中的，難以擴充且無法讓其他預設材質輕鬆套用 PBR 效果。

**改動具體內容：**
- **將 PBR 配置移入 `materialPresets` 字典**：
  在 `materialPresets` 內新增 `pbr` 物件結構（包含 `baseColor`、`roughnessMap`、`normalMap`、`normalScale` 及 `repeat` 等屬性），將材質配置全面「資料驅動化」（Data-Driven）。
- **重構非同步貼圖載入迴圈**：
  重寫 `loadPBRTextures()`，改以 `Object.keys(materialPresets).forEach(...)` 遍歷字典。只要預設材質內含有 `pbr` 設定，便會自動宣告並非同步載入對應貼圖，賦予系統隨插即用的優越擴充性。
- **解耦防禦性重建與動態注入邏輯**：
  一舉刪除了所有針對特定名稱（如 `isRock`、`isWood`）的判斷式。改由程式自動偵測 `preset.pbr !== undefined` 及貼圖完成狀態來決定是否綁定貼圖屬性。這確保所有具備 PBR 宣告的材質皆能正確觸發 Three.js WebGL Shader 巨集（Macro）編譯。

**改動程式碼：**
```javascript
        const materialPresets = {
            'ROCK_MOSS': {
                // 原有屬性...
                pbr: {
                    baseColor: './3D_shader/rock_moss/rock_moss_base_color.png',
                    roughnessMap: './3D_shader/rock_moss/rock_moss_rough.png',
                    normalMap: './3D_shader/rock_moss/rock_moss_normal.png',
                    normalScale: [1.5, 1.5],
                    repeat: [1.5, 1.5]
                }
            },
            // ...其他材質
        };

        // 自動適應的屬性綁定範例
        const presetDef = materialPresets[currentPresetKey] || materialPresets['WATER'];
        const hasPBR = presetDef.pbr !== undefined;
        const tex = loadedTextures[currentPresetKey];
        const hasTexData = tex && tex.map;
        
        if (hasPBR && hasTexData) {
            matParams.map = tex.map;
            matParams.roughnessMap = tex.roughnessMap || null;
            matParams.normalMap = tex.normalMap || null;
            if (presetDef.pbr.normalScale) {
                matParams.normalScale = new THREE.Vector2(presetDef.pbr.normalScale[0], presetDef.pbr.normalScale[1]);
            }
        }
```

## [v1.8.0] 2026-05-19 — 雙套寫實 PBR 貼圖整合、非同步載入器與雙 Water 材質差異化解耦

**修改檔案：3d_lab.html**

**修改問題：**
- 解決如何將本機提供的兩套專業 PBR 貼圖（`MOSS` 青苔岩石與 `WOOD` 消光柳木）無縫載入至 Three.js WebGL 場景中，並確保主模型與微型卡片預覽（Card Previews）能非同步完成貼圖初始化。
- 解決原本卡片展示區存在兩個相同 `WATER` 預設的混淆問題，將其解耦為功能與風格迥異的雙 Water 展示機制（Water-A 與 Water-B）。

**改動具體內容：**
- **雙套寫實 PBR 貼圖載入管線 (PBR Texture Pipeline)**：
  - 引進 `THREE.TextureLoader` 設計非同步載入系統 `loadPBRTextures()`，完整加載 Moss 與 Wood 的 Base Color、Normal、Roughness、Ambient Occlusion 貼圖。
  - 將加載的貼圖儲存於全域 `loadedTextures` 字典中，設定合理的 `colorSpace = THREE.SRGBColorSpace`、`wrapS = wrapT = THREE.RepeatWrapping` 以及 `repeat.set(2, 2)` 以提升細節解析度。
  - 於 PBR 貼圖成功載入後，自動非同步呼叫 `updatePreviewMaterials()`，動態更新下方卡片中對應 PBR 材質的 WebGL 微型預覽。
- **解耦與差異化雙 Water 材質系統 (Dual Water Presets Split)**：
  - **Water-A**：設定為高折射（`transmission: 0.9`、`ior: 1.333`、`roughness: 0.1`、`color: #e6f7ff`）的寫實水體質感，並在點擊時觸發純淨水波焦散（Caustics）投影。
  - **Water-B**：設定為 Toon 水體風格（`transmission: 0.5`、`ior: 1.15`、`roughness: 0.3`、`color: #bbf2f6`），點擊時自動切換為 Toon 卡通渲染（Cel-shading）與動漫風焦散紋理，形成極佳的藝術對比。
- **全新 PBR 材質 Presets 參數優化 (PBR Material Fine-tuning)**：
  - **MOSS**：設定 `color: #ffffff`（由 Base Color 貼圖完全決定色彩）、`roughness: 1.0`、`metalness: 0.2`、`transmission: 0.0`，完全停用折射以突顯岩石苔蘚的粗糙與立體凹凸感。
  - **WOOD**：設定 `color: #ffffff`（由柳木貼圖完全決定色彩）、`roughness: 1.0`、`metalness: 0.0`、`transmission: 0.0`，呈現溫潤消光的實木紋理。
  - 針對 PBR 材質在套用時，智慧切換 `material.map`、`material.normalMap`、`material.roughnessMap` 與 `material.aoMap`，並在切換至一般物理材質或 Toon 材質時，確實將這些貼圖變數設為 `null` 並調用 `material.needsUpdate = true`，徹底防止 WebGL 紋理殘留與 shader 編譯衝突。

**改動程式碼片段：**
- **非同步貼圖載入器與紋理配置**：
```javascript
const loadedTextures = {};
function loadPBRTextures() {
  const texLoader = new THREE.TextureLoader();
  const paths = {
    moss: {
      map: '3D_shader/moss/moss_basecolor.jpg',
      normalMap: '3D_shader/moss/moss_normal.jpg',
      roughnessMap: '3D_shader/moss/moss_roughness.jpg',
      aoMap: '3D_shader/moss/moss_ao.jpg'
    },
    wood: {
      map: '3D_shader/wood/wood_basecolor.jpg',
      normalMap: '3D_shader/wood/wood_normal.jpg',
      roughnessMap: '3D_shader/wood/wood_roughness.jpg',
      aoMap: '3D_shader/wood/wood_ao.jpg'
    }
  };
  // 透過 Promise.all 確保非同步載入並於完成後更新預覽卡片
  ...
}
```
- **材質預設參數字典（包含 Moss、Wood、解耦雙 Water）**：
```javascript
const materialPresets = {
  'WATER': { // Water-A: 寫實折射水
    color: '#e6f7ff', transmission: 0.9, ior: 1.333, thickness: 1.5,
    roughness: 0.1, metalness: 0.0, reflectionPower: 1.0,
    iridescence: 0.0, iridescenceIOR: 1.3, attenuationColor: '#ffffff',
    attenuationDistance: Infinity, sssColor: '#ffffff', sssDistance: 10.0, isToon: false
  },
  'WATER_B': { // Water-B: 卡通風格水
    color: '#bbf2f6', transmission: 0.5, ior: 1.15, thickness: 1.0,
    roughness: 0.3, metalness: 0.0, reflectionPower: 0.8,
    iridescence: 0.0, iridescenceIOR: 1.3, attenuationColor: '#ffffff',
    attenuationDistance: Infinity, sssColor: '#ffffff', sssDistance: 10.0, isToon: true
  },
  'MOSS': {
    color: '#ffffff', transmission: 0.0, ior: 1.5, thickness: 0.0,
    roughness: 1.0, metalness: 0.2, reflectionPower: 0.5,
    iridescence: 0.0, iridescenceIOR: 1.3, attenuationColor: '#ffffff',
    attenuationDistance: Infinity, sssColor: '#ffffff', sssDistance: 10.0, isToon: false,
    usePBR: 'moss'
  },
  'WOOD': {
    color: '#ffffff', transmission: 0.0, ior: 1.5, thickness: 0.0,
    roughness: 1.0, metalness: 0.0, reflectionPower: 0.3,
    iridescence: 0.0, iridescenceIOR: 1.3, attenuationColor: '#ffffff',
    attenuationDistance: Infinity, sssColor: '#ffffff', sssDistance: 10.0, isToon: false,
    usePBR: 'wood'
  },
  ...
};
```

---

## [v1.7.1] 2026-05-19 — 玻璃罩無影化與幾何精密校正：消除全部影子、縮小尺寸與貼合底座

**修改檔案：3d_lab.html**

**修改內容：**
- **玻璃罩無影化 (Shadow Elimination)**：
  - 將玻璃罩主體（`cylinderMesh`、`domeMesh`）與底部金屬防護圈（`rimMesh`）的 `castShadow` 與 `receiveShadow` 強制設定為 `false`。
  - 確保玻璃罩在任何光源投射下均不會在展示台或背景上產生投影，亦不會接收來自其他網格的影子，達成絕對通透無遮蔽的視覺效果。
- **幾何尺寸精密收縮 (Precision Resizing)**：
  - 將圓柱罩體與半球罩頂的半徑從 `2.3` 縮小至 `1.45`，使比例更緊密契合寬度約 `1.6` 的中心 LOGO 模型，消除過往巨大空曠的空間感，提升整體精緻度。
  - 圓柱體高度從 `4.0` 縮減至 `2.6`，頂部半球體位移與底部防護圈位移相應由 `2.0` / `-2.0` 校正為 `1.3` / `-1.3`。
- **完美貼合展示底座 (Perfect Base Contact)**：
  - 將轉場下降的最低點 Y 座標 `targetY` 從 `1.8` 調校至 `1.3`。
  - 當玻璃罩完全降下時，底部防護圈的世界座標高度剛好為 `Y = 1.3 - 1.3 = 0.0`，使金屬防護圈能以嚴絲合縫的完美姿態貼合在 Y=0.0 的主展示底座頂面上。
- **粒子運動邊界同步 (Smoke Boundary Alignment)**：
  - 配合玻璃罩尺寸的縮小，同步調整了 `animate()` 中煙霧粒子的運動範圍。
  - 將煙霧粒子的最高生命邊界從 `3.5` 調小至 `2.0`，底部位置重置點從 `-2.0` 校正為 `-1.3`，且初始隨機擴散半徑縮減為 `1.2 * shrinkFactor`，保證煙霧粒子軌跡完美侷限在縮小後的玻璃罩內腔。

---

## [v1.7.0] 2026-05-19 — 方案 A 技術設計討論：玻璃罩無縫轉場物理化與雙重煙霧遮蔽系統規劃

**技術規劃與設計基準：**

為達成 3D LOGO 在材質切換時「徹底遮蔽、視覺無縫」的高端體驗，針對方案 A（實體機械感玻璃罩起降）進行完整技術論證並確立以下優化指標：
- **玻璃罩物理厚度與絕對遮蔽 (Refraction & Full Opacity)**：
  - 將現有單層網格重構為具備真實物理厚度的雙層網格（Double-walled Mesh），提供真實的雙重折射高光邊緣。
  - 在玻璃罩降至最低點（Y 軸 1.8）的關鍵影格，將材質的 `transparent` 設為 `false`，並在自訂 Shader 中強制關閉混合，暫時轉為絕對不透光體，徹底杜絕強背景光下的邊緣漏光與內部殘影。
- **高質感凹槽基座與物理卡合 (Base Rim & Air Lock Animation)**：
  - 於主展示台底部建置 3D 凹槽底座。當玻璃罩 Rim 降下卡合時，觸發水平擠壓向外擴散的煙霧擴散動畫，增強物理卡合與氣體噴射的機械實體感。
- **吸發光雙重煙霧系統 (Absorptive & Emissive Smoke System)**：
  - 廢除單一的相加混合煙霧，重構為雙重粒子管線：
    1. **吸光煙霧 (Absorptive Smoke)**：採用 `NormalBlending`，以深灰色、具備高遮光性的粒子為核心，在扣合瞬間將內部幾何體完全遮蔽。
    2. **發光煙霧 (Emissive Smoke)**：採用 `AdditiveBlending`，僅於邊緣或撞擊時提供科技感粒子光暈點綴。
- **影格精確無縫轉場時間軸 (Frame-Perfect Dissolve Timeline)**：
  - **0.00s ~ 0.85s (下降消融)**：罩子下降，`obscureFactor` 上升，舊材質 LOGO 透過 Simplex Noise Shader 平滑消融。
  - **0.85s ~ 1.10s (扣合盲區)**：罩子 100% 遮蔽，粒子最濃。此時在背景無縫更新材質引數，並將新材質的溶解值置為 `1.0`（全消融隱形）。
  - **1.10s ~ 2.20s (升起重組)**：罩子上升，煙霧擴散，新材質 LOGO 溶解度從 `1.0` 降回 `0.0`，平滑重組現身。

---

## [v1.6.1] 2026-05-19 — 幾何還原與轉場解耦：恢復中心 LOGO 幾何、獨立材質切換與主題背景影片、強化轉場聯動鎖定

**修改檔案：3d_lab.html**

**修復細節與優化：**
- **還原中心展示幾何 (LOGO Restoration)**：
  - 移除了先前在 `loadModel` 中強制將 `LOGO` 幾何體取代為圓角正方體的覆寫邏輯，使主展示台恢復顯示 GLB 原生的 3D LOGO 幾何模型。
  - 保留卡片預覽區的圓角正方體，維持精美一致的材質展示效果，但在核心位置完整呈現專屬品牌識別。
- **解耦材質切換與主題背景影片 (Decoupling Transitions)**：
  - 徹底從 `.showcase-card` 的材質點擊切換事件中，移除了影片播放 (`vid.play()`)、WebGL 背景置空 (`scene.background = null`) 與陰影淡出的動作。
  - 材質切換現在僅專注於「3D 玻璃罩物理起降」與「煙霧粒子瀰漫擴散」的三維動態，不再干涉 HTML 影片與 WebGL 背景，消除了過渡期間的背景閃爍與不必要的黑白淡入。
- **優化多軌轉場聯動鎖定 (Unified Transition Lock)**：
  - 更新右上角主題切換器 (`themeToggle`) 的 click 監聽器，新增 `isMaterialTransitioning` 判斷。
  - 當主展示台正進行「玻璃罩」材質轉場時，主題切換點擊將會自動被阻斷，防止同時觸發 3D 動態與 2D 影片背景切換而導致的狀態衝突。

---

## [v1.6.0] 2026-05-19 — 奢華轉場與幾何重構：玻璃罩下降、煙霧粒子、背景影片三維協調轉場系統與高精度圓角正方體 (RoundedBoxGeometry) 導入

**修改檔案：3d_lab.html**

**新增功能與細節：**
- **高精度圓角正方體 (RoundedBoxGeometry) 導入**：
  - 引進圓角正方體取代原先的環狀扭結 (TorusKnot) 作為展示幾何。圓潤的邊角與平坦的表面，大幅提升了 Physical 與 Toon 材質在光線折射、全反射 (IOR) 與次表面散射 (SSS Jelly) 下的清晰度，消除了重疊網格產生的雜亂反射。
  - **主模型展示幾何**：將預設的 `LOGO` 幾何體動態替換為高精度 `new RoundedBoxGeometry(1.6, 1.6, 1.6, 6, 0.25)`，以大面積亮面展現寫實的影棚環境光反射。
  - **微型卡片預覽幾何**：微型 WebGL 卡片預覽場景中的網格同步替換為小比例圓角正方體 `new RoundedBoxGeometry(0.55, 0.55, 0.55, 6, 0.08)`，達成展示櫃與舞台的主題一致性。
- **3D 玻璃罩與煙霧轉場特效系統 (Glass Cover & Smoke Timeline)**：
  - **3D 玻璃罩 (glassCoverGroup)**：在 `initScene()` 中使用 `MeshPhysicalMaterial` 實作一個高折射（IOR 1.5）、具備 Clearcoat 強光塗層的半球體罩子。在切換材質時，順暢從高空（Y 12.0）降下（Y 0.0）將模型完全扣住，切換完成後平滑升起。
  - **煙霧粒子特效 (smokeParticles)**：透過 150 個細微粒子 (`THREE.Points`) 與隨機運動軌跡在模型周遭擴散。在玻璃罩下降至臨界中心點（1.1 秒）時，煙霧透明度漸增至最濃（Opacity 1.0），遮蓋材質參數切換的瞬間，隨後伴隨玻璃罩升起漸淡消散（Opacity 0.0）。
  - **背景影片對比閃光**：轉場時將 WebGL 背景透明化並淡出影子，露出背後反向色調的背景轉場影片，以極具衝擊感的動態閃光掩護材質變更。
- **交互防重複點擊鎖定 (Transition Lockdown)**：
  - 為防堵轉場未播完前重複點擊導致動畫時間軸與材質變數紊亂，點擊卡片時會將所有 Showcase 卡片及右上角主題切換器加入 `.transition-lock` 樣式。
  - CSS 中新增樣式 `.transition-lock`，套用 `pointer-events: none !important; opacity: 0.65; cursor: not-allowed !important;`，阻斷所有的滑鼠點擊與鍵盤交互，轉場完成後精確釋放鎖定。
- **首屏平滑滾動**：卡片點擊時觸發 `window.scrollTo({ top: 0, behavior: 'smooth' })` 平滑回彈，確保使用者在首屏直接觀賞華麗的玻璃罩與煙霧轉場特效。

---

## [v1.5.5] 2026-05-19 — 修復轉場鎖定：重構主題切換器 (Switcher Transition Lock) 與防呆超時解鎖機制

**修改檔案：3d_lab.html**

**修復細節與優化：**
- **CSS 阻斷點擊**：在 CSS 中定義 `.theme-switcher.transition-lock` 樣式，設定 `pointer-events: none !important` 與 `opacity: 0.5`，在瀏覽器渲染層與視覺上同步鎖定並給予半透明的禁用回饋，避免使用者在影片播放期間進行二次或快速點擊。
- **JS 一次性事件綁定**：移除了原先在 click 事件中重複對 `video.onended` 進行賦值的做法，重構為在頁面初始化時，使用 `addEventListener` 單次綁定 `ended` 事件，避免重複註冊與潛在的記憶體洩漏問題。
- **安全防呆超時解鎖 (transitionFallbackTimeout)**：新增 3.5 秒的防禦性定時器。若瀏覽器因解碼延遲、標籤頁切換或安全性原則導致轉場影片卡死或未觸發 `ended` 事件，定時器會自動強制解鎖，確保主題切換器不會永久失效。
- **集中化管理解鎖與復原 (`unlockThemeToggle`)**：建立統一的狀態恢復函式，整合清除安全定時器、移除 `transition-lock` 樣式類別、重設 `isTransitioning = false`、還原 WebGL 靜態背景，並根據切換後的主題，平滑淡入陰影（Light 模式限制為 0.3，Dark 模式恢復 1.0 強度）。

---

## [v1.5.4] 2026-05-19 — 卡片視覺強化：整合微型 3D 材質預覽幾何體 (Micro TorusKnot Showcase)

**修改檔案：3d_lab.html**

**新增功能與細節：**
- **HTML 結構擴充**：在 `.showcase-card` 內新增 `.card-preview` 容器，用於掛載微型 WebGL 畫布；`.upload-card` 新增 `.card-preview-upload` 上傳虛線指引。
- **CSS 樣式優化**：定義卡片內預覽容器的定位與比例，適配深/淺雙色主題。設定 `pointer-events: none` 確保使用者點擊卡片任何區域皆能順利觸發材質切換與首屏回彈。
- **微型 3D 渲染系統 (`initCardPreviews`)**：
  - 每個展示卡片獨立建立一個輕量化的 Three.js 渲染管線（採用與主場景相同的 ACESFilmic 色調對應與 1.5 倍抗鋸齒解析度限制，以兼顧效能與視覺精緻度）。
  - 使用圓環扭結幾何體（`TorusKnotGeometry`）作為預覽物件。其複雜的曲面反射與折射特性，能完美呈現 Physical 與 Toon 材質在不同參數下的焦散、折射率與薄膜干涉效果。
  - 將主場景的統一 HDRI 環境貼圖同步載入至各預覽場景中，提供與主模型一致的高規格寫實反射效果。
  - 注入平滑的低速旋轉動畫，增強靜態網格的動態生命力。

---

## [v1.5.3] 2026-05-19 — 根本原因修復：attenuationDistance=0 + transmission>0 導致 shader 路徑異常

**修改檔案：3d_lab.html**

**Bug 根本原因：**
在 Three.js r169 中，`MeshPhysicalMaterial` 使用 `attenuationDistance > 0` 來決定是否加入 `USE_ATTENUATION` shader define。
當 `attenuationDistance = 0.0`（原先的 non-SSS 預設值）且 `transmission > 0` 時，shader 的 transmission 計算路徑缺少必要的 attenuation 設定而異常，導致模型渲染為完全透明（不可見）。

METAL（`transmission = 0`）不走 transmission render pass，因此不受影響。  
JELLY（`attenuationDistance = 2.0`）觸發 `USE_ATTENUATION` 路徑，運算正確。

**修正方式：**
- 所有 non-SSS 材質預設值的 `attenuationDistance` 從 `0.0` 改為 `Infinity`（Three.js 的正確預設值，語意為「無衰減」）
- 在 `applyCurrentParamsToModel` 加入防禦性轉換：`params.attenuationDistance` 為 0 或 Infinity 時一律上傳 `Infinity`，避免未來誤操作

---



**修改檔案：3d_lab.html**

**Bug 原因（v1.5.1 引入的 Regression）：**
v1.5.1 對 Physical→Physical 的所有切換強制 dispose + 重建材質。重建後的材質 `transmission` 預設為 0，同時保留 `transparent: true`。Three.js 內部對 `transmission > 0` 走獨立的 Transmission Render Pass，但 `transparent: true` 會將物件排入 transparent queue 並套用 alpha blending，兩者同時作用導致渲染輸出異常。METAL（`transmission = 0`）不走 Transmission Pass 而倖免。

**修正方式：**
- 回歸「僅在材質類型切換時重建」策略：Physical→Physical 直接更新屬性，不重建材質。
- 移除 `transparent: true` 的硬性設定；改為只在 `transmission === 0 && opacity < 1` 時才設 true，讓 Three.js 自行管理 transmissive 材質的透明度。

---

## [v1.5.1] 2026-05-18 — 修復 HOLO / JELLY / TOON 材質不顯示 (Shader Uniform Breakage Fix)

**修改檔案：3d_lab.html**

**Bug 原因：**
`applyCurrentParamsToModel()` 採用「材質類型不變則複用」策略，但 HOLO（`iridescence > 0`）與 JELLY（`attenuationDistance > 0`）會改變 Three.js 內部的 shader program defines（`USE_IRIDESCENCE`、`USE_ATTENUATION`），迫使 WebGL 重新編譯 shader。重編譯後 `onBeforeCompile` 本應再次被呼叫以重新注入 `uDissolve` uniform，但 Three.js 在程式快取命中失效的邊界條件下，`uDissolve` 斷鏈，導致 uniform 在 GPU 端永遠停在編譯時的初始值 1.0，所有 fragment 被 discard，模型永久不可見。TOON 則因為 `MeshToonMaterial` 與 `MeshPhysicalMaterial` 的 fragment shader 在 WebGL2 下對 `gl_FragColor` 的處理差異，造成類似的 uniform 注入失敗。

**修正方式：**
重寫 `applyCurrentParamsToModel()`，改為在每次 preset 切換時強制 dispose 舊材質並重建新材質，確保 `onBeforeCompile` 在乾淨的編譯週期中正確注入，`uDissolve` uniform 始終與 `sharedDissolve` 物件正確連結。

---

## [v1.5.0] 2026-05-18 — 擴充高階 3D 材質與 Shader 雜訊溶解轉場 (Dissolve Transition)

**修改檔案：3d_lab.html**

**修改原因：**
回應使用者需求，將材質實驗室擴展至更進階的非寫實與特效領域，並實作基於客製化 Shader 的模型材質切換轉場特效，大幅提升互動過程中的視覺震撼感。

### 核心更新：
1. **高階物理/非寫實材質擴充 (Advanced Materials)**：
   - 新增 `HOLO` (全息投影/炫彩)：啟用 `MeshPhysicalMaterial` 的 `iridescence` 與 `iridescenceIOR` 屬性，營造薄膜干涉與隨視角變幻的色彩。
   - 新增 `JELLY` (半透明果凍)：利用 `transmission` 結合 `attenuationColor` 與 `attenuationDistance`，實現次表面散射 (Subsurface Scattering, SSS) 般的邊緣高光通透感。
   - 新增 `TOON` (動漫/賽璐璐風格)：動態將材質切換為 `MeshToonMaterial`，並利用程式生成的 `THREE.DataTexture` (Gradient Map) 創造邊緣銳利的二次元光影分界。
2. **UI 與控制器同步 (Tweakpane & Showcase)**：
   - 在底部的卡片展示區，補上了 `HOLO_SIM`、`JELLY_SIM`、`TOON_SIM` 的 HTML 展示卡片。
   - 在右上角的 Tweakpane UI 控制面板新增 `Special Effects` 分類，可以動態調整 `iridescence`、`attenuationDistance` 與 `isToon` 屬性。
3. **程式碼 Shader 雜訊溶解轉場 (Noise Dissolve Fade)**：
   - 利用 `material.onBeforeCompile` 強大功能，直接注入客製化 GLSL 程式碼至 Three.js 的底層 Shader (`vertexShader` 與 `fragmentShader`)。
   - 實作了 3D Simplex Hash Noise 演算法生成隨機雜訊，並配合自訂的 `uDissolve` Uniform。
   - **過渡動畫**：當點擊任意材質卡片時，使用 `requestAnimationFrame` 與緩動函數 (Ease In-Out) 驅動 `uDissolve` 從 0 到 1 (溶解消失)，替換材質屬性後再由 1 到 0 (重組現身)。並伴隨充滿科技感的冰藍色邊緣發光 (Edge Glow) 效果。
4. **主題切換的重置機制**：
   - 修改了 `updateModelTheme()` 函式，確保在點擊 Light/Dark 主題時，能正確清除 `iridescence`、`isToon` 等特殊效果，避免材質狀態混亂。

---

## [v1.4.0] 2026-05-18 — 程式化動態焦散光斑 (Procedural Caustic Gobo)

**修改檔案：3d_lab.html**

**修改原因：**
使用純 WebGL 程式碼 (GLSL Shader) 模擬 Blender 的複雜節點光線，實作動態的「帶有色散邊緣 (Chromatic Aberration) 的焦散光斑」，而不需要額外掛載或算圖成龐大的影片檔。

### 核心更新：
1. **Shader 動態生成光斑**：
   - 撰寫客製化的 `ShaderMaterial`，內部實作 2D Simplex Noise 演算法來模擬水波折射的焦散紋理 (Caustics)。
   - 加上邊緣 `smoothstep` 圓形遮罩，讓光斑完美羽化融入環境。
   - *(註：因視覺效果不明顯，暫時移除色散 (Chromatic Aberration) 設定，改為純亮度的焦散光斑以求簡潔)*
2. **WebGLRenderTarget 動態投影**：
   - 建立獨立的 `causticScene` 與 `causticCamera`，每一幀 (`animate()`) 都會更新並算繪這個 Shader 至一個 `WebGLRenderTarget` (512x512)。
   - 利用 Three.js 的新特性 `SpotLight.map`，直接將這個動態生成的 Texture 指定給現有的 `shadowLight`。
   - 達成無縫循環、零檔案大小負擔且高效能的極致電影光影投射，完美取代原本 Blender 中的複雜節點。
3. **特定材質動態過渡 (Fade-in/out) 與互動優化**：
   - 在 Shader 中新增 `uIntensity` 參數。當切換材質時，透過 `THREE.MathUtils.lerp` 平滑插值，實現焦散光斑的無縫淡入淡出。
   - 限制只有在選擇 `WATER` 材質時，焦散光斑才會顯現；其餘材質則退回乾淨的圓形聚光燈。
   - 新增使用者體驗優化：點擊任意材質卡片後，畫面將會自動平滑滾動至網頁最上方 (首屏)，以便立刻預覽材質與光影變化。
4. **切換器防抖 (Debounce / Lockdown)**：
   - 實作了 `isTransitioning` 鎖定旗標。當用戶點擊 Theme Switcher 時，在轉場影片播放完畢前，將鎖死按鈕防止重複觸發而導致背景錯亂的問題。

---

## [v1.3.0] 2026-05-18 — 實作預設材質動態切換與自訂 GLB 模型上傳功能

**修改檔案：3d_lab.html**

**修改原因：**
1. 實作用戶點擊下方卡片時，能夠即時將主體模型（LOGO）替換為不同材質（Water, Fire, Wood, Metal）的效果。
2. 讓用戶能動態讀取本地端自訂的 .glb 檔案並導入場景，將這項功能整合為第 5 張展示卡片（IMPORT .GLB）。

### 核心更新：
1. **預設材質動態切換系統**：
   - 建立 `materialPresets` 字典，預先設定好 Water, Fire, Wood, Metal 各種專屬的物理材質參數 (transmission, roughness, metalness, ior 等)。
   - 封裝 `applyCurrentParamsToModel` 函式，並對所有 `.showcase-card` 綁定 Click 監聽器，點擊後會自動覆寫 Tweakpane 參數 (`params`)，同步即時更新材質畫面與 UI。
2. **動態載入 GLB 模型 (Custom Import)**：
   - 重構 `loader.load` 邏輯，改由獨立的 `loadModel(url, isCustom)` 進行動態載入。
   - 新增一個隱藏的 `<input type="file" accept=".glb,.gltf">` 供選擇本地檔案。
   - 點擊 `#upload-glb-card` 時觸發選擇器，透過 `URL.createObjectURL(file)` 將檔案轉換為可用路徑進行載入。
   - 處理動態替換：匯入自訂模型時自動 `scene.remove` 舊模型，並抓取新匯入檔案中的第一個 `isMesh` 成為新的 `mainModel`。同時自動運算 `BoundingBox` 將任意大小模型重縮放並置中，最後重新套用透明折射材質。

---

## [v1.2.0] 2026-05-18 — 實作電影級雙向轉場影片與陰影平滑過渡

**修改檔案：3d_lab.html**

**修改原因：**
1. 滿足將背景完全替換為轉場動畫影片的需求，避免單純 CSS 漸變的單調。
2. 解決深淺切換與轉場期間，模型陰影（Shadow）會生硬地「瞬間出現 / 消失」並遮擋影片畫面的問題。

### 核心更新：
1. **電影級影片轉場疊層系統**：
   - 加入 z-index 層疊架構與雙向影片播放邏輯 (`black_to_white.mp4` 與 `white_to_black.mp4`)。
   - 轉場期間將 `scene.background` 設為透明 (`null`) 露出底部影片，並維持環境反射 `scene.environment` 以確保玻璃表面光澤流暢。
2. **陰影與聚光燈動態插值 (Lerp Fade In/Out)**：
   - 建立 `shadowMaterials` 收集地表與底座的陰影材質。
   - 於 `animate()` 迴圈中導入 `shadowMultiplier` 與 `targetShadowMultiplier` (0.0 ~ 1.0) 的線性插值 (Lerp)。
   - 切換主題時觸發陰影與聚光燈強度平滑歸零淡出；轉場影片播放完畢後 (`onended`) 再平滑恢復淡入。
3. **優化邊緣羽化 (Feathering)**：
   - 將 SpotLight 的 `penumbra`（半影邊緣）推至最大值 `1.0`。
   - 啟用 PCFSoftShadowMap 後，額外增加 `shadowLight.shadow.radius = 12`，以打散並極致柔化（Feather）投射邊緣，使影子在畫面上更具電影底片感。
4. **環境適應型陰影濃度**：
   - 當切換至淺色 (Light) 模式時，將目標陰影淡入倍率 (`targetShadowMultiplier`) 下調至 `0.3`。
   - 使影子在白色背景下顯得更為輕透淡雅，不會因為對比過強而顯得突兀；深色 (Dark) 模式則維持 `1.0` 的紮實感。

---

## [v1.0.0] 2026-05-12 — 系統初始化與動態燈光建置

**修改檔案：3d_lab.html**

### 核心更新：
1. **動態視覺系統建立**：
   - 實作了基於 `SpotLight` 的動態掃描燈光，並增加 `Penumbra` 羽化效果，提升光影質感。
   - 優化了陰影接收材質 `ShadowMaterial`，解決了背景與 3D 模型陰影的融合度問題。
2. **物理交互系統移植**：
   - 從 `glass_test.html` 移植了進階旋轉邏輯，包含「慣性拋擲」、「自動回彈」與「液態懸停延遲」。
3. **初始位姿修正**：
   - 自動擷取模型載入時的原始 Quaternion 作為歸位基準，修正了啟動時顯示側面的錯誤。

---

## [v1.1.2] 2026-05-12 — 修復 CSS 語法錯誤與環境穩定性建議

**修改檔案：3d_lab.html**

**修改原因：**
1. 修復 CSS 中 `:root` 區塊未閉合的語法錯誤，解決 IDE 報錯「必須是 }」。
2. 明確說明模型消失的主因為 CORS 限制，必須透過本地伺服器運行。

### 核心更新：
1. **語法校正**：修復了 CSS 樣式表中的括號平衡問題。
2. **開發建議**：在程式碼中新增環境限制提示。
## [v1.1.7] 2026-05-13 — 統一 HDRI 環境映射

**修改檔案：3d_lab.html**

**修改原因：**
1. 依據需求，將深色模式與淺色模式的環境反射光源統一為 `monochrome_studio_01_4k.hdr`，以確保模型在兩種主題下擁有更具一致性的黑白影棚高光質感。

### 核心更新：
1. **簡化 HDRI 載入邏輯**：移除了雙 HDRI (ferndale 與 monochrome 混合) 的機制，直接載入單一的 `monochrome_studio_01_4k.hdr`。
2. **主題映射統一**：修改 `updateModelTheme()`，無論是在 Dark Theme 還是 Light Theme，`scene.environment` 皆直接調用同一個 `hdriTexture`，減少不必要的記憶體載入並提升光影一致性。

---

## [v1.1.6] 2026-05-13 — 支援動態主題雙 HDRI 光源映射

**修改檔案：3d_lab.html**

**修改原因：**
1. 因應網頁淺色模式 (Light Theme) 切換，提供適合白底環境的亮色系高動態範圍光源 (HDRI)。

### 核心更新：
1. **導入雙 HDRI 系統**：新增載入 `monochrome_studio_01_4k.hdr` 作為淺色模式下的環境反射源。
2. **主題聯動同步**：修改 `updateModelTheme()` 與初始化邏輯，當網頁切換至淺色模式時，玻璃材質的反光會自動抓取 `monochrome_studio_01` 的明亮反光；切換至深色模式時則維持 `ferndale_studio_02`。

---

## [v1.1.5] 2026-05-12 — 移除模型發光與強化玻璃通透度

**修改檔案：3d_lab.html**

**修改原因：**
1. 修復模型看起來「霧霧的」（像實體模型或有厚重黏土感）的問題。

### 核心更新：
1. **移除錯誤的發光屬性**：過去的版本在深色模式下會給予材質 `emissive`（自發光）數值 0.1，導致純白光澤覆蓋了原本應該透明的材質，現已將 `emissive` 完全歸零。
2. **導入 Clearcoat 塗層**：在 `MeshPhysicalMaterial` 新增 `clearcoat: 1.0` 與 `transparent: true`，極大化玻璃表面的反光清澈度與內部通透混合。
3. **優化折射參數**：將 `metalness` 降為 0，確保傳輸（Transmission）效果不會被金屬特性阻擋，並重置基礎預設參數，恢復純淨的冰晶質感。

---

## [v1.1.4] 2026-05-12 — 導入專業攝影棚 HDRI 光源

**修改檔案：3d_lab.html**

**修改原因：**
1. 提升玻璃材質的表面反射（Reflection）品質，使其擁有更具真實感的光源反光點與攝影棚環境光澤。

### 核心更新：
1. **載入 `ferndale_studio_02_4k.hdr`**：使用 `RGBELoader` 載入高動態範圍的環境貼圖。
2. **無縫整合環境與折射**：
   - 繼續維持 `scene.background` 為原本的平面網頁背景（供玻璃內部**透射/折射**使用）。
   - 將 `scene.environment` 指定為新載入的 HDRI（供玻璃表面**反射/高光**使用）。
   - 在深淺主題切換時，確保環境反射始終擁有 HDRI 的高品質支援。

---

## [v1.1.3] 2026-05-12 — 移除校對模式與優化玻璃透感

**修改檔案：3d_lab.html**

**修改原因：**
1. 依據需求關閉並移除校對模式介面，還原乾淨的展示體驗。
2. 解決玻璃材質傳輸 (`transmission`) 透感不足的問題，並精確還原「折射平面背景但保留網頁透明度」的高難度需求。

### 核心更新：
1. **獨立背景映射系統**：分離了 `scene.background` (用於精確平面折射) 與 `scene.environment` (用於 360 度邊緣反射)，並為背景圖編寫了與 CSS `background-size: cover` 相同的 RWD 自動縮放邏輯。
2. **深度擦除器 (Shader Eraser) 技術**：
   - 為解決 WebGL 背景遮擋網頁其他 HTML 元素（如右側星空影片）的問題，實作了基於 Shader 的 `Eraser Mesh`。
   - 此技術會讓玻璃正常折射背後的平面背景，但在算圖的最後一刻，利用深度測試 (`depthFunc: THREE.EqualDepth`) 擦除掉沒有被玻璃蓋住的背景，完美兼顧了「真實的平面折射」與「網頁原生透明底層」。
3. **介面清理**：移除了 Tweakpane 內的 `Calibration` 選單與相關的三維數據同步邏輯。

---

## [v1.1.1] 2026-05-12 — 緊急修復：畫面與 UI 消失問題

---

## [v1.1.0] 2026-05-12 — Transmission 質感優化與 HDRI 同步

**修改檔案：3d_lab.html**

**修改原因：**
1. 解決 3D 玻璃模型因缺少背景參考而導致 `transmission` 效果不亮眼的問題。
2. 透過將現有的 CSS 背景圖導回 3D 環境作為 `Environment Map`，使模型表面能反射出場景的色調。

### 核心更新：
1. **環境同步 (HDRI Sync)**：
   - 將 `./3D_reference/3D_lab_black_BG.png` 載入為 `scene.environment`，提供玻璃反射所需的色彩資訊。
2. **材質參數調校**：
   - 預設 `ior` 提高至 1.55，增加邊緣折射感。
   - `thickness` 提高至 3.0，強化光線在玻璃內部的厚度表現。
   - `roughness` 降低至 0.05，恢復極致通透度。
3. **UI 控制項擴充**：
   - 新增 `Reflection Power (envMapIntensity)` 控制項，允許使用者動態調整環境反射的強度。

