import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/api/auth/utils";

// 模擬 GA 設定存儲
let gaSettings = {
  measurementId: "",
  connected: false,
  lastSync: null as string | null,
  events: {
    pageViews: true,
    purchases: true,
    addToCart: true,
    signUp: true,
    login: true,
  },
};

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

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(gaSettings);
  } catch (error) {
    console.error("GA settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GA settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { measurementId, events } = await request.json();

    // 驗證 Measurement ID 格式
    const measurementIdRegex = /^G-[A-Z0-9]{10}$/;
    if (measurementId && !measurementIdRegex.test(measurementId)) {
      return NextResponse.json(
        { error: "Invalid measurement ID format" },
        { status: 400 }
      );
    }

    // 更新設定
    gaSettings = {
      ...gaSettings,
      measurementId: measurementId || "",
      connected: !!measurementId,
      events: events || gaSettings.events,
      lastSync: measurementId ? new Date().toISOString() : gaSettings.lastSync,
    };

    return NextResponse.json({
      success: true,
      message: "GA settings updated successfully",
      settings: gaSettings,
    });
  } catch (error) {
    console.error("GA settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update GA settings" },
      { status: 500 }
    );
  }
}
