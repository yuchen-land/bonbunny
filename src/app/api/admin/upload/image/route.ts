import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const extension = file.name.split(".").pop();
    const filename = `${originalName}_${timestamp}.${extension}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Process image with sharp (compress and resize if needed)
    const processedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Save processed image
    const processedFilename = `${originalName}_${timestamp}.jpg`;
    const filepath = join(uploadsDir, processedFilename);
    await writeFile(filepath, processedBuffer);

    // Also save thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbnailFilename = `thumb_${originalName}_${timestamp}.jpg`;
    const thumbnailPath = join(uploadsDir, thumbnailFilename);
    await writeFile(thumbnailPath, thumbnailBuffer);

    const imageUrl = `/uploads/${processedFilename}`;
    const thumbnailUrl = `/uploads/${thumbnailFilename}`;

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl,
      thumbnailUrl,
      filename: processedFilename,
      originalName: file.name,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Image upload endpoint",
    supportedFormats: ["JPEG", "PNG", "WebP"],
    maxSize: "5MB",
    endpoint: "POST /api/admin/upload/image",
  });
}
