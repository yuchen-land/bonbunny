"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import AdminLayout from "../components/AdminLayout";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPercent,
} from "react-icons/fi";

interface SalesReportData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;
    orderGrowth: number;
    customerRetentionRate: number;
    period: {
      startDate: string;
      endDate: string;
    };
  };
  ordersByStatus: Record<string, number>;
  revenueByPeriod: Array<{ period: string; orders: number; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  categoryStats: Array<{ category: string; orders: number; revenue: number }>;
  customerAnalysis: {
    totalCustomers: number;
    repeatCustomers: number;
    averageOrdersPerCustomer: number;
    topCustomers: Array<{ email: string; revenue: number; orders: number }>;
  };
}

const SalesReportPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<SalesReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>;
  }

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        period: period,
      });

      const response = await fetch(`/api/admin/reports/sales?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        console.error("Failed to fetch report data");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, period]);

  const formatCurrency = (amount: number) => {
    return `NT$ ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "待付款",
      paid: "已付款",
      shipped: "已出貨",
      delivered: "已送達",
      cancelled: "已取消",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      CAKE: "蛋糕",
      COOKIE: "餅乾",
      BREAD: "麵包",
      PASTRY: "糕點",
      DRINK: "飲品",
      GIFT_SET: "禮盒",
      OTHER: "其他",
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">載入中...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!reportData) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600">無法載入報表資料</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">銷售報表</h1>
            <p className="mt-1 text-sm text-gray-600">
              分析期間：
              {new Date(
                reportData.summary.period.startDate
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(reportData.summary.period.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                開始日期
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                結束日期
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                時間週期
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="daily">每日</option>
                <option value="weekly">每週</option>
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      總訂單數
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {reportData.summary.totalOrders.toLocaleString()}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          reportData.summary.orderGrowth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {reportData.summary.orderGrowth >= 0 ? (
                          <FiTrendingUp className="h-4 w-4" />
                        ) : (
                          <FiTrendingDown className="h-4 w-4" />
                        )}
                        {formatPercentage(reportData.summary.orderGrowth)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiDollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      總營業額
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(reportData.summary.totalRevenue)}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          reportData.summary.revenueGrowth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {reportData.summary.revenueGrowth >= 0 ? (
                          <FiTrendingUp className="h-4 w-4" />
                        ) : (
                          <FiTrendingDown className="h-4 w-4" />
                        )}
                        {formatPercentage(reportData.summary.revenueGrowth)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiTrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均訂單金額
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(reportData.summary.averageOrderValue)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      總客戶數
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {reportData.customerAnalysis.totalCustomers.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiPercent className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      客戶回購率
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {reportData.summary.customerRetentionRate.toFixed(1)}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均客戶訂單
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {reportData.customerAnalysis.averageOrdersPerCustomer.toFixed(
                        1
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              訂單狀態分布
            </h3>
            <div className="space-y-3">
              {Object.entries(reportData.ordersByStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {count} 筆
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              熱銷商品 Top 5
            </h3>
            <div className="space-y-3">
              {reportData.topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-900 ml-2">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      銷量: {product.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              商品類別表現
            </h3>
            <div className="space-y-3">
              {reportData.categoryStats.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between"
                >
                  <div className="text-sm text-gray-900">
                    {getCategoryLabel(category.category)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.orders} 筆訂單
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              VIP 客戶 Top 5
            </h3>
            <div className="space-y-3">
              {reportData.customerAnalysis.topCustomers
                .slice(0, 5)
                .map((customer, index) => (
                  <div
                    key={customer.email}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900 ml-2">
                        {customer.email.replace(/(.{3}).*(@.*)/, "$1***$2")}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(customer.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer.orders} 筆訂單
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">營收趨勢</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單數
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    營業額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    平均訂單金額
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.revenueByPeriod.map((period) => (
                  <tr key={period.period}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {period.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(period.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(
                        period.orders > 0 ? period.revenue / period.orders : 0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReportPage;
