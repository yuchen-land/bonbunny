import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";
import { z } from "zod";

// Schema for analytics parameters
const analyticsParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metric: z.enum(["pageviews", "sessions", "users", "conversions"]).optional(),
});

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const tokenPayload = await verifyToken(token);

    // Get user data to check role
    const user = await db.getUserById(tokenPayload.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = analyticsParamsSchema.parse({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      metric: searchParams.get("metric"),
    });

    // Set default date range
    const endDate = params.endDate ? new Date(params.endDate) : new Date();
    const startDate = params.startDate
      ? new Date(params.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get orders and users data
    const allOrders = await db.getOrders();
    const allUsers = await db.getUsers();

    // Filter data by date range
    const ordersInPeriod = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const usersInPeriod = allUsers.filter((user) => {
      const userDate = new Date(user.createdAt);
      return userDate >= startDate && userDate <= endDate;
    });

    // Calculate user behavior metrics
    const userBehaviorAnalysis = calculateUserBehavior(
      ordersInPeriod,
      allUsers
    );
    const conversionAnalysis = calculateConversionMetrics(
      ordersInPeriod,
      usersInPeriod
    );
    const productAnalytics = calculateProductAnalytics(ordersInPeriod);
    const timeAnalysis = calculateTimeBasedAnalytics(ordersInPeriod);

    // Simulated page view data (in real implementation, this would come from GA)
    const pageviewData = generateMockPageviewData(startDate, endDate);

    return NextResponse.json({
      summary: {
        totalUsers: allUsers.length,
        newUsers: usersInPeriod.length,
        totalOrders: ordersInPeriod.length,
        conversionRate: conversionAnalysis.conversionRate,
        averageSessionDuration: 245, // Mock data
        bounceRate: 34.5, // Mock data
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
      userBehavior: userBehaviorAnalysis,
      conversions: conversionAnalysis,
      productAnalytics,
      timeAnalysis,
      pageviews: pageviewData,
      trafficSources: {
        organic: 45.2,
        direct: 28.7,
        social: 15.6,
        referral: 7.8,
        email: 2.7,
      }, // Mock data - would come from GA
      deviceAnalytics: {
        desktop: 52.3,
        mobile: 35.4,
        tablet: 12.3,
      }, // Mock data - would come from GA
      geographicData: {
        taiwan: 85.6,
        hongkong: 8.2,
        singapore: 3.1,
        others: 3.1,
      }, // Mock data - would come from GA
    });
  } catch (error) {
    console.error("User analytics error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate user analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Calculate user behavior patterns
function calculateUserBehavior(orders: any[], users: any[]) {
  const userOrderMap = new Map<string, any[]>();

  // Group orders by user email
  orders.forEach((order) => {
    const email = order.shippingInfo.email;
    if (!userOrderMap.has(email)) {
      userOrderMap.set(email, []);
    }
    userOrderMap.get(email)!.push(order);
  });

  const orderFrequencies = Array.from(userOrderMap.values()).map(
    (userOrders) => userOrders.length
  );

  return {
    averageOrdersPerUser:
      orderFrequencies.length > 0
        ? orderFrequencies.reduce((sum, freq) => sum + freq, 0) /
          orderFrequencies.length
        : 0,
    singleOrderUsers: orderFrequencies.filter((freq) => freq === 1).length,
    repeatUsers: orderFrequencies.filter((freq) => freq > 1).length,
    loyalUsers: orderFrequencies.filter((freq) => freq >= 5).length,
    userLifetimeValue: calculateAverageLifetimeValue(userOrderMap),
    purchasePatterns: analyzePurchasePatterns(userOrderMap),
  };
}

// Calculate conversion metrics
function calculateConversionMetrics(orders: any[], newUsers: any[]) {
  const usersWhoOrdered = new Set(
    orders.map((order) => order.shippingInfo.email)
  );
  const conversionRate =
    newUsers.length > 0 ? (usersWhoOrdered.size / newUsers.length) * 100 : 0;

  return {
    conversionRate,
    totalConversions: orders.length,
    uniqueConverters: usersWhoOrdered.size,
    averageTimeToPurchase: 2.5, // Mock data - days
    conversionFunnel: {
      visitors: newUsers.length * 10, // Mock multiplier
      productViews: newUsers.length * 3,
      cartAdditions: newUsers.length * 1.5,
      checkouts: orders.length * 1.2,
      completedOrders: orders.length,
    },
  };
}

// Calculate product analytics
function calculateProductAnalytics(orders: any[]) {
  const productViews = new Map<string, number>();
  const productPurchases = new Map<string, number>();
  const productRevenue = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      // Track purchases
      productPurchases.set(
        item.id,
        (productPurchases.get(item.id) || 0) + item.quantity
      );
      productRevenue.set(
        item.id,
        (productRevenue.get(item.id) || 0) + item.price * item.quantity
      );

      // Mock view data (would come from GA)
      productViews.set(
        item.id,
        (productViews.get(item.id) || 0) + item.quantity * 10
      );
    });
  });

  const productAnalytics = Array.from(productPurchases.entries())
    .map(([productId, purchases]) => {
      const views = productViews.get(productId) || 0;
      const revenue = productRevenue.get(productId) || 0;

      return {
        productId,
        views,
        purchases,
        revenue,
        conversionRate: views > 0 ? (purchases / views) * 100 : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return productAnalytics;
}

// Calculate time-based analytics
function calculateTimeBasedAnalytics(orders: any[]) {
  const hourlyData = new Array(24).fill(0);
  const dailyData = new Array(7).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const hour = date.getHours();
    const day = date.getDay();

    hourlyData[hour]++;
    dailyData[day]++;
  });

  return {
    peakHours: hourlyData
      .map((count, hour) => ({ hour, orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5),
    weekdayPattern: dailyData.map((count, day) => ({
      day: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"][day],
      orders: count,
    })),
    hourlyDistribution: hourlyData,
    dailyDistribution: dailyData,
  };
}

// Calculate average lifetime value
function calculateAverageLifetimeValue(userOrderMap: Map<string, any[]>) {
  const lifetimeValues = Array.from(userOrderMap.values()).map((userOrders) =>
    userOrders.reduce((sum, order) => sum + order.total, 0)
  );

  return lifetimeValues.length > 0
    ? lifetimeValues.reduce((sum, value) => sum + value, 0) /
        lifetimeValues.length
    : 0;
}

// Analyze purchase patterns
function analyzePurchasePatterns(userOrderMap: Map<string, any[]>) {
  const patterns = {
    seasonalTrends: new Map<number, number>(), // month -> orders
    categoryPreferences: new Map<string, number>(),
    averageDaysBetweenOrders: 0,
  };

  let totalDaysBetween = 0;
  let intervalCount = 0;

  userOrderMap.forEach((userOrders) => {
    // Sort orders by date
    userOrders.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Calculate days between orders
    for (let i = 1; i < userOrders.length; i++) {
      const daysBetween =
        (new Date(userOrders[i].createdAt).getTime() -
          new Date(userOrders[i - 1].createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      totalDaysBetween += daysBetween;
      intervalCount++;
    }

    // Track seasonal trends and category preferences
    userOrders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      patterns.seasonalTrends.set(
        month,
        (patterns.seasonalTrends.get(month) || 0) + 1
      );

      order.items.forEach((item: any) => {
        patterns.categoryPreferences.set(
          item.category,
          (patterns.categoryPreferences.get(item.category) || 0) + 1
        );
      });
    });
  });

  patterns.averageDaysBetweenOrders =
    intervalCount > 0 ? totalDaysBetween / intervalCount : 0;

  return {
    averageDaysBetweenOrders: patterns.averageDaysBetweenOrders,
    seasonalTrends: Array.from(patterns.seasonalTrends.entries()).map(
      ([month, count]) => ({
        month: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ][month],
        orders: count,
      })
    ),
    categoryPreferences: Array.from(patterns.categoryPreferences.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
  };
}

// Generate mock pageview data (would be replaced with real GA data)
function generateMockPageviewData(startDate: Date, endDate: Date) {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const pageviewData = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    pageviewData.push({
      date: date.toISOString().split("T")[0],
      pageviews: Math.floor(Math.random() * 500) + 100,
      sessions: Math.floor(Math.random() * 200) + 50,
      users: Math.floor(Math.random() * 150) + 30,
    });
  }

  return pageviewData;
}
