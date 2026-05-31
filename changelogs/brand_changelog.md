# AEVUM STUDIO — Brand Page Changelog

專門記錄 `brand.html` 及其直接相依資源（如 `galaxy.js`）的所有異動。
格式：異動檔案、行號、完整 diff、修改原因。

---

## 2026-05-01

### [v3.6.1] brand.html — 異步擺動系統與深度排序優化

**修改檔案：brand.html**

```diff
+ 實作 wobbel-left / wobble-right / wobble-center 三種獨立擺動動畫
+ side-system-l: 18s 週期, 角度 ±8deg
+ side-system-r: 22s 週期, 角度 ±10deg
+ atom-system (中心): 30s 週期, 角度 ±4deg（極小幅度增加質感）
+ 修改 initPlanetSync():
+   - 支援同時 Clone 中心與兩側 side-stars 進 2D Overlay
+   - 新增 getNearestStarY() 邏輯，行星會自動找尋最近的恆星進行深度判定
```

**修改原因：**
1. 解決星軌旋轉到正側面會「消失」的視覺問題，改用 Premium 的擺動（Wobble）取代 360 度旋轉。
2. 透過異步頻率（Asynchronous frequency）消除三系統同步擺動的機械感，讓動態更自然。
3. 修復 CSS Stacking Context 隔離問題，確保三系統的行星都能正確在恆星前後穿梭（Occlusion）。

### [v3.6.2] brand.html — 光軌視覺強化與層次關係修復

**修改檔案：brand.html**

```diff
+ 軌道寬度固定為 2.5px，並增加內外發光（box-shadow: inset & outer）
+ 中央軌道恢復虛線感（border-style: dashed）
+ 左右星系各新增 2 條「空軌道」（Empty Orbits），傾斜角度更大（82-85deg）
+ 深度排序層次修復：
+   - 恢復原本穩定的 2D Overlay 同步邏輯（恆星與行星皆在 z-index: 5 的疊加層內運算）
+   - 將 3D 軌道系統限制在底層，確保「光軌永遠是在相對圓形的下面一層」
+   - 移除會導致行星 Z 軸判斷錯誤的 3D Billboard 效果，還原物理正確的前後穿梭順序
```

**修改原因：**
1. 提升光軌視覺細節，2.5px 配合雙層發光更具科技感。
2. 滿足使用者對中央虛線感的要求，並增加空軌道讓整體空間感更豐富。
3. 前一版本嘗試將恆星移回 3D 場景與軌道混合排序，導致 2D 疊加層的行星穿梭順序出現判定錯誤。現已退回最穩定的原始架構，確保行星能正確在恆星前後穿梭，且軌道固定襯底。

---



## 2026-04-23

### [2] galaxy.js — 新增 Galaxy WebGL 星場背景

**[功能新增] 移植 reactbits.dev Galaxy 元件為 Vanilla JS**

**galaxy.js — 全新建立**

```diff
+ 建立 galaxy.js（純 Vanilla WebGL 實作）
+ 對外暴露 initGalaxy(container, options) 函式
+ 使用 GLSL Fragment Shader 渲染動態星場：
+   - starField() 體積星場演算
+   - mouseRepulsion 滑鼠排斥力
+   - autoCenterRepulsion 自動中心排斥
+   - hueShift / saturation / glowIntensity / twinkleIntensity 視覺調控
+ 回傳 { destroy } 供清理 WebGL context 與事件監聽
```

> 原因：此專案為純 HTML/JS 架構，無法直接使用 React 版本的 Galaxy 元件。故以原生 WebGL API 移植，完整還原所有 props 對應功能，並避免引入 React、OGL 等額外依賴。

**brand.html — Line 175-180 & 444-446**

```diff
- <div class="absolute inset-0 z-0">
-     <div class="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10"></div>
-     <div class="w-full h-full bg-surface-dim opacity-40">
-         <img alt="Cinematic abstract 3D render" class="w-full h-full object-cover grayscale brightness-50" src="https://..."/>
-     </div>
- </div>
+ <!-- Galaxy WebGL Background -->
+ <div id="galaxy-hero-bg" class="absolute inset-0 z-0" style="overflow:hidden;"></div>
+ <!-- Gradient overlay on top of galaxy -->
+ <div class="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background z-[1] pointer-events-none"></div>
```

```diff
+ <script src="galaxy.js"></script>
+ <script>
+     (function () {
+         var container = document.getElementById('galaxy-hero-bg');
+         if (container && typeof initGalaxy === 'function') {
+             initGalaxy(container, {
+                 mouseRepulsion:      true,
+                 mouseInteraction:    true,
+                 density:             1,
+                 glowIntensity:       0.3,
+                 saturation:          0,
+                 hueShift:            140,
+                 twinkleIntensity:    0.3,
+                 rotationSpeed:       0.1,
+                 repulsionStrength:   2,
+                 autoCenterRepulsion: 0,
+                 starSpeed:           0.5,
+                 speed:               1,
+                 transparent:         false,
+             });
+         }
+     })();
+ </script>
```

> 原因：依使用者需求，以互動式 WebGL 星場取代 Hero 區塊的靜態外部圖片。`saturation: 0` 保持灰階星點、`hueShift: 140` 讓色相偏向青綠，與整體 Cyber 主題一致。漸層 overlay 從 `background/80` 微調為 `background/60` 以讓星場透出更多細節。

---

### [1] brand.html — 初始架構重建

**[結構重組] 以 code.html 內容替換舊版主體，保留 header / footer**

**brand.html — 全頁重構**

```diff
- 舊版 brand.html 主體內容（原有的 main 區塊）
+ <head>：引入 Tailwind CSS CDN、Space Grotesk、Material Symbols
+ <head>：加入 tailwind.config（自訂 colors、fontFamily、borderRadius）
+ <head>：加入 .glass-panel、.hud-corner、.neural-line 等輔助 CSS class
+ <body>：保留原有 header（glass-nav）、footer（site-footer）
+ <body>：main 替換為 code.html 的三大區塊：
+   - Hero Section（全屏標題 "SCULPTING TIME."）
+   - Manifesto + Architect Profile（玻璃面板 + HUD 裝飾）
+   - Neural Schematic（星圖互聯生態系視覺）
+   - CTA Section（"Let's Build the Future."）
```

> 原因：依使用者需求，以更高擬真度的 Cyber/HUD 風格介面取代原有的 brand.html 主體內容，同時維持網站整體的 header / footer 一致性。

**brand.html — Line 173-192（移除 aside 側邊欄）**

```diff
- <aside class="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-40 bg-transparent">
-     <div class="flex flex-col items-center gap-1 mb-4">
-         <span ...>COORD: 40.7128° N</span>
-         <span ...>VER: 2.0.4-CHRONOS</span>
-     </div>
-     <div class="flex flex-col gap-8">
-         <!-- 4 social icon links -->
-     </div>
- </aside>
```

> 原因：使用者決定不保留左側固定側邊欄，版面改為直接由 main 開始。

**brand.html — 移除轉場引擎**

```diff
- <script src="page-transition-v4.js"></script>
- <script src="page-enter-vfx.js"></script>
- <body class="... page-animating ...">
+ <body class="brand-page cyber-theme">
```

> 原因：BRAND 頁面目前不啟用黑洞轉場引擎，使用原生瀏覽器跳轉，避免轉場特效干擾頁面載入體驗。

---
