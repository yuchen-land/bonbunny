import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { verifyToken } from "@/app/api/auth/utils";
import { z } from "zod";

// Schema for report parameters
const reportParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(["daily", "weekly", "monthly", "yearly"]).optional().default("monthly"),
  category: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const tokenPayload = await verifyToken(token);

    // Get user data to check role
    const user = await db.getUserById(tokenPayload.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const params = reportParamsSchema.parse({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      period: searchParams.get("period"),
      category: searchParams.get("category"),
    });

    // Set default date range if not provided
    const endDate = params.endDate ? new Date(params.endDate) : new Date();
    const startDate = params.startDate 
      ? new Date(params.startDate) 
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // Get all orders within date range
    const allOrders = await db.getOrders();
    const orders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Calculate basic statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Order status breakdown
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Revenue by period
    const revenueByPeriod = groupOrdersByPeriod(orders, params.period);

    // Top selling products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales.has(item.id)) {
          const existing = productSales.get(item.id)!;
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(item.id, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Category performance
    const categoryPerformance = new Map<string, { orders: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.category;
        if (categoryPerformance.has(category)) {
          const existing = categoryPerformance.get(category)!;
          existing.orders += 1;
          existing.revenue += item.price * item.quantity;
        } else {
          categoryPerformance.set(category, {
            orders: 1,
            revenue: item.price * item.quantity,
          });
        }
      });
    });

    const categoryStats = Array.from(categoryPerformance.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // Monthly growth (compare with previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));
    const previousPeriodEnd = startDate;
    
    const previousOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= previousPeriodStart && orderDate < previousPeriodEnd;
    });

    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const orderGrowth = previousOrders.length > 0 
      ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 
      : 0;

    // Customer analysis
    const customerOrders = new Map<string, number>();
    const customerRevenue = new Map<string, number>();

    orders.forEach(order => {
      const email = order.shippingInfo.email;
      customerOrders.set(email, (customerOrders.get(email) || 0) + 1);
      customerRevenue.set(email, (customerRevenue.get(email) || 0) + order.total);
    });

    const repeatCustomers = Array.from(customerOrders.entries()).filter(([_, count]) => count > 1).length;
    const customerRetentionRate = totalOrders > 0 ? (repeatCustomers / customerOrders.size) * 100 : 0;

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
        customerRetentionRate,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      },
      ordersByStatus,
      revenueByPeriod,
      topProducts,
      categoryStats,
      customerAnalysis: {
        totalCustomers: customerOrders.size,
        repeatCustomers,
        averageOrdersPerCustomer: customerOrders.size > 0 ? totalOrders / customerOrders.size : 0,
        topCustomers: Array.from(customerRevenue.entries())
          .map(([email, revenue]) => ({ email, revenue, orders: customerOrders.get(email) || 0 }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10)
      }
    });

  } catch (error) {
    console.error("Sales report error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate sales report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to group orders by time period
function groupOrdersByPeriod(orders: any[], period: string) {
  const grouped = new Map<string, { orders: number; revenue: number }>();

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    let key: string;

    switch (period) {
      case "daily":
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case "yearly":
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (grouped.has(key)) {
      const existing = grouped.get(key)!;
      existing.orders += 1;
      existing.revenue += order.total;
    } else {
      grouped.set(key, { orders: 1, revenue: order.total });
    }
  });

  return Array.from(grouped.entries())
    .map(([period, data]) => ({ period, ...data }))
    .sort((a, b) => a.period.localeCompare(b.period));
}
