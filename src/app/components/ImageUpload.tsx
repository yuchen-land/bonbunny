"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
  Check,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface UploadedImage {
  imageUrl: string;
  thumbnailUrl: string;
  filename: string;
  originalName: string;
  size: number;
}

interface ImageUploadProps {
  onImageUploaded?: (image: UploadedImage) => void;
  maxImages?: number;
  acceptMultiple?: boolean;
}

export default function ImageUpload({
  onImageUploaded,
  maxImages = 5,
  acceptMultiple = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed maxImages
    if (uploadedImages.length + files.length > maxImages) {
      setError(`最多只能上傳 ${maxImages} 張圖片`);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/admin/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);

      setUploadedImages((prev) => [...prev, ...results]);
      setSuccess(`成功上傳 ${results.length} 張圖片`);

      // Call callback for each uploaded image
      results.forEach((result) => {
        onImageUploaded?.(result);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setSuccess(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        圖片上傳
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <ImageIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />

            <Button
              component="label"
              variant="contained"
              startIcon={
                uploading ? <CircularProgress size={20} /> : <CloudUpload />
              }
              disabled={uploading || uploadedImages.length >= maxImages}
              sx={{ mb: 2 }}
            >
              {uploading ? "上傳中..." : "選擇圖片"}
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                multiple={acceptMultiple}
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
            </Button>

            <Typography variant="body2" color="text.secondary">
              支援格式：JPEG, PNG, WebP
              <br />
              檔案大小限制：5MB
              <br />
              最多上傳：{maxImages} 張圖片
            </Typography>

            {uploadedImages.length > 0 && (
              <Chip
                label={`已上傳：${uploadedImages.length}/${maxImages}`}
                color="primary"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {uploadedImages.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            已上傳的圖片
          </Typography>

          <Stack spacing={2}>
            {uploadedImages.map((image, index) => (
              <Card key={index} sx={{ display: "flex" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: "cover" }}
                  image={image.thumbnailUrl}
                  alt={image.originalName}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {image.originalName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    檔案大小：{formatFileSize(image.size)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    路徑：{image.imageUrl}
                  </Typography>
                  <Chip
                    icon={<Check />}
                    label="上傳成功"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                  <IconButton
                    color="error"
                    onClick={() => removeImage(index)}
                    aria-label="刪除圖片"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
