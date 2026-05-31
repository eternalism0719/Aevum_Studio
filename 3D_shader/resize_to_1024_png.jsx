// ============================================================
// Photoshop Batch Script: Resize to 1024x1024 & Export as PNG
// 使用方式：
//   Photoshop 上方選單 -> 檔案 (File) -> 指令碼 (Scripts)
//             -> 瀏覽 (Browse)... -> 選取此檔案
// ============================================================

#target photoshop

// --- 設定 ---
var TARGET_SIZE = 1024;
var PNG_COMPRESSION = 6;

// ExtendScript (JS 1.5) 相容的副檔名比對函式
// 避免使用 regex，改用字串切割確保跨版本 Photoshop 穩定運行
function getSupportedExt(filename) {
    var parts = filename.split(".");
    if (parts.length < 2) return null;
    var ext = parts[parts.length - 1].toLowerCase();
    var supported = ["jpg", "jpeg", "png", "exr", "tif", "tiff", "psd"];
    for (var i = 0; i < supported.length; i++) {
        if (ext === supported[i]) return ext;
    }
    return null;
}

// 去除副檔名，取得基礎檔名
function getBaseName(filename) {
    var parts = filename.split(".");
    parts.pop(); // 移除最後一個副檔名
    return parts.join(".");
}

// --- 主程式 ---
var srcFolder = Folder.selectDialog("選擇包含 4K 貼圖的資料夾（來源）");
if (srcFolder === null) {
    alert("已取消，未選擇來源資料夾。");
} else {
    var dstFolder = Folder.selectDialog("選擇輸出資料夾（建議新建一個 output 資料夾）");
    if (dstFolder === null) {
        alert("已取消，未選擇輸出資料夾。");
    } else {
        var fileList = [];
        var allFiles = srcFolder.getFiles();

        for (var i = 0; i < allFiles.length; i++) {
            var f = allFiles[i];
            // 確認是檔案（排除子資料夾）且副檔名受支援
            if (f instanceof File && getSupportedExt(f.name) !== null) {
                fileList.push(f);
            }
        }

        if (fileList.length === 0) {
            alert("資料夾內沒有找到支援的圖片檔案（JPG, PNG, EXR, TIFF, PSD）。\n\n請確認您選取的是直接包含貼圖的資料夾，而非上層的父資料夾。");
        } else {
            var successCount = 0;
            var failList = [];

            for (var j = 0; j < fileList.length; j++) {
                var file = fileList[j];
                var doc = null;
                try {
                    // 以靜默模式開啟檔案（不顯示對話框）
                    var openOpts = new Object();
                    doc = open(file);

                    // EXR 為 32-bit，統一降轉為 8-bit（必須在縮放前執行）
                    if (doc.bitsPerChannel !== BitsPerChannelType.EIGHT) {
                        doc.bitsPerChannel = BitsPerChannelType.EIGHT;
                    }

                    // 確保為 RGB 色彩模式
                    if (doc.mode !== DocumentMode.RGB) {
                        doc.changeMode(ChangeMode.RGB);
                    }

                    // 縮放至 1024x1024（Bicubic Sharper 為縮小時最佳演算法）
                    doc.resizeImage(
                        TARGET_SIZE,
                        TARGET_SIZE,
                        doc.resolution,
                        ResampleMethod.BICUBICSHARPER
                    );

                    // 組合輸出路徑（基礎檔名 + _1024.png）
                    var baseName = getBaseName(file.name);
                    var outputPath = dstFolder.fsName + "\\" + baseName + "_1024.png";
                    var outputFile = new File(outputPath);

                    // PNG 儲存選項
                    var pngOptions = new PNGSaveOptions();
                    pngOptions.compression = PNG_COMPRESSION;
                    pngOptions.interlaced = false;

                    // 另存新檔為 PNG（不影響原始貼圖）
                    doc.saveAs(outputFile, pngOptions, true, Extension.LOWERCASE);
                    doc.close(SaveOptions.DONOTSAVECHANGES);

                    successCount++;
                } catch (e) {
                    failList.push(file.name + " -- 錯誤：" + e.message);
                    if (doc !== null) {
                        try { doc.close(SaveOptions.DONOTSAVECHANGES); } catch (e2) {}
                    }
                }
            }

            // 完成報告
            var report = "=== 批次處理完成 ===\n";
            report += "成功：" + successCount + " / " + fileList.length + " 個檔案\n";
            report += "輸出位置：" + dstFolder.fsName + "\n";

            if (failList.length > 0) {
                report += "\n--- 失敗清單 ---\n";
                for (var k = 0; k < failList.length; k++) {
                    report += failList[k] + "\n";
                }
            }

            alert(report);
        }
    }
}
