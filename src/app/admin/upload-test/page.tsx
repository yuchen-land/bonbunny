"use client";

import { Container, Typography, Box, Divider, Alert } from "@mui/material";
import ImageUpload from "../../components/ImageUpload";

export default function ImageUploadTestPage() {
  const handleImageUploaded = (image: any) => {
    console.log("Image uploaded:", image);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        圖片上傳測試頁面
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        此頁面用於測試圖片上傳功能。上傳的圖片會儲存在{" "}
        <code>/public/uploads/</code> 目錄中。
      </Alert>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 4 }}>
        <ImageUpload
          onImageUploaded={handleImageUploaded}
          maxImages={5}
          acceptMultiple={true}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          功能說明
        </Typography>
        <Typography variant="body2" color="text.secondary" component="ul">
          <li>支援 JPEG、PNG、WebP 格式</li>
          <li>自動壓縮與調整尺寸（最大 1200x1200）</li>
          <li>自動產生縮圖（300x300）</li>
          <li>檔案大小限制：5MB</li>
          <li>可一次上傳多張圖片</li>
          <li>
            圖片儲存在 <code>/public/uploads/</code> 目錄
          </li>
          <li>
            上傳成功後可透過 <code>/uploads/檔名</code> 存取
          </li>
        </Typography>
      </Box>
    </Container>
  );
}
