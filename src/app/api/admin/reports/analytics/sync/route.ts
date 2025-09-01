import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/auth/utils";

// 模擬用戶資料
const users = [{ id: "1", email: "yuchen880401@gmail.com", role: "admin" }];

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    const user = users.find((u) => u.email === payload.email);

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

    // 模擬數據同步過程
    // 在實際應用中，這裡會從 GA API 獲取真實數據
    const syncResult = {
      success: true,
      message: "Analytics data synchronized successfully",
      timestamp: new Date().toISOString(),
      syncedData: {
        pageviews: 1250,
        sessions: 980,
        users: 756,
        events: {
          purchases: 45,
          addToCart: 156,
          signUps: 23,
          logins: 234,
        },
        timeRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
      },
      nextSync: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 下次同步時間：1小時後
    };

    return NextResponse.json(syncResult);
  } catch (error) {
    console.error("Analytics sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync analytics data",
        message: "Data synchronization failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}
