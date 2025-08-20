import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/auth/utils";

// 模擬用戶資料
const users = [
  { id: "1", email: "yuchen880401@gmail.com", role: "admin" },
];

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    const user = users.find(u => u.email === payload.email);
    
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 模擬 GA 連接測試
    // 在實際應用中，這裡會檢查 GA API 連接
    const testResult = {
      success: true,
      message: "Google Analytics connection test successful",
      timestamp: new Date().toISOString(),
      testData: {
        propertyId: "123456789",
        accountName: "BonBunny Bakery",
        connected: true,
      },
    };

    return NextResponse.json(testResult);
  } catch (error) {
    console.error("GA test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to test GA connection",
        message: "Connection test failed. Please check your measurement ID and try again."
      },
      { status: 500 }
    );
  }
}
