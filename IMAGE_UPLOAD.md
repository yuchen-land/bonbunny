# 圖片上傳功能說明

## 功能概述

BonBunny 專案現已完整支援本地端圖片上傳功能，包含以下特色：

## 🚀 主要功能

- ✅ 多檔案同時上傳
- ✅ 自動圖片壓縮與調整尺寸
- ✅ 自動產生縮圖
- ✅ 檔案類型與大小驗證
- ✅ 美觀的 MUI 介面設計
- ✅ 即時上傳進度與狀態顯示

## 📁 檔案結構

```
src/
├── app/
│   ├── api/admin/upload/image/route.ts    # 圖片上傳 API
│   ├── components/ImageUpload.tsx         # 圖片上傳元件
│   └── admin/upload-test/page.tsx         # 測試頁面
└── public/
    └── uploads/                           # 圖片儲存目錄
```

## 🔧 技術規格

### 後端 API (`/api/admin/upload/image`)

- **支援格式**：JPEG, PNG, WebP
- **檔案大小限制**：5MB
- **自動處理**：
  - 壓縮圖片至最大 1200x1200（保持比例）
  - 產生 300x300 縮圖
  - 使用 JPEG 格式輸出（品質 85%）
- **檔案命名**：`原檔名_時間戳.jpg`
- **儲存位置**：`/public/uploads/`

### 前端元件 (`ImageUpload`)

- **多檔案上傳**：支援一次選擇多張圖片
- **拖拉上傳**：可拖拉檔案到上傳區域
- **即時預覽**：上傳後立即顯示縮圖預覽
- **進度顯示**：上傳過程中顯示載入動畫
- **錯誤處理**：友善的錯誤訊息提示

## 🎯 使用方式

### 1. API 使用範例

```javascript
const formData = new FormData();
formData.append("image", file);

const response = await fetch("/api/admin/upload/image", {
  method: "POST",
  body: formData,
});

const result = await response.json();
// result 包含：imageUrl, thumbnailUrl, filename, originalName, size
```

### 2. React 元件使用

```tsx
import ImageUpload from "../components/ImageUpload";

function MyPage() {
  const handleImageUploaded = (image) => {
    console.log("上傳成功:", image.imageUrl);
  };

  return (
    <ImageUpload
      onImageUploaded={handleImageUploaded}
      maxImages={5}
      acceptMultiple={true}
    />
  );
}
```

## 🧪 測試頁面

訪問 `/admin/upload-test` 可以測試圖片上傳功能。

## 📋 回傳資料格式

```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/product_1693123456789.jpg",
  "thumbnailUrl": "/uploads/thumb_product_1693123456789.jpg",
  "filename": "product_1693123456789.jpg",
  "originalName": "product.jpg",
  "size": 245760
}
```

## 🛡️ 安全性考量

- 檔案類型白名單驗證
- 檔案大小限制
- 檔案名稱清理與時間戳防衝突
- 自動圖片處理防止惡意內容

## 🔄 未來擴充建議

- [ ] 支援雲端儲存（Cloudinary、S3）
- [ ] 加入浮水印功能
- [ ] 支援更多圖片格式
- [ ] 批次刪除功能
- [ ] 圖片編輯功能（裁切、旋轉）

## 🚨 注意事項

1. 圖片儲存在 `/public/uploads/` 目錄，請確保該目錄有寫入權限
2. 生產環境建議使用雲端儲存服務
3. 定期清理未使用的圖片檔案
4. 考慮備份重要圖片資料
