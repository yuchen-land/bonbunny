"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import AdminLayout from "../components/AdminLayout";
import {
  FiUsers,
  FiEye,
  FiShoppingBag,
  FiPercent,
  FiClock,
  FiSmartphone,
  FiMonitor,
  FiTablet,
} from "react-icons/fi";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    newUsers: number;
    totalOrders: number;
    conversionRate: number;
    averageSessionDuration: number;
    bounceRate: number;
    period: {
      startDate: string;
      endDate: string;
    };
  };
  userBehavior: {
    averageOrdersPerUser: number;
    singleOrderUsers: number;
    repeatUsers: number;
    loyalUsers: number;
    userLifetimeValue: number;
    purchasePatterns: {
      averageDaysBetweenOrders: number;
      seasonalTrends: Array<{ month: string; orders: number }>;
      categoryPreferences: Array<{ category: string; count: number }>;
    };
  };
  conversions: {
    conversionRate: number;
    totalConversions: number;
    uniqueConverters: number;
    averageTimeToPurchase: number;
    conversionFunnel: {
      visitors: number;
      productViews: number;
      cartAdditions: number;
      checkouts: number;
      completedOrders: number;
    };
  };
  productAnalytics: Array<{
    productId: string;
    views: number;
    purchases: number;
    revenue: number;
    conversionRate: number;
  }>;
  timeAnalysis: {
    peakHours: Array<{ hour: number; orders: number }>;
    weekdayPattern: Array<{ day: string; orders: number }>;
    hourlyDistribution: number[];
    dailyDistribution: number[];
  };
  pageviews: Array<{
    date: string;
    pageviews: number;
    sessions: number;
    users: number;
  }>;
  trafficSources: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
    email: number;
  };
  deviceAnalytics: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: {
    taiwan: number;
    hongkong: number;
    singapore: number;
    others: number;
  };
}

const AnalyticsPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>;
  }

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(`/api/admin/reports/analytics?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return `NT$ ${amount.toLocaleString()}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

  if (!analyticsData) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600">無法載入分析資料</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">用戶行為分析</h1>
            <p className="mt-1 text-sm text-gray-600">
              分析期間：
              {new Date(
                analyticsData.summary.period.startDate
              ).toLocaleDateString()}{" "}
              -{" "}
              {new Date(
                analyticsData.summary.period.endDate
              ).toLocaleDateString()}
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      總用戶數
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.totalUsers.toLocaleString()}
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
                  <FiUsers className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      新用戶數
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.newUsers.toLocaleString()}
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
                  <FiPercent className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      轉換率
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.conversionRate.toFixed(1)}%
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
                  <FiClock className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均停留時間
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatDuration(
                        analyticsData.summary.averageSessionDuration
                      )}
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
                  <FiEye className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      跳出率
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {analyticsData.summary.bounceRate.toFixed(1)}%
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
                  <FiShoppingBag className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      客戶生命價值
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(
                        analyticsData.userBehavior.userLifetimeValue
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Behavior */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              用戶行為模式
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">單次購買用戶</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.userBehavior.singleOrderUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">回購用戶</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.userBehavior.repeatUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">忠誠用戶 (5+訂單)</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.userBehavior.loyalUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均每用戶訂單數</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.userBehavior.averageOrdersPerUser.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">平均訂單間隔天數</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.userBehavior.purchasePatterns.averageDaysBetweenOrders.toFixed(
                    1
                  )}{" "}
                  天
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">轉換漏斗</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.conversions.conversionFunnel).map(
                ([stage, count], index) => {
                  const percentage =
                    index === 0
                      ? 100
                      : (count /
                          analyticsData.conversions.conversionFunnel.visitors) *
                        100;
                  const stageLabels = {
                    visitors: "訪客",
                    productViews: "商品瀏覽",
                    cartAdditions: "加入購物車",
                    checkouts: "結帳",
                    completedOrders: "完成訂單",
                  };

                  return (
                    <div
                      key={stage}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            percentage >= 80
                              ? "bg-green-400"
                              : percentage >= 60
                              ? "bg-yellow-400"
                              : percentage >= 40
                              ? "bg-orange-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {stageLabels[stage as keyof typeof stageLabels]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {count.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Device Analytics */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              裝置使用分析
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiMonitor className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">桌面裝置</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.deviceAnalytics.desktop.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiSmartphone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">手機</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.deviceAnalytics.mobile.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiTablet className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">平板</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData.deviceAnalytics.tablet.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">流量來源</h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.trafficSources).map(
                ([source, percentage]) => {
                  const sourceLabels = {
                    organic: "自然搜索",
                    direct: "直接訪問",
                    social: "社群媒體",
                    referral: "推薦連結",
                    email: "電子郵件",
                  };

                  return (
                    <div
                      key={source}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {sourceLabels[source as keyof typeof sourceLabels]}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Hours */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              熱門時段 Top 5
            </h3>
            <div className="space-y-3">
              {analyticsData.timeAnalysis.peakHours.map((period, index) => (
                <div
                  key={period.hour}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-900 ml-2">
                      {period.hour}:00 - {period.hour + 1}:00
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {period.orders} 筆訂單
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              每週購買模式
            </h3>
            <div className="space-y-3">
              {analyticsData.timeAnalysis.weekdayPattern.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{day.day}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {day.orders} 筆訂單
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Preferences */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            商品類別偏好
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analyticsData.userBehavior.purchasePatterns.categoryPreferences.map(
              (category) => (
                <div key={category.category} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {category.count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCategoryLabel(category.category)}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">季節性趨勢</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {analyticsData.userBehavior.purchasePatterns.seasonalTrends.map(
              (month) => (
                <div key={month.month} className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {month.orders}
                  </div>
                  <div className="text-sm text-gray-600">{month.month}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
