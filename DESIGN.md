# Aevum Studio Design System (DESIGN.md)

這份文件記錄了目前網站所使用的核心設計語彙、色彩計畫、字體排版、以及前端元件的風格指南。透過這份設計規範，我們能確保在後續的頁面開發（如 Brand、Project 頁面）中，維持高度一致的視覺品質與品牌調性。

---

## 1. 核心設計理念 (Design Philosophy)

- **科技與未來的交織 (Sci-Fi & Futuristic)**：以深邃的宇宙黑為基底，搭配高飽和度的霓虹點綴色（Cyan, Magenta），營造出強烈的賽博龐克與未來科技感。
- **玻璃擬態 (Glassmorphism)**：大量運用極低透明度的白色背景與背景模糊（Blur）效果，創造出穿透感與空間層次，使介面看起來像漂浮在 3D 空間中的全息投影。
- **微動態與生命力 (Micro-interactions)**：避免死板的靜態呈現，透過自訂游標（Custom Cursor）、發光呼吸效果（Glow Pulse）、以及平滑的貝茲曲線轉場（Cubic-bezier），讓網頁充滿生命力。
- **效能優先 (Performance-First)**：視覺華麗但必須建構在極限優化的基礎上（全站 WebP 化、懶加載機制、精簡的 DOM 結構）。

---

## 2. 色彩計畫 (Color Palette)

### 基礎背景色 (Base)
- **Primary Background**: `--bg: #08080a;` (深空黑)
- **Secondary Background**: `--bg-alt: #0c0c10;` (次級黑，用於區塊差異化)

### 品牌點綴色 (Accents)
- **Cyan (主視覺亮點)**: `--accent-1: #00f3ff;` (用於主要的霓虹發光、按鈕 Hover)
- **Magenta (副視覺亮點)**: `--accent-2: #ff0055;` (用於警告、強調或次要互動)
- **Purple (神祕感點綴)**: `--accent-3: #7000ff;` (用於漸層或環境反光)
- **Gold (典雅與高級感)**: `--gold: #d4af37;` (用於特殊榮譽或精裝元件)

### 文字顏色 (Typography Colors)
- **Primary Text**: `--text-1: #ffffff;` (純白，用於標題與主要內文)
- **Secondary Text**: `--text-2: #b0b0cc;` (淡藍灰，用於副標題與說明文字)
- **Muted Text**: `--text-3: #666680;` (深灰，用於註解或次要資訊)

### 發光與特效色 (Glow & Effects)
- **Cyan Glow**: `--cyan-glow: rgba(0, 243, 255, 0.5);`
- **Magenta Glow**: `--magenta-glow: rgba(255, 0, 85, 0.5);`
- **Glass Surface**: `--surface: rgba(255, 255, 255, 0.02);` 至 `--surface-2: rgba(255, 255, 255, 0.05);`

---

## 3. 字體排版 (Typography)

全站採用動態且具未來感的字體配對：

- **標題字體 (Display)**: `Orbitron, sans-serif`
  - *特性*：帶有強烈科技感與幾何切角的非襯線字體。
  - *應用*：用於所有 `<h1>` ~ `<h4>` 標題、重點數據展示。
  - *樣式*：預設強制大寫（`text-transform: uppercase`），並帶有較寬的字距（`letter-spacing: 2px`）。

- **內文字體 (Body)**: `Inter, sans-serif`
  - *特性*：目前網頁設計中最具高可讀性且無襯線的現代字體。
  - *應用*：用於段落文字 `<p>`、導覽列項目、按鈕文字。

- **數據/程式碼字體 (Monospace)**: `JetBrains Mono, monospace`
  - *特性*：等寬字體，適合呈現數據與介面面板。
  - *應用*：用於 3D 實驗室中的數據面板、載入進度條百分比。

- **特殊藝術字體 (Custom)**: `Anson`
  - *特性*：客製化載入的字體。

---

## 4. UI 元件與特效設計 (UI Components & Effects)

### 4.1 玻璃面板 (Glass Panels)
- **背景**: `--glass-bg: rgba(255, 255, 255, 0.03);`
- **模糊度**: `backdrop-filter: var(--glass-blur);` (blur: 12px)
- **邊框**: 採用極細的 1px 半透明邊框 `--border: rgba(255, 255, 255, 0.06);`，在 Hover 時會轉變為發光邊框 `--border-glow`。
- **圓角**: `--radius-md: 8px;` 或 `--radius-lg: 16px;`

### 4.2 環境噪點 (Ambient Noise)
- 在背景層上鋪設一層 `noise-overlay`，為純粹的漸層或深色背景增加底片般的顆粒質感，使畫面看起來不像是冰冷的向量圖形，而是具有實體溫度的數位空間。

### 4.3 轉場與動畫曲線 (Animation Easing)
為了達到專業且流暢的微動態體驗，拋棄瀏覽器預設的 `ease`，全站統一使用自訂的貝茲曲線：
- **Pro Ease (專業滑動)**: `cubic-bezier(0.76, 0, 0.24, 1)` (用於頁面切換、大區塊進場)
- **Bounce (彈性回饋)**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (用於 Hover 放大、按鈕點擊)
- **Smooth (平滑過渡)**: `cubic-bezier(0.4, 0, 0.2, 1)` (用於顏色漸變、透明度淡入)

### 4.4 滑鼠游標 (Custom Cursor)
- 隱藏系統預設游標 (`cursor: none`)，使用自訂的跟隨圓點。
- 當游標懸停在可點擊元素（標籤、按鈕、連結）時，自訂游標會觸發磁吸或放大效果（Hover State）。

---

## 5. 亮/暗模式 (Theme Switching)

系統預設為 **Dark Mode**。但對於如 `3d_lab` 等需要展示不同材質氛圍的頁面，支援 `data-theme="light"` 切換：
- **Dark Mode**: 背景為深空黑 + 賽博點綴，適合展現霓虹、發光材質（如 Hologram, Jelly）。
- **Light Mode**: 背景切換為純淨的白底空間（透過 WebP 背景），並消除過度強烈的發光濾鏡，適合展示寫實材質（如 Wood, Rock Moss）。

---

## 6. 後續開發準則

1. **避免寫死顏色**: 任何新增加的元素，顏色皆須使用 `var(--bg)`、`var(--accent-1)` 等 CSS 變數，以確保未來更改主題時能一鍵替換。
2. **遵守 Z-Index 階層**:
   - `z-index: 10000`: Noise Overlay / 自訂游標
   - `z-index: 9999`: 導覽列 (Navbar) / 載入畫面 (Loading Screen)
   - `z-index: 10~100`: UI 面板 / 對話框
   - `z-index: 0~2`: 背景圖片 / WebGL Canvas / 背景影片
3. **效能守則**: 圖片一律優先採用 WebP，對重量級資源（影片、HDR）實施延遲載入或載入排序。
