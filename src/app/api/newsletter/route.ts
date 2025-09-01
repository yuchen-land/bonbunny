import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for validating newsletter subscription
const newsletterSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  name: z.string().optional(),
});

// Simple in-memory storage for newsletter subscribers (in production, use database)
const subscribers = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    // Check if already subscribed
    if (subscribers.has(validatedData.email)) {
      return NextResponse.json(
        {
          error: "此電子郵件已訂閱電子報",
        },
        { status: 409 }
      );
    }

    // Add to subscribers
    subscribers.add(validatedData.email);

    // Create subscription record
    const subscription = {
      email: validatedData.email,
      name: validatedData.name,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    };

    // In a real application, you would:
    // 1. Save to database
    // 2. Send welcome email
    // 3. Add to email marketing service (like Mailchimp)

    console.log("New newsletter subscription:", subscription);

    return NextResponse.json(
      {
        success: true,
        message: "感謝您訂閱我們的電子報！您將會收到最新的甜點資訊和優惠。",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "電子郵件格式無效",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        error: "訂閱失敗，請稍後再試。",
      },
      { status: 500 }
    );
  }
}

// Get all subscribers (admin only)
export async function GET(request: Request) {
  try {
    // In production, you would verify admin authentication here

    const subscriberList = Array.from(subscribers).map((email) => ({
      email,
      subscribedAt: new Date().toISOString(), // In real app, get from database
    }));

    return NextResponse.json({
      subscribers: subscriberList,
      total: subscriberList.length,
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json(
      {
        error: "獲取訂閱者列表失敗",
      },
      { status: 500 }
    );
  }
}
