# 🛠️ AINA VISUALS: Index.html 製作全紀錄
## —— 從 Stitch 模板到「鬼影同步」系統的技術長征

這份紀錄旨在分享我如何與 AI（Antigravity）協作，一步步將一個簡單的網頁模板轉化為具備「精密科技感」的高端 3D VFX 作品集。這不是一蹴可幾的過程，中間充滿了技術妥協與突破。

---

## 阶段一：起源與架構轉向 (v3.0.0)
### 1. 從 Stitch 啟動
最初我利用 **StitchMCP** 生成了一個具備 Cyberpunk 風格的基礎模板。雖然 Stitch 給出了很棒的視覺開端，但身為 3D Artist，我對動態效能有極高的要求。

### 2. 核心技術抉擇
我們做了一個大膽的決定：**將 WebGL Galaxy 引擎從 React 移植到 Vanilla JS**。
*   **為什麼？** 為了減少框架帶來的額外負擔（Overhead），讓星系背景在 60fps 下流暢運行。
*   **遇到的困難**：在純 JS 中手動處理 DOM 狀態與 Canvas 的同步比想像中繁瑣，這部分我們重新梳理了 `galaxy.js` 的事件監聽器。

---

## 阶段二：HUD 系統與視覺微調 (v3.1.0 - v3.4.0)
在這個階段，我們開始在畫面上「堆疊」細節。這也是最考驗耐心的地方，因為每一個像素的偏移都會影響「精密感」。

### 1. 挑戰：Cinematic Snap Scroll (電影級滾動捕捉)
*   **卡住的地方**：我們實作了自動跳轉到 About 區塊的功能，但因為 Header 的高度，內容總是會被遮住一部分。
*   **反覆修改**：我們從偏移 60px 調整到 120px，並引入了 `scroll-snap-type` 的 CSS 屬性，反覆測試了不下十次才達到理想的「彈性跳轉感」。

### 2. 亮點實作：安全掃描 HUD 與資料夾卡片
*   引入了自定義游標（Gravitational Lens），利用 `backdrop-filter` 創造出扭曲空間的效果。
*   實作了「Arsenal Accordion」，這是一個模擬檔案夾開啟的組件。

---

## 阶段三：終極挑戰 —— CSS 3D 虛擬導航系統 (v3.5.0 - v3.6.0)
這是 index.html 最核心的部分，也是我們卡最久、修改最多次的地方。

### 1. 遇到的死胡同：Spline 3D 的局限
最初想用 Spline 3D 嵌入，但發現無法與 HTML 元素深度整合（比如文字搜尋或即時數據交互），且載入過重。

### 2. 解決方案：純 CSS 3D 實作
我們決定用 `transform-style: preserve-3d` 手刻星系。
*   **致命問題**：在 CSS 3D 旋轉下，原本是圓形的行星會因為透視變形（Perspective Squashing）被壓成橢圓，且軌道線在高角度下會「消失」。

### 3. 技術突破：「鬼影同步 (Ghost Sync)」系統
為了追求完美圓形，我們開發了一個非常瘋狂的架構：
1.  **3D Ghost Nodes**：建立一組不可見的 3D 節點，負責在空間中旋轉、移動。
2.  **2D Overlay Layer**：在最上層建立一個 2D 的渲染層。
3.  **Sync Engine**：利用 `requestAnimationFrame` 持續監控 3D 節點的 `getBoundingClientRect()`，並將坐標即時映射到 2D 渲染層。
*   **結果**：我們同時擁有 3D 的正確遮擋關係，以及 2D 下永遠完美的圓形與清晰的文字。

---

## 💡 AI 製作小技巧 (Tips for AI Collaboration)

1.  **使用 VFX 專業語言溝通**：
    與其說「把那個圈圈弄亮點」，不如說「增加 Additive Blending 疊加模式，並套用 15px 的 Cyan Glow」。AI 非常擅長理解這些標準的圖層術語。
    
2.  **建立「風格標籤」與 Design Tokens**：
    我們在專案中先定義了 `design_system_specification.md`。每次修改前，我會提醒 AI 參考這份文件，確保新生成的組件顏色和圓角（Corner Roundness）與舊的完全一致。
    
3.  **大膽進行「代碼考古」**：
    當某個功能（如 3D 導航）卡住時，我會請 AI 讀取 `CHANGELOG.md`，回顧之前的失敗方案，避免在同一個坑裡跌倒兩次。

---

> **這不只是一個作品集，這是我與 AI 共同磨合出的「數位工藝品」。**
> —— AINA VISUALS
