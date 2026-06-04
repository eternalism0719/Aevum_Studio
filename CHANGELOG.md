## [2026-06-04] 3d_lab 終極材質與資源壓縮優化 (Branch: 3d_lab_optimization)\n\n### 1. 3D PBR 材質與參考圖全面 WebP 化\n- **問題**：3D_shader/ 底下的材質貼圖與 3D_reference/ 背景圖原本皆為肥大的 PNG 格式，合計逼近 8MB。\n- **改動**：使用 sharp 將總計 8 張巨型 PNG 材質轉檔為 .webp。總大小暴跌至 1.3MB，大幅縮短 DefaultLoadingManager 載入時間。並在 3d_lab.html 中同步更新路徑。\n\n### 2. 環境光 (HDR) 降階優化\n- **問題**：原 4K 的環境光高達 18.3 MB，是 LCP 延遲的最大兇手。\n- **改動**：替換為 1K 版的 .hdr (約 1.5MB)，砍掉 16MB 頻寬消耗。\n\n### 3. 背景影片瘦身\n- **問題**：背景動畫原本使用 10MB 的 MP4。\n- **改動**：將雙模式的背景影片皆統一修改為新版的 .webm，大幅縮減了動畫傳輸大小。\n\n---\n\n# AEVUM STUDIO — Portfolio Changelog

格式說明：每筆記錄包含異動檔案、行號、以及完整 before/after 程式碼片段，可直接用於還原。

---

## 2026-06-01

### [REFACTOR] 目錄結構重整（css / js / images 分類）

**分支：** `refactor/reorganize-structure`

**[搬移] CSS**

| 原路徑 | 新路徑 |
|--------|--------|
| `style.css` | `css/style.css` |
| `logo-lab.css` | `css/logo-lab.css` |

**[搬移] JS（14 支）**

| 原路徑 | 新路徑 |
|--------|--------|
| `3d-viewer.js` | `js/3d-viewer.js` |
| `galaxy.js` | `js/galaxy.js` |
| `grid-distortion.js` | `js/grid-distortion.js` |
| `logo-lab-viewer.js` | `js/logo-lab-viewer.js` |
| `main.js` | `js/main.js` |
| `page-enter-vfx.js` | `js/page-enter-vfx.js` |
| `page-transition-v1.js` | `js/page-transition-v1.js` |
| `page-transition-v4.js` | `js/page-transition-v4.js` |
| `page-transition-v4x62.js` | `js/page-transition-v4x62.js` |
| `page-transition-v5.js` | `js/page-transition-v5.js` |
| `page-transition.js` | `js/page-transition.js` |
| `temp_v20.js` | `js/temp_v20.js` |

**[搬移] 圖片**

| 原路徑 | 新路徑 |
|--------|--------|
| `screen.png`（根目錄孤立檔）| `images/screen.png` |

**[路徑修正] css/style.css 內部引用**
- `fonts/Anson.ttf` → `../fonts/Anson.ttf`
- `images/games_lab_coming_soon.png` → `../images/games_lab_coming_soon.png`

**[路徑修正] js/page-transition-v4.js**
- `images/system_page.png` → `../images/system_page.png`（第 173 行）

**[路徑修正] js/temp_v20.js**
- `images/system_page.png` → `../images/system_page.png`

**[HTML 路徑更新]**
- `brand.html`、`experiment-houdini.html`、`experiment.html`、`games.html`、
  `glass_test.html`、`glass_test_v1.html`、`index.html`、`logo-lab.html`、`project.html`
  — 全部 `src`/`href` 引用更新至新路徑（`css/`、`js/`）

**[已知遺留問題]（不在本次範疇）**
- `images/games_lab_coming_soon.png` 檔案不存在，style.css 中的引用為死路徑
- `finished.html` 被 index.html 引用但不存在於根目錄
- `videos/` 目錄被 3d_lab.html 引用，需確認實際部署位置

**Commit：** `ce10a6e` — `refactor: reorganize directory structure into css/ js/ images/`

---

## 2026-04-20 (2)

### [27] page-enter-vfx.js — 新增獨立的 PixiJS 光學折射入場波紋

**[功能新增] 從 test14.html 移植高級漸層折射入場特效**
- 新增：建立全新的 `page-enter-vfx.js` 獨立腳本，不影響原有的 V26 穩定退場引擎。
- 修改：當 `page-transition-v4.js` 結束退場並跳轉時，會在網址附加 `?from_transition=1&bh_x=X&bh_y=Y`。
- 新增：新頁面載入時，`page-enter-vfx.js` 會讀取座標，在滑鼠最後消失的位置（或螢幕正中央）觸發 PixiJS v8 的空間扭曲、RGB 漸層折射環（Add blending）、以及星屑射線。

### [41] page-transition-v4.js — 轉場節奏優化 (Transition Timing Advance)
- **跳轉時間提前**：將黑洞坍縮結束後的跳轉觸發門檻提高（`suctionAlpha` 0.02 -> 0.4）。這使得頁面導航（以及新頁面的爆炸特效）能提前約 0.5 秒觸發，減少了粒子完全消失後的空白等待感，使轉場銜接更具爆發力。

### [40] page-transition-v4.js — 轉場觸發條件限縮 (Restricted Transition Trigger)
- **精確觸發邏輯**：移除全域 `<a>` 標籤攔截，改為僅針對具備 `.bh-transition` 類別的元素執行黑洞轉場特效。
- **一般跳轉回歸**：點擊未具備該類別的普通連結時，將執行瀏覽器的原生跳轉，不會觸發碎裂與黑洞動畫。
- **實作範例**：已在 `index.html` 的 `PROJECT` 導覽連結中加入該類別。

### [39] page-transition-v4.js — 透明度遮罩修正 (Transparency Alpha Mask Fix)
- **消除黑色光暈**：修正了 Shader 的 Alpha 輸出邏輯。原本外圍會出現一圈淡淡的黑色不透明區域，現在已改為根據光強度動態決定透明度。
- **核心不透明維持**：確保黑洞中心的「事件視界」依然維持完全不透明的純黑，而外圍的光暈則能完美地與網頁背景融合，不會產生黑色邊界。

### [38] page-transition-v4.js — 色彩平衡微調 (Amber-Orange Balance)
- **色彩精確度優化**：微調了綠色通道的數值，在上一版的「深橘色」與早期的「金黃色」之間取得了中間值，呈現出更加高雅的「琥珀橘」（Amber-Orange）色調。
- **視覺通透感**：透過微調色彩係數，黑洞在維持深邃感的同時，也找回了部分的明亮細節，使轉場視覺更加平衡。

### [37] page-transition-v4.js — 色調深橘化優化 (Warm Orange Shift)
- **色相調整**：將整體色調從原本帶黃的「金黃色」轉向更為純粹、溫暖的「深橘色」（Deep Orange）。透過降低綠色通道數值，消除了金屬感，轉而呈現出更具熱能感的岩漿橘色調。
- **維持精細度**：在色調變更的同時，維持了 [36] 版的簡約美學與微型尺寸設定。

### [36] page-transition-v4.js — 色調回歸自然與視覺簡約化 (Natural Color Revert)
- **色調回歸**：移除了先前版本中較為激進的高飽和度調色，回歸至原始、自然的暖金橘配色（Gold-Orange），使視覺感受更加協調、耐看。
- **美學精簡**：移除色彩增益與對比度增強邏輯，在維持微型尺寸與穩定流動感的同時，回歸最初受好評的美學風格。

### [35] page-transition-v4.js — 精緻化尺寸與視覺穩定性優化 (Micro Scale & Stability)
- **極致尺寸下修**：在上一版的基礎上再縮小 40%（`bhRadius` 降至 0.054），使黑洞呈現如精密儀器般的微型能量核心感。
- **消除閃爍 (Anti-Flicker)**：將時間旋轉係數降低 80%，並優化了 FBM 噪點的混合權重，將原本不穩定的閃動轉化為極其緩慢、絲滑的能量律動。
- **色彩飽和度微調**：同步調整了光環的寬度與色彩對比，確保在微型化後依然具備清晰的視覺層次。

### [34] page-transition-v4.js — 黑洞整體尺寸下修 (50% Scale Reduction)
- **尺寸調整**：將黑洞基礎半徑與相關渲染參數等比例縮減 50%，使其在畫面上顯得更為精緻、不具壓迫感。
- **細節補償**：同步提升了縮小後的雜訊頻率，確保即使在尺寸減半的情況下，能量核心的閃爍細節依然豐富。
- **羽化同步**：重新計算了 `edgeFade` 的過渡區間，維持與縮小後黑洞一致的柔和邊緣質感。

### [33] page-transition-v4.js — 恢復原始能量質感與尺寸克制 (Aesthetic Revert)
- **視覺回歸**：恢復原始版本的 FBM 旋轉雜訊著色器邏輯，找回那種具備能量感、不穩定的黑洞核心美學，並移除類液態流動與透鏡折射效果。
- **色彩優化**：在維持原始邏輯的基礎上，保留了高飽和度的暖金橘配色，確保視覺上的沖擊力。
- **成長比例下修**：將黑洞吸入粒子後的成長係數從 1.5 降低至 0.8，使黑洞的擴張動作更加收斂、克制。
- **保留穩定性優化**：延續了 800px 畫布緩衝區與邊緣羽化邏輯，確保在恢復原始視覺的同時，依然不會出現裁切與鋸齒。

### [32] page-transition-v4.js — 顏色飽和度增強與成長空間優化 (Color & Headroom)
- **色調與飽和度優化**：大幅提升紅色比重並調整冪函數曲線，實現深紅金的高飽和度視覺感，強化黑洞的能量核心質感。
- **徹底解決裁切 (Clipping)**：將 WebGL 畫布擴展至 800px，並優化 Shader 內部的安全區域比例 (Safe-zone)，確保黑洞在最大成長狀態下（2.5 倍）邊緣依然平滑不被裁切。
- **渲染穩定性**：調整 `edgeFade` 起始點，確保即使在大尺寸渲染下，畫布邊緣的過渡依然無感且自然。

### [31] page-transition-v4.js — 類液態流動與透鏡折射優化 (Liquid Flow & Optics)
- **視覺透明度修復**：修正著色器 Alpha 輸出邏輯，確保黑洞外側區域完全透明，不再有黑色底塊。
- **流動感優化**：將雜訊演算法改為極座標旋轉映射，並大幅調低閃爍頻率，實現如「液態光流」般的穩定旋轉效果。
- **引力透鏡模擬**：在事件視界 (Event Horizon) 邊緣導入 1/r 空間扭曲公式，模擬黑洞強大引力造成的背景折射感。
- **防止跳轉白閃**：在跳轉瞬間強制設定 `body` 為深色背景，並延後畫布隱藏時機，確保從黑洞坍縮到新頁面載入之間無縫銜接。

### [30] page-transition-v4.js — 渲染精細化與流程優化 (Resolution & Polish)
- **解析度升級**：將黑洞 WebGL 離屏緩衝區提升至 512x512，徹底解決大尺寸黑洞被邊界裁切 (Clip) 的問題，同時消除邊緣鋸齒。
- **著色器優化**：調整 `bhRadius` 基礎係數並強化 `edgeFade` 羽化效果，使黑洞邊緣與背景的過渡更加柔和自然。
- **邊界質感提升**：調低切割邊緣像素塊 (Pixel Blocks) 的 Alpha 透明度與隨機尺寸，營造更細膩、不突兀的空間崩解感。
- **流程優化**：移除退場最後的「游標擴張閃光 (drawCursorGrow)」，讓轉場在黑洞坍縮完成後直接觸發跳轉，減少視覺多餘動作。

### [29] page-transition-v4.js — 退場黑洞回歸 FBM 著色器並調優色調 (Warm Gold Edition)
- **視覺進化**：全面改用基於 Raymarching 的高階著色器。新增引力透鏡 (Gravitational Lensing) 效果，光線路徑會受黑洞質量影響而彎曲。
- **吸積盤渲染**：導入程序化 Torus 空間定義，模擬出具備斜視視角的扁平吸積盤，並加入動態程序化雜訊以呈現物質流動感。
- **物理特性**：維持 0.15 的 Lerp 慣性追蹤，結合 Shader 內的引力模擬，讓黑洞在視覺上更具真實的空間扭曲感。
- **渲染優化**：提昇至 highp float 精度以支援更精確的光線路徑模擬，並完美整合轉場引擎的 u_alpha 與 u_scale 參數。

### [28] page-transition-v4.js — 優化退場黑洞游標顯示
- 修正：在進入黑洞退場階段時，強制將 UI 游標(`.cursor-outer`, `.cursor-inner`等)透明度設為 0，避免自訂游標卡在畫面左上角產生視覺干擾。
- 數值微調：大幅增加黑洞游標的基礎半徑比率 (7 -> 14)，讓黑洞吞噬的視覺體積更明顯且更具氣勢。
- 優化：特效總時間從 `1.2` 秒延長至 `2.5` 秒，空間扭曲的擴散波速（Shockwave speed）降至原本的三分之一，並放慢星屑火花的初速與消散速度，讓入場爆發有更緩慢、優雅的史詩感。
- 效能：特效播放完畢後，會完全銷毀 PixiJS Canvas 與引擎，完美釋放記憶體，確保後續操作無任何負擔。
- 目的：達成「極慢黑洞吞噬（退場） -> 緩慢爆發與光學折射（入場）」的完美連貫體驗，維持電影般的節奏與系統的解耦。

---
## 2026-04-20 (1)

### [26] page-transition-v4.js — 移除 PixiJS 液態轉場，回歸純粹黑洞與粒子特效

**[功能移除] 移除 WebGL 液態震波**
- 修改：根據要求，將先前嘗試整合的 PixiJS v8 WebGL 液態入場特效（Shockwave）與相關的 URL 參數傳遞邏輯完全移除。
- 目的：維持系統極簡，專注於原先穩定且具備史詩感的「碎裂粒子」與「黑洞坍縮」退場邏輯，確保效能與純粹的視覺體驗。

**[數值微調] 遮罩與粒子動態改為「由慢到快」，並維持微調後的風力**
- 修改：將遮罩碎裂的掃描速度曲線更正為「由慢變快」（`4.0 + p^2.5 * 60`），讓畫面一開始極度緩慢剝落，後半段則加速瓦解崩塌。
- 修改：將粒子剛生成時受到的初始向右「陣風力量」(`vx`) 套用對應曲線（`vx += p^2 * 4.0`），使越晚剝落的粒子受風力越大，呈現逐漸失控的崩塌感。
- 修改：將第一階段黑洞向心力與基礎引力維持減半狀態，確保漂流感。
- 修改：將第二階段黑洞坍縮的「慢動作滯空期」維持在 `0.40秒`。
- 修改：將最後向內坍縮收束的速率維持在極慢的 `0.15`。
- 目的：根據要求，讓整體節奏呈現「起手緩慢醞釀、結尾加速崩潰」的動態層次感。

---
## 2026-04-18 (1)

### [25] page-transition-v4.js — 核心邏輯全面重構與游標歸位優化

**[撤回重構] 恢復穩定版物理引擎並無縫匯入 PixiJS**
- 問題：先前的全面重構不慎刪除了 V22 版本中精心調校的「暗色粒子剔除」、「兩階段坍縮黑洞物理」以及「邊緣羽化」等核心效果。
- 修正：完全退回至穩定的 `page-transition-v4.js` 版本，並以「不破壞原邏輯」為前提，在腳本底部獨立、乾淨地注入了 WebGL 液態入場特效（PixiJS）與 URL 參數解析邏輯。


**[優化] 游標與震波中心強制歸位**
- 修改：調整 `transitionToPage` 的參數傳遞邏輯。現在點擊跳轉後，新頁面的「自定義游標」與「液態震波特效中心」皆會被強制重置到螢幕正中央 (`window.innerWidth / 2`, `window.innerHeight / 2`)，提供更一致的視覺體驗。

**[修復] PixiJS 資源載入強健化**
- 修改：使用非阻塞式的 `PIXI.Assets.load` 並加入防呆備援機制。即使 `images/` 下缺少對應頁面的截圖，也會自動套用 `system_page.png`，避免因找不到圖片而導致畫布卡死。
- 優化：加入 4 秒「緊急救援計時器」，若特效執行超時將自動摧毀畫布露出真實網頁，實現防彈級（Bulletproof）載入體驗。

---

## 2026-04-17 (8)

### [24] page-transition-v4.js — 升級 Codrops 風格液態轉場 (Liquid Distortion)

**[新增] 液態位移特效 (Displacement Transition)**
- 實現：導入 `PIXI.DisplacementFilter` 並配合自定義 `disp_map.png` 噪點圖。
- 效果：入場時畫面呈現液態流動感，隨時間平滑恢復清晰（Displacement Scale 120 -> 0）。
- 優化：結合 `ShockwaveFilter` 達成更具層次感的 WebGL 轉場。

---

### [23] page-transition-v4.js — 導入 PixiJS WebGL 震波轉場與游標鎖定優化

**[新增] PixiJS WebGL 震波入場 (PixiJS Shockwave Entrance)**
- 實現：利用 `PixiJS` 與 `ShockwaveFilter` 達成真實的 WebGL Shader 像素折射特效。
- 邏輯：退場時將游標座標傳遞至 URL (`sx`, `sy`)，新頁面載入時根據座標在 WebGL Canvas 上噴發震波。
- 相容性：修正 PixiJS v8 的 `app.canvas` vs `app.view` 屬性更名問題。

**[修復] 游標閃跳與層級問題 (Cursor & Z-Index Fix)**
- 游標鎖定：在新頁面震波播放期間強制 `document.body.style.cursor = 'none'`，徹底解決游標在 (0,0) 閃現的問題。
- 層級優化：將震波 Canvas 的 `z-index` 設為 `2147483647`，確保特效蓋過所有 3D 場景與 UI 元素。

---

### [22] page-transition-v4.js — 撤回衝擊波實驗 & ShockwaveFilter 原理分析

**[撤回] 衝擊波特效全數移除 (Revert Shockwave Effects)**
- 原因：Canvas 模擬效果不佳，且轉場邏輯與預期不符。
- 狀態：還原至僅包含「黑洞吸入」轉場的版本。移除所有 URL 參數傳遞與入場爆炸邏輯。

**[分析] ShockwaveFilter 的核心原理 (ShockwaveFilter Analysis)**
1. **位移置換 (Displacement)**：真正的 ShockwaveFilter (如 PixiJS 實作) 是基於 Shader 的像素位移，它不帶顏色，而是對背景影像進行「折射 (Refraction)」式扭曲。
2. **無界限感**：波紋邊緣是平滑漸變的，影像在波紋經過時會產生放射狀的位移（先外推再內拉），形成類似水波或空氣壓縮波的效果。
3. **Canvas 侷限**：在 2D Canvas 環境中，使用 `clip()` 與 `scale()` 只能達成區域性的縮放，難以模擬像素級的連續置換感，容易產生生硬的邊界。

---

## 2026-04-17 (5)

### [21] page-transition-v4.js — 極致效能與UI崩塌優化

**[優化] 90% 暗色粒子直接刪除**
- 修正：將亮度低於 40 的暗色粒子生成剔除機率從 30% 大幅提升至 **90%**。這能極端減少隱藏在黑色背景中的無效粒子數量，大幅改善效能。

**[修] 黑洞 UI 瞬間向內坍縮**
- 修正：保留「粒子依權重逐漸被橢圓軌道吸入」的美觀動態。但在粒子全數被吸收完畢後，將黑洞本體的縮放係數 `bhGrowth` 衰減速度從 `0.22` 大幅提升至 `0.55`。同時將黑洞 UI 的 Y 軸壓縮還原，恢復為正圓的吸收型態。
- 效果：當吸收完成後，黑洞會以極快速度向內坍縮成一個點，創造出強烈且具有視覺衝擊力的「吸完後攤縮進黑洞」收束感。
**[修] 游標邏輯最終回退與簡化 (Cursor Logic Revert)**
- 描述：應要求取消小白點動畫，恢復為坍縮中途直接喚回系統游標。
- before:
```javascript
        // 黑洞縮完後：啟動動態跟隨點動畫，掩護游標恢復
        if (isExitAnim) { drawCursorGrow(); return; }
        // ...
        if (isFadingOut && bhGrowth < 0.05 && suctionAlpha < 0.05) {
            isExitAnim    = true;
            exitAnimStart = Date.now();
        }
```
- after:
```javascript
        bhGrowth += (0.01 - bhGrowth) * 0.55;
        if (bhGrowth < 0.5 && document.body.style.cursor === 'none') {
            document.body.style.cursor = '';
        }
        // ...
        if (isFadingOut && bhGrowth < 0.02 && suctionAlpha < 0.02) {
            isBlackHole = false;
            canvas.style.display = 'none';
        }
```

**[優化] 游標恢復邏輯重構 (Cursor Logic Overhaul — Seamless Fix)**
- 優化：重新引入 `isExitAnim` 過渡階段，但將其從小圓點固定座標改為**即時跟隨滑鼠 (`mouseX/Y`)**。
- 修正：徹底解決系統游標恢復時從「左上角 (0,0)」閃跳回來的問題。透過動態跟隨的小白點掩護，讓系統游標在動畫結束瞬間直接於白點位置接手。
- 調整：黑洞坍縮至 5% 以下時自動觸發小白點跟隨動畫，確保轉場邏輯在視覺上完全無縫。

**[修] 強勢向心力、出界粒子清除與兩階段坍縮**
- 修正：實作了你要求的「旋轉吸收至一定程度後，瞬間關閉旋轉力並攤縮進中心」。
- 細節：實裝兩階段物理。**第一階段 (0~65%)**：中心的基礎吸收力 (`baseGravity`) 被調升至 (600)，讓粒子能穩定往中心靠攏並盤旋形成星環。**第二階段 (65%~100%)**：當 65% 的粒子被吸收完畢後，會觸發**「慢動作爆炸收束」**。系統會開始計時並解除旋轉力與 Y 軸壓縮。在前 0.20 秒，粒子會受到極微小的**外推力**（時間縮短、力量再次減弱，營造若有似無的喘息感）；0.20 秒後，向內的吸收力與向心力會隨著時間**指數級放大**，從緩慢吸入瞬間加速到極限狂飆，完美還原史詩級坍縮感。也新增了邊界判定，飛出畫面超過 200px 的粒子將會自動死亡。
- 效果：精準達成「先形成漂亮的旋轉星環」，然後在最後一刻星環「瞬間失去旋轉力，全數被扯入黑洞中心」的史詩感動態。

### [20] page-transition-v4.js — 遮罩邊緣羽化與效能優化

**[優化] 暗色粒子生成剔除（30%）**
- 問題：轉場時會產生大量黑色/極暗色粒子，視覺上與背景融合不明顯，但極大消耗 Rendering 效能導致卡頓。
- 修正：在 `addParticle` 時解析 `color`，計算 RGB 亮度 (`luminance < 40`)。對於暗色粒子，給予 `30%` 的隨機機率直接剔除不生成，大幅降低高對比遮罩後段的無效運算量。

**[修] 遮罩推進速度與邊緣羽化 (Feather) 效果**
- 速度提升：初始掃速從 `5.2` 提升至 `12.0`，二次加速係數從 `72` 提升至 `140`，整體轉場推移速度翻倍。
- 像素化羽化：改良 Frontier 視覺補償區。密度提升 4 倍（`segments * 4`），繪製圖形加入透明度 `globalAlpha = 0.5`，並引入 `±30px` 的 `driftX/Y` 隨機偏移。結合 `Math.floor(size/5)*5` 的強烈方塊鋸齒感，在斜線切割邊緣上疊加出四散的「數位感像素羽化」邊界。

---

## 2026-04-17 (3)

### [19] page-transition-v4.js — 黑洞起始大小調整

**[修] 縮小黑洞初始半徑與放大膨脹倍率**
- 問題：初始黑洞太大。
- 修正：基礎半徑常數從 `26` 降至 `16`。
- 連動：將 `bhGrowth` 的最大倍率從 `1.45×` 提升至 `2.35×`，確保吸飽粒子時的最大體積 (`16 × 2.35 ≈ 37.6`) 與之前相近，讓前後變化幅度更劇烈。退場收縮 `growTarget` 從 `0.6` 降至 `0.4`。

---

## 2026-04-17 (2)

### [18] page-transition-v4.js — 黑洞動態成長 / 游標點擊定位修復

**[新增] 黑洞隨吸收粒子動態成長**
- 新增 `bhGrowth`（成長係數）與 `totalClusters`（黑洞模式啟動時的初始粒子數）。
- `R = 26 × suctionScale × bhGrowth`，成長邏輯：`growTarget = 1.0 + (已吸收/總數) × 0.45`，最大約 1.45 倍，lerp 速率 0.05/幀（平滑增長）。
- `isFadingOut = true` 後：`bhGrowth` 向 0.6 以 0.22/幀 快速收縮，配合 `suctionScale→0` 產生「脹大→急速縮小」的視覺衝擊感。

**[修] 游標不移動時卡在左上角**
- 根本原因：用戶點擊連結時如果沒有先觸發 `mousemove`（如頁面剛載入即點擊），`mouseX/mouseY` 維持初始值 0，黑洞渲染在 (0,0)。
- 修正：在 `transitionToPage(e)` 中，若 `e.clientX > 0` 則立即同步 `mouseX = e.clientX; mouseY = e.clientY`，確保點擊座標優先於 mousemove 歷史值。

---

## 2026-04-17


### [17] page-transition-v4.js — 吸力平衡 / 黑圈移除 / 游標跳回修復

**[改] 吸力重新平衡（恢復螺旋軌道感）**
- 問題：[16] 的 `radialFar = min(3.0, 600/(dist+80))` 在 dist<440 就達到 3.0，加上 Near 總力過強（dist=100 時達 4.46 px/f），粒子被直線吸入失去橢圓旋轉感。
- 修正：`radialFar = min(1.6, 280/(dist+110))`，`radialNear = min(5.5, 9000/(dist²+450))`。dist=100 時總力降至 ~2.1 px/f，足夠捕獲粒子但保留明顯的切線旋轉分量。

**[移除] 黑核圓形漸層（3b 段）**
- 問題：任何半徑的放射漸層在邊緣都會產生可見的圓形邊界，無論多柔和都形成「黑圈」疊加在流光環上。
- 修正：完全刪除 `createRadialGradient` 黑核段。中心黑暗由 canvas `clearRect` 透明 + 頁面深色背景自然呈現，ISCO 橘光由環自身繪製。

**[修] 游標恢復從左上角跳回（根本原因修復）**
- 根本原因：`let mouseX = width / 2 || 0` 宣告於 `resize()` 呼叫之前，此時 `width = undefined`，計算結果 `NaN || 0 = 0`，導致 `mouseX = 0, mouseY = 0`（左上角）。
- 修正一：將 `mouseX` 初始值改為 `0`，在 `resize()` 之後立即補上 `mouseX = width / 2; mouseY = height / 2;`。
- 修正二：新增 `exitCursorX, exitCursorY` 變數，在 `isExitAnim = true` 的瞬間快照 `mouseX, mouseY`，`drawCursorGrow` 固定使用此快照座標，消除動畫期間游標漂移造成的跳閃。

---

## 2026-04-16

### [16] page-transition-v4.js — 黑竹分隔修復 / 吸力強化 / 遮罩加速 / 風力加強


**[修] 黑洞中心黑色夾層消除（3b 黑核漸層）**
- 問題根因：原 `createRadialGradient(0, R×1.08)` 的 stop 0.92 位於 `R×0.994`，alpha=35%。ISCO 環位於 `R×0.97`（= stop 0.898），被 ~45% 黑色覆蓋，形成 ISCO 與光子環之間的深色帶。
- 修正：縮小半徑至 `R×0.86`，僅兩個 stop：0 → 不透明，0.72 → 不透明，1.0 → alpha=0。淡出區僅 `R×0.619` 到 `R×0.86`，完全在 ISCO 內側，不影響任何環。

**[改] 吸力物理強化（雙分量引力）**
- 問題根因：舊公式 `8500/(dist²+400)` 在 dist=100 時只有 0.82 px/frame，遠不及粒子 vx~20px/frame 的初速，大量粒子繞邊或飛出場外死亡。
- 修正：改為 `1/r`（遠場）+ `1/r²`（近場）雙分量：
  - `radialFar = min(3.0, 600/(dist+80))`：dist=200 → 2.1，dist=100 → 3.0（cap），讓高速粒子在遠處就被捕獲。
  - `radialNear = min(8.0, 15000/(dist²+300))`：用於最後螺旋落入。
- 擊殺半徑：35 → **55 px**（放大確保粒子在視覺上進入黑洞中心才消滅）。

**[改] 右向風力加強**
- `speedBase` 最低值：`+1.0` → `+1.5`
- vx 乘數：`6.6 + rnd×6.0` → `8.5 + rnd×7.5`（最大 vx 可達 ~72，原 ~44）
- render loop 中的動態風力：`progress × 4` → `progress × 7`

**[改] 遮罩掃速提升**
- `sweepSpeed = 3.6 + progress² × 54` → `5.2 + progress² × 72`（起始速度 +44%，終點速度 +33%）

---

### [15] page-transition-v4.js — 流光環混色 / 消除線段感 / 黑色透明過渡

**[改] 雙環顏色梯度（不同密度液體流動層次）**
- 外光子環（R×1.20）：改為琥珀金 `(200,120,10)` → 暖白金 `(255,250,70)`，去除原本的藍調白金色。旋轉速度 `t×2.2`（較快，模擬輕密度流體）。
- 內 ISCO 環（R×0.97）：深焦橙 `(180,50,0)` → 橙金 `(245,190,25)`。旋轉速度 `t×1.4`（較慢，模擬重密度等離子體）。
- 效果：由內而外形成連續色溫梯度「深橙→橙金→琥珀→暖白金」，兩層旋轉速差製造密度差異的液體流動質感。

**[改] 消除線段感（`ctx.shadowBlur` + 增加 overlap）**
- 外光子環：`shadowBlur=12`，`shadowColor=rgba(220,145,20,0.55 × α)`，段數 48→72，arc overlap 0.02→0.06。
- 內 ISCO 環：`shadowBlur=10`，`shadowColor=rgba(190,55,0,0.70 × α)`，段數 60→80，overlap 0.02→0.06。
- 原理：shadow glow 溢出至相鄰段的間隙，視覺上形成連續光帶，消除分段線感。

**[改] 黑核透明度過渡（取代硬邊黑盤）**
- 移除原本 `fillStyle='#000000'`、`arc(R×0.88)` 的硬邊黑盤。
- 改為 `createRadialGradient(0, R×1.08)` 四段漸層：中心全不透明黑 → 0.68 仍全黑 → 0.82 降至 82% → 0.92 降至 35% → 邊緣 alpha=0。
- 關鍵：此漸層畫在 ISCO 環之後（Painter's Algorithm），在渲染棧上層自然覆蓋並暗化 ISCO 環的內緣，讓 ISCO 橘光自然溶入黑暗，無任何硬邊界。

> 原因：流光環的視覺目標是「不同密度液體流動」，需要(1)顏色天然銜接，(2)去除數位感的分段線，(3)奇點邊緣像物理上的吸引力場一樣漸進消失而非截斷。

---

## 2026-04-15 (2)

### [14] page-transition-v4.js — 螺旋吸入物理修正 / ISCO 橘金流光環

**[改] 粒子物理：徑向/切線力分離 + 角速度阻尼（防止軌道鎖定）**
- 問題根源：舊程式將切線力（`swirlAmt * 1.8`）與徑向力（`force + suck`）混雜，近場 swirl 過強，加上缺乏切線方向的獨立阻尼，導致粒子在接近奇點時形成穩定圓軌道而非螺旋落入。
- **重構物理模型**：
  - `nx, ny`：徑向單位向量（朝黑洞中心）
  - `tx, ty`：切線單位向量（CCW 正交）
  - 徑向力：`min(5.5, 8500 / (dist² + 400))` — 距離平方反比，主導
  - 切線力：`min(0.5, 100 / (dist + 90))` — 近場快速衰退（dist=30→0.48，dist=200→0.37）
  - **角速度阻尼**：計算當前切線速度分量 `vt = v · t_hat`，每幀移除 15%（`v -= t_hat * vt * 0.15`），主動消耗繞行動能
  - 整體阻尼：`0.86 + dist/1200`（近場摩擦大）
- 效果：粒子會以螺旋路徑確實落入，不再轉圈。遠場仍有氣旋感，近場快速收斂。

**[改] 奇點視覺：ISCO 橘金流光環（UI/UX 設計系統）**
- 設計概念（依 sci-fi dark cinematic 設計原則）：
  - **色彩**：焦橙 `(200,65,0)` → 橙金 `(255,215,60)` → 亮白金 `(255,243,180)` — 模擬極高溫等離子體色溫
  - **層次**：3a 黑盤（R×0.88）→ 3b ISCO 流光環（R×0.97）→ 3c 光子球橘光暈（R×2.2）→ 4 藍白脈衝（原有）
- **3a 奇點黑盤**：半徑縮至 R×0.88，露出 ISCO 環邊緣。
- **3b ISCO 流光環（60段逐段）**：三組 sine 波疊加：
  - `primary`（2.2x/s 繞行）→ 相對論性增亮熱斑
  - `second`（反向，2節點）→ 次級等離子束
  - `flash`（4.5x/s，5節點）→ 高頻金屬質感
  - 線寬動態：`1.8 + intensity × 4.0`（熱點可達線寬 5.8px）
- **3c 橘光暈**：`createRadialGradient` 在 R×2.2 範圍內製造 Schwarzschild 光子球的漫射橘光，強化「逃不掉的流動感」。

> 原因：(1) 物理層面解決「轉圈問題」，採用正確的角動量阻尼模型；(2) 視覺層面以 UI/UX 設計原則（深色電影感、高飽和熱色、動態亮點）重設計奇點外緣。

---

## 2026-04-15

### [13] page-transition-v4.js — 粒子拖尾 / 奇點軟邊 / 游標切換無閃爍

**[改] 粒子拖尾（取代外部線段）**
- 刪除 `drawLightTrails`（外部線段拖尾）。
- 在 `DustCluster.draw()` 中，當 `useSuction = true` 時，以當前速度向量反推 4 個疊層（`-vx * ts * 1.8, -vy * ts * 1.8`），疊層 alpha 依 `1 - ts/5` 衰減（0.32→0.08），粒子大小隨層數線性縮小。
- 效果：拖尾直接長在粒子本身，顏色與原粒子一致，方向感物理正確，不需要外部線段計算。

**[改] 奇點邊緣（玉黑柔和過渡）**
- 原本：`fillStyle = '#000000'` 直接填充硬邊黑圓。
- 現在：`createRadialGradient` 搭配 4 個色停，從純黑（中心）→ 深玉黑 `rgba(8,22,16)` → 半透明翡翠 `rgba(20,48,34)` → 完全透明（邊緣）。
- 圓半徑擴大至 `R*1.12`，微量延伸入光子環底部，製造「環繞深度」的視覺層次。
- `globalAlpha` 保持 1.0，由 gradient 自帶 alpha 控制，消除硬邊。

**[新] 游標切換無閃爍（`drawCursorGrow`）**
- 新增狀態：`isExitAnim`、`exitAnimStart`。
- 新增函式 `drawCursorGrow()`：380ms cubic ease-out 動畫，白色 radialGradient 小點從半徑 0 擴張至 5.5px，橋接系統游標出現前的空白幀。
- 流程：黑洞縮完（`suctionAlpha<0.02 && suctionScale<0.04`）→ 啟動 `isExitAnim` → `renderBlackHole` 轉而呼叫 `drawCursorGrow()` → 動畫播完後才 `canvas.style.display='none'` + 還原系統游標 + 跳轉。
- 解決問題：原本 canvas 直接隱藏 → 系統游標突然出現的閃爍感。

> 原因：三項修改均響應用戶審美要求——拖尾應是粒子自身的殘影而非外部線段；奇點邊緣需有宇宙黑暗的柔和質感；游標切換需要有「物質化」的過渡感。

---

## 2026-04-14

### [12] page-transition-v4.js — 黑洞游標 UI / Event Horizon 光軌拖尾

**移除舊 UI**
- 刪除 `drawSuctionUI`（白色橢圓範圍指示器）。

**新增 `drawBlackHoleCursor`**
- **電暈 (corona)**：以 `createRadialGradient` 繪製橘紅色擴散光暈，半徑約 5.5R。
- **光子環 (photon ring)**：3 層疊加弧線，上半弧（靠近側）為暖色漸層模擬相對論性增亮，下半弧為藍白模擬紅移冷卻；以 `createLinearGradient` 呈現左右色溫差。
- **奇點 (singularity)**：純黑實心圓，半徑 26px × suctionScale。
- **內層脈衝**：`createRadialGradient` 搭配 `Math.sin(t * 3.5)` 產生微弱呼吸感藍白閃爍。

**新增 `drawLightTrails`**
- 對距游標 30–220px 內的所有 cluster 繪製朝向游標的光軌拖尾。
- 亮度與線寬依 `proximity²` 衰減（越近越亮越粗）。
- 顏色從透明→橘黃→暖白漸層，模擬光線被重力拉伸的 spaghettification 效果。
- 在 `renderShatter` 中僅於 `progress > 0.66`（吸入階段啟動後）顯示，避免風力飛散階段出現不符物理的軌跡。
- 在 `renderBlackHole` 中全程顯示。

> 原因：響應用戶需求，以物理正確的黑洞視效（光子環非對稱色溫、電暈、event horizon 光軌）取代原本簡易的白色橢圓指示器，並消除「消失範圍」的明顯視覺標記。

---

## 2026-04-13

### [11] page-transition-v4.js — 改為點擊觸發的退場動畫 (Outgoing)

**page-transition-v4.js — Line 250 & Line 381**
```diff
-        // 當 UI 淡出完全後正式結束
-        if (isFadingOut && suctionAlpha < 0.05) {
-            isBlackHole = false;
-            canvas.style.display = 'none';
-            document.body.style.cursor = '';
-        }

+        // 當 UI 淡出完全後正式結束
+        if (isFadingOut && suctionAlpha < 0.05) {
+            isBlackHole = false;
+            canvas.style.display = 'none';
+            document.body.style.cursor = '';
+            
+            // 執行跳轉
+            if (nextUrl) {
+                window.location.href = nextUrl;
+            }
+        }
```

```diff
-    window.transitionToPage = function(targetUrl, e) {
-        window.location.href = targetUrl;
-    };
-
-    function checkEntrance() {
-        if (snapshotImg && snapshotImg.complete) { ... }
-    }
-    checkEntrance();

+    let nextUrl = null;
+
+    window.transitionToPage = function(targetUrl, e) {
+        // 設定 nextUrl，顯示 canvas 並呼叫 startDisintegration()
+    };
+
+    // 攔截所有同網域的 <a> 連結，綁定退場腳本
+    document.addEventListener('DOMContentLoaded', () => { ... });
```

> 原因：響應用戶需求，取消頁面載入時自動播放的碎裂進場，轉版為由特定按鈕/內部連結觸發的「退場動畫」，黑洞把粒子全部吸完動畫結束後再執行頁面跳轉。

---

### [10] page-transition-v4.js — 粒子縮小 / 即時吸入 / 引力 UI / 像素邊緣

**粒度微調 (Particle Scaling)**
- `pixelStride` 從 4px 降至 3px (縮小 25%，接近用戶要求的 20%)。
- 效果：細節感提升，畫面顯得更為精緻、具備沙塵感。

**物理邏輯重塑 (Suction Synchronization)**
- 重構 `DustCluster.update`：支持即時向心引力運算。
- 在 `renderShatter` (遮罩揭開期間) 即啟動引力，粒子不再等待遮罩完成才開始移動，而是「生而吸入」。
- 簡化物理係數：降低角速度與向心加速度強度，使「螺旋吸入」的動態更易於用肉眼追蹤觀察。

**視覺特效強化 (Visual Feedback)**
- **引力圈圈 (Suction UI)**：在滑鼠位置繪製一個具備呼吸感的圓圈與中心點，強化「引力中心」的互動暗示。
- **像素邊界 (Pixelated Edge)**：在遮罩交界線 (Frontier) 沿線繪製不規則像素塊，將原本平滑的切割邊緣轉化為數位像素化的崩解質感。

> 原因：響應用戶對於「即時互動性」與「視覺細節」的需求，透過簡化物理提升動態的可觀察性，並透過輔助 UI 與像素化邊緣強化風格。

---

### [9] page-transition-v4.js — 靜態遮罩圖片 / 相位修正 / 行星軌道物理

**Lines 38~53 — 移除 Snapshot，改用靜態圖載入**
- 封裝 `initStaticImage`，直接載入 `images/system_page.png` 作為遮罩影像 `snapshotImg`。
- 修改 `checkEntrance` 為輪詢圖片 Ready 狀態後啟動。
- 修改 `transitionToPage` 為純跳轉。

**Line 276 — 噪音相位同步修正**
- 邏輯改為 `score - triggerOffset < currentCutoff`。
- 效果：噪音的正向偏移現在會同向影響粒子與遮罩，解決邊界對不齊的問題。

**Lines 70~76 — 微風吹動 (Breeze Dynamics)**
- 再次調高 `vx` (加強推動) 與 `vy` (隨機垂直氣流感)。

**Lines 170~190 — 行星軌道重塑 (Planetary Orbit)**
- 向心力 `force` 上限調高。
- `swirlAmt` 改用冪次定律 `orbitalSpeedBase / Math.pow(dist + 30, 1.15)`。
- 效果：粒子在接近游標時會呈現「顯著加速旋轉」的開普勒軌道視覺感。

> 原因：(1) 響應用戶需求，使用固定圖片而非即時截圖作為背景。(2) 深度校正噪音相位邏輯，達成完美的粒子/遮罩同步。(3) 物理動態改為角速度增加模式，提升黑洞模式的視覺層次與擬真度。

---

### [8] page-transition-v4.js — 物理參數調優 / 雜訊頻率調降 / 出界機制

**Lines 72~75 — 增強初速**
- 提高 `vx` 與 `vy` 的隨機係數，使粒子產生時具備更強的向右、向上「吹散」動態。

**Lines 111~115 — 新增出界死亡機制**
- 在 `update()` 中加入檢查：若粒子超出畫面邊緣 100px 則 `life = 0`。
- 調降阻尼 `0.99 -> 0.985`，延長初速作用時間。

**Lines 168~170 — 調降黑洞旋渦力**
- `swirlAmt` 最大值由 1.0 調降至 0.35。
- 效果：粒子匯聚路徑更趨於直線與穩定螺旋，減少劇烈打轉。

**Lines 200~206 — 調降 Noise 頻率**
- 空間頻率調降 (如 `0.01 -> 0.005`)，時間頻率調降 (`1.0 -> 0.3`)。
- 效果：遮罩邊緣呈現更巨大、沉穩且緩慢的波動。

> 原因：(1) 根據視覺回饋，提升粒子被吹散的力道感。(2) 出界機制提升效能並導正視覺邏輯。(3) 低頻 Noise 更符合「大氣、電影感」的轉場氛覽。(4) 減弱黑洞漩渦力以提升吸引的物理穩定性。

---

### [7] page-transition-v4.js — 邊界算法統一 / 黑洞向心力修正

**Lines 207~215 — 新增 getFrontierNoise 統一函式**
```javascript
function getFrontierNoise(x, y, time, progress) {
    const noiseBase = Math.sin(x * 0.01 + y * 0.01 + time) * 50;
    const highFreq = Math.cos(x * 0.02 - y * 0.015 + time * 1.5) * 30;
    const jitterScale = (1.0 + progress * 2.0); // 隨進度增加破碎感
    return (noiseBase + highFreq) * jitterScale;
}
```

**Lines 252~282 — 同步粒子觸發與遮罩切割邊緣**
- **粒子循環**：`triggerOffset` 改用 `getFrontierNoise(x, y, ...)`。
- **遮罩路徑**：`noise` 偏移量改用同一 `getFrontierNoise` 函式，並增加 `segments` 至 16 以提升細節。

**Lines 163~180 — 修正黑洞吸收邏輯**
```javascript
if (dist < 8) {
    c.life = 0; // 碰到中心後消失 (修正半徑 25px -> 8px)
} else {
    // 強力向心引力 + 吸引加速度
    const force = Math.min(1.2, 2000 / (dist * dist + 500));
    c.vx += (dx / dist) * force;
    c.vy += (dy / dist) * force;
}
```

> 原因：(1) 解決粒子產生邊界與遮罩切割線不對齊的問題。(2) 導正黑洞吸引路徑，確保粒子是「吸入游標中心」而非在周圍盤旋，並精確在中心點消失。

---

## 2026-04-06

---

### [6] page-transition-v4.js — 遮罩方向修正 / 黑洞邏輯改用 clusters / 粒子減速

**Lines 72~78 — 降低 DustCluster 速度、延長壽命**
```diff
- const speedBase = Math.random() * 18 + 5;
- this.vx = speedBase * 1.5;
- this.vy = -(speedBase * 0.9);
- this.life = Math.random() * 120 + ...;
+ const speedBase = Math.random() * 2.0 + 0.5; // 輕盈漂移
+ this.vx = speedBase * 1.5;
+ this.vy = -(speedBase * 0.4 + Math.random() * 0.3);
+ this.life = 400 + Math.random() * 200; // 6–10 秒壽命
```

**Lines 95~100 — 縮小 per-particle noise**
```diff
- nvx: (Math.random() - 0.5) * 3.5,
- nvy: (Math.random() - 0.5) * 2.5,
- speedMult: 0.4 + Math.random() * 1.2,
+ nvx: (Math.random() - 0.5) * 1.5,
+ nvy: (Math.random() - 0.5) * 1.0,
+ speedMult: 0.2 + Math.random() * 0.5,
```

**Lines 128~192 — 移除 DustMote 類，改為吸收 clusters**
```diff
- class DustMote { ... }          // 刪除
- startBlackHoleMode() { spawn 70 DustMotes ... }
+ startBlackHoleMode() {
+     if (clusters.length === 0) { canvas.style.display = 'none'; return; }
+     // 直接進入 renderBlackHole loop
+ }
+ renderBlackHole() {
+     // 對每個 cluster 施加引力，距游標 < 20px 時 c.life = 0
+     // 傳入 width * 10 給 draw() 停用右側淡出
+     // 所有 cluster 死亡後還原游標、隱藏 canvas
+ }
```

**Line 254 — 降低右推加速**
```diff
- cluster.vx += progress * 10;
+ cluster.vx += progress * 2;
```

**Lines 259~271 — 遮罩方向修正（左下→右上）**
```diff
- ctx.moveTo(k, 0);
- const segmentX = k + segmentY;
+ ctx.moveTo(k - height, 0);  // 對角線 x = (k-height) + y
+ const segmentX = (k - height) + segmentY;
```

> 原因：(1) 遮罩掃描方向改為與粒子觸發前緣一致（左下→右上），視覺更連貫。(2) 黑洞模式改用轉場本身產生的 clusters（而非額外生成粒子），邏輯更正確，粒子顏色和風格也與前一頁一致。(3) 降低整體速度、延長壽命，確保遮罩完成時粒子仍在畫面中供游標吸收。

---



**Lines 31~36 — 新增狀態變數**
```diff
+ let maskStartTime = null;      // 遮罩延遲計時
+ const MASK_DELAY_MS = 250;     // 遮罩與粒子同步延遲（ms）
+ let isBlackHole = false;       // 黑洞模式旗標
+ let mouseX = 0, mouseY = 0;
+ let dustMotes = [];            // 黑洞模式浮游粒子
```

**Line 59 — 加入滑鼠位置追蹤**
```diff
+ window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
```

**Lines 127~190 — 新增 DustMote 類、startBlackHoleMode、renderBlackHole**
```diff
+ class DustMote {
+     constructor() { /* 隨機位置、速度、顏色 */ }
+     update(mx, my) { /* 向游標施加引力，距離 < 18px 時標記死亡 */ }
+     draw(ctx) { /* 半透明方形粒子 */ }
+ }
+ function startBlackHoleMode() {
+     isBlackHole = true;
+     document.body.style.cursor = 'none'; // 隱藏游標
+     // 生成 70 顆 DustMote 並啟動 renderBlackHole loop
+ }
+ function renderBlackHole() {
+     // 每幀更新所有 DustMote，全部被吸收後結束並還原游標
+ }
```

**Line 141 — startDisintegration 重置延遲計時器**
```diff
+ maskStartTime = null;
```

**Lines 150~165 — renderShatter 加入 250ms 延遲邏輯**
```diff
+ if (maskStartTime === null) maskStartTime = now;
+ if (elapsed < MASK_DELAY_MS) {
+     if (snapshotImg) ctx.drawImage(snapshotImg, 0, 0, width, height);
+     return; // 延遲期間靜止不動
+ }
```

**Lines 219~221 — renderShatter 結束時改為啟動黑洞模式**
```diff
- canvas.style.display = 'none';
+ startBlackHoleMode();
```

> 原因：(1) 250ms 延遲讓截圖有一瞬間靜止感，視覺上更像「凍結後碎裂」。(2) 黑洞模式在轉場結束後接手 canvas，用引力場吸收殘留塵埃，為後續加入黑洞視覺外觀預留接口。游標在黑洞模式期間隱藏，粒子全部被吸收後自動還原。

---

### [4] page-transition-v4.js — 遮罩改用前一頁截圖（移除純黑）

**Line 27 — 新增 snapshotImg 變數**
```diff
- let currentCutoff = 0;
+ let currentCutoff = 0;
+ let snapshotImg = null; // 前一頁截圖
```

**Line 202~205 — 遮罩填色改為繪製截圖**
```diff
- ctx.fillStyle = '#050508';
- ctx.fillRect(-width, -height, width * 3, height * 3);
+ if (snapshotImg) {
+     ctx.drawImage(snapshotImg, 0, 0, width, height);
+ } else {
+     ctx.fillStyle = '#050508';
+     ctx.fillRect(-width, -height, width * 3, height * 3);
+ }
```

**Line 224 — transitionToPage 截圖 scale 提升並儲存圖片**
```diff
- scale: 0.1  // 只用於取色
+ scale: 0.5  // 同時取色 + 截圖
+ sessionStorage.setItem('pt_snapshot', capturedCanvas.toDataURL('image/jpeg', 0.75));
```

**Line 234~243 — checkEntrance 讀取截圖後啟動動畫**
```diff
- ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, width, height);
- startDisintegration();
+ if (storedSnapshot) {
+     snapshotImg = new Image();
+     snapshotImg.onload = () => {
+         ctx.drawImage(snapshotImg, 0, 0, width, height);
+         startDisintegration();
+     };
+     snapshotImg.src = storedSnapshot;
+ } else {
+     ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, width, height);
+     startDisintegration();
+ }
```

> 原因：進場動畫開始時，遮罩顯示的是前一頁的完整截圖，掃開過程中截圖逐漸被新頁面取代，視覺更連貫。無截圖時 fallback 至純黑，不會 crash。

---

**Line 30 後 — 新增從 `images/system_page.png` 取色的 IIFE**
```diff
+ // 從 system_page.png 取色作為粒子預設 palette
+ (function loadPaletteFromImage() {
+     const img = new Image();
+     img.crossOrigin = 'anonymous';
+     img.onload = function() {
+         const c = document.createElement('canvas');
+         c.width = img.width; c.height = img.height;
+         const pCtx = c.getContext('2d');
+         pCtx.drawImage(img, 0, 0);
+         const data = pCtx.getImageData(0, 0, c.width, c.height).data;
+         const colors = [];
+         for (let i = 0; i < data.length; i += 48) {
+             if (data[i+3] > 120) colors.push(`rgb(${data[i]},${data[i+1]},${data[i+2]})`);
+         }
+         if (colors.length > 10) palette = colors;
+     };
+     img.src = 'images/system_page.png';
+ })();
```

**Line 65 — addParticle 加入 per-particle noise**
```diff
- addParticle(dx, dy, color, id) { this.particles.push({ dx, dy, color, id }); }
+ addParticle(dx, dy, color, id) {
+     this.particles.push({
+         dx, dy, color, id,
+         nvx: (Math.random() - 0.5) * 3.5,   // group 內 x 漂移速度
+         nvy: (Math.random() - 0.5) * 2.5,   // group 內 y 漂移速度
+         speedMult: 0.4 + Math.random() * 1.2, // 快慢差
+         lx: 0, ly: 0                          // 累積位移
+     });
+ }
```

**Line 84 — draw 改為累加 per-particle 位移**
```diff
- ctx.fillRect(this.x + p.dx, this.y + p.dy + Math.sin(time + p.id) * 1.5, pixelStride, pixelStride);
+ p.lx += p.nvx * p.speedMult;
+ p.ly += p.nvy * p.speedMult;
+ ctx.fillRect(this.x + p.dx + p.lx, this.y + p.dy + p.ly + Math.sin(time + p.id) * 1.5, pixelStride, pixelStride);
```

**Line 118 — 遮罩速度改為 quadratic ease-in**
```diff
- currentCutoff += 18; // Slow cinematic sweep
+ const progress = Math.min(1.0, currentCutoff / (width + height + 500));
+ const sweepSpeed = 3 + progress * progress * 45; // ~3 → ~48
+ currentCutoff += sweepSpeed;
```

> 原因：(1) 讓粒子顏色與頁面截圖一致，視覺連貫性更強。(2) ease-in 讓開場有電影感的緩慢啟動，後段加速完整。(3) per-particle noise 打破 group 整齊感，粒子像真實碎裂散開而非整塊移動。

---

### [1] glass_test.html + games.html — 切換 Page Transition 引擎至 V4

**glass_test.html — Line 70**
```diff
- <script src="page-transition-v5.js"></script>
+ <script src="page-transition-v4.js"></script>
```

**games.html — Line 11**
```diff
- <script src="page-transition-v5.js"></script>
+ <script src="page-transition-v4.js"></script>
```

> V4 行為：點擊後立即跳轉，目標頁面進場時執行 Abstract Soul Dust 碎裂展開動畫。

---

### [2] glass_test.html — 關閉 Dispersion（效能優化）

**Line 116 — params 預設值**
```diff
- dispersion: 1.0, // Prism chromatic aberration
+ dispersion: 0.0, // Prism chromatic aberration (disabled for performance)
```

**Line 294~296 — MeshPhysicalMaterial 初始化**
```diff
- dispersion: params.dispersion, thickness: params.thickness, roughness: params.roughness,
+ dispersion: 0, thickness: params.thickness, roughness: params.roughness,
```

> 原因：dispersion 在 Three.js 中觸發額外 chromatic aberration shader pass，GPU 負擔高，為頁面卡頓主因之一。

---
