# LOGO Lab 自動分支分配

本文件依照最新 Brief，將 3D LOGO 展示網站拆成可並行推進的工作分支。命名使用 `codex/` 前綴，方便後續建立實際 Git branch、PR 或交付任務。

## 分支總覽

| 分支 | 優先級 | 主要目標 | 建議負責範圍 |
| --- | --- | --- | --- |
| `codex/logo-lab-hero-scene` | P0 | 完成首屏 3D LOGO 展示、Gallery / Observatory 切換 | `index.html`, `style.css`, `3d-viewer.js` |
| `codex/logo-lab-brand-sections` | P0 | 補齊 Section 2-6 的品牌理念、服務作品、視覺系統、互動展示、CTA | `index.html`, `style.css`, 可新增少量資料區塊 |
| `codex/logo-lab-interactions` | P1 | 完成低負擔動效與互動細節 | `main.js`, `3d-viewer.js`, `style.css` |
| `codex/logo-lab-performance` | P1 | 控制渲染成本、資源大小與手機降級 | `3d-viewer.js`, 模型/貼圖資產, 載入策略 |
| `codex/logo-lab-responsive-a11y` | P1 | 桌機/手機版面、文字可讀性、按鈕狀態與基本可用性 | `index.html`, `style.css` |
| `codex/logo-lab-qa-delivery` | P2 | 驗收、測試清單、交付文件與最後整理 | 測試紀錄、交付清單、README/任務文件 |

## 依賴順序

1. `codex/logo-lab-hero-scene`
2. `codex/logo-lab-brand-sections`
3. `codex/logo-lab-interactions`
4. `codex/logo-lab-performance`
5. `codex/logo-lab-responsive-a11y`
6. `codex/logo-lab-qa-delivery`

`hero-scene` 是主幹基礎，其他分支可在它完成後並行。`performance` 與 `responsive-a11y` 可以交叉驗證，但不要同時大改同一段 CSS media query。

## 分支細節

### 1. `codex/logo-lab-hero-scene`

**目標**

建立首頁核心畫面：中央黑色 3D LOGO、圓形展示台、假玻璃罩、背景格狀牆、右側星空窗景、淡青色光條，以及 `Gallery / Observatory` Theme Switcher。

**必做**

- 使用 `3D modeling/3D_Lab_LOGO.glb` 作為唯一主要 3D 模型。
- Light / Dark 切換不可重新載入 GLB。
- 場景只用簡單幾何、CSS 背景、假光影與少量即時燈光。
- 保留原網站 HUD、導覽、字體、cyan accent 與 CTA 語言。

**不可做**

- 不做即時 GI。
- 不做真實玻璃折射。
- 不做 SSR / DOF / Motion Blur。
- 不重建高精度參考圖場景。

**驗收**

- 首屏清楚看到 3D LOGO。
- Gallery Mode 接近白色展間參考圖。
- Observatory Mode 接近深色觀測室參考圖。
- Switcher 平滑切換，GLB 不重新載入。

### 2. `codex/logo-lab-brand-sections`

**目標**

補齊 Hero 之後的完整頁面敘事，讓網站不只是一個 3D demo，而是完整品牌展示頁。

**Section 2：品牌理念**

- 玻璃卡片。
- 短文。
- 關鍵字標籤。
- 低調 3D 或 pseudo-3D 背景。

**Section 3：服務或作品**

- 保留原網站卡片排版。
- 加入微玻璃感。
- hover 使用 cyan accent。

**Section 4：視覺系統**

- LOGO 應用。
- 色彩。
- 材質。
- 字體。
- 品牌規則。

**Section 5：互動展示**

- LOGO 旋轉說明或嵌入展示。
- 材質切換可選。
- Gallery / Observatory 模式展示。

**Section 6：CTA**

- 回到中央 LOGO。
- 簡短行動呼籲。
- 聯絡按鈕。
- 星空或光條背景。

**驗收**

- 每個 Section 都像原網站延伸，而不是新風格斷裂。
- UI 不遮擋主要 3D 視覺。
- 文字清楚、層級乾淨。

### 3. `codex/logo-lab-interactions`

**目標**

增加即時 3D 的互動感，但保持效能輕量。

**必做互動**

- LOGO 隨滑鼠微旋轉。
- LOGO 緩慢 idle rotation。
- Theme Switcher 平滑切換。
- CTA hover 光感。
- UI 卡片 hover 輕微浮起。

**可選互動**

- 滾動時 LOGO 視角微變。
- 星空窗節點作為導航。
- 玻璃罩透明度隨模式變化。
- 底座光環在 Dark Mode 中脈動。

**不建議**

- LOGO 高速旋轉。
- 大量粒子爆炸。
- 物理碰撞。
- 過重頁面轉場。
- 全螢幕 blur。
- Motion Blur。

**驗收**

- 動效是加分，不喧賓奪主。
- 滑鼠互動細微、穩定、不暈眩。
- 手機可正常降級。

### 4. `codex/logo-lab-performance`

**目標**

讓一般筆電與手機都能順暢瀏覽。

**效能目標**

- 一般筆電：45-60 FPS。
- 一般手機：30 FPS 以上。
- 首屏載入：3-8 秒內。
- 總資源大小：5-15 MB 內為佳。

**模型優化**

- GLB 壓縮：Draco 或 Meshopt。
- 移除無用 mesh。
- 減少材質數量。
- 控制貼圖尺寸。

**渲染優化**

- renderer pixelRatio 限制在 1-1.5。
- 陰影解析度 512-1024。
- 只讓 LOGO 與展台投影。
- 不全場景開 shadow。

**場景優化**

- 背景用簡單幾何。
- 星空用貼圖或 CSS。
- 格子牆用貼圖或合併 mesh。
- 光條用 emissive / CSS glow，不用真正照明。

**後製策略**

- 可用低強度 Bloom 或簡單色彩校正。
- 避免 SSR、DOF、Motion Blur、Volumetric Light、高強度 Bloom、多重後製 Pass。

**驗收**

- 切換模式不卡頓。
- 手機降 pixelRatio。
- 每幀只更新必要物件。

### 5. `codex/logo-lab-responsive-a11y`

**目標**

確保不同設備上的版面、可讀性與操作狀態正常。

**測試尺寸**

- 桌機寬版。
- 筆電。
- 平板。
- 手機直式。
- 手機橫式。

**必做**

- Switcher 在手機不可壓縮到難以點擊。
- Hero 標題不可遮住 LOGO。
- 卡片文字不可溢出。
- CTA 有 hover / focus 狀態。
- 減少手機上的背景複雜度。

**驗收**

- UI 不重疊。
- 字體大小與容器匹配。
- 手機不明顯卡頓。

### 6. `codex/logo-lab-qa-delivery`

**目標**

完成測試與交付文件。

**測試項目**

- 桌機 Chrome。
- 桌機 Safari。
- 筆電。
- 手機 Safari。
- 手機 Chrome。
- Light / Dark 切換。
- 首屏載入時間。
- 互動流暢度。
- 文字可讀性。
- 低效能設備降級。

**最終交付內容**

- 3D Hero Scene。
- Light / Dark Theme System。
- Theme Switcher。
- UI Components。
- Responsive Layout。
- Performance Optimization。
- Loading Screen。
- Final Build。

**驗收標準**

- 看起來仍像原本品牌網站。
- 首屏有明確 3D LOGO 展示。
- Light Mode 接近白色展間。
- Dark Mode 接近深色觀測室。
- Theme Switcher 平滑切換。
- LOGO 不重新載入。
- 一般筆電可順暢操作。
- 手機不明顯卡頓。
- UI 不遮擋主要 3D 視覺。
- 整體文字清楚可讀。

## 建議合併策略

1. 先合併 `codex/logo-lab-hero-scene`，固定主視覺與 GLB 載入方式。
2. 再合併 `codex/logo-lab-brand-sections`，補完整頁內容。
3. `codex/logo-lab-interactions` 與 `codex/logo-lab-performance` 做互相回歸測試。
4. `codex/logo-lab-responsive-a11y` 最後整理斷點與可讀性。
5. `codex/logo-lab-qa-delivery` 收尾，產出驗收紀錄與交付清單。

## 目前狀態對應

目前已先完成 `codex/logo-lab-hero-scene` 的核心雛形：

- 首屏已改為 3D LOGO 展示區。
- `Gallery / Observatory` Switcher 已建立。
- GLB 路徑已指向 `3D modeling/3D_Lab_LOGO.glb`。
- 模式切換只更新材質、燈光與 CSS 狀態。
- 已避免即時 GI、真實折射、SSR、DOF、Motion Blur 與大量粒子。

