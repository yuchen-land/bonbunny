"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export default function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
  });

  const [timeRange, setTimeRange] = useState("30d");

  // 模擬數據載入
  useEffect(() => {
    const fetchMetrics = async () => {
      // 模擬 API 呼叫
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMetrics({
        totalRevenue: 125000,
        totalOrders: 450,
        totalCustomers: 280,
        averageOrderValue: 278,
        revenueGrowth: 12.5,
        orderGrowth: 8.2,
        customerGrowth: 15.3,
      });
    };

    fetchMetrics();
  }, [timeRange]);

  // 銷售趨勢圖數據
  const salesTrendData = {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
    datasets: [
      {
        label: "銷售額 (NT$)",
        data: [65000, 59000, 80000, 81000, 56000, 85000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // 產品類別銷售圖數據
  const categoryData = {
    labels: ["蛋糕", "餅乾", "麵包", "飲品", "其他"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

  // 顧客行為數據
  const customerBehaviorData = {
    labels: ["新客戶", "回購客戶", "VIP客戶"],
    datasets: [
      {
        label: "客戶數量",
        data: [120, 150, 80],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  const metricCards = [
    {
      title: "總銷售額",
      value: `NT$ ${metrics.totalRevenue.toLocaleString()}`,
      growth: metrics.revenueGrowth,
      icon: FiDollarSign,
      color: "text-green-600",
    },
    {
      title: "總訂單數",
      value: metrics.totalOrders.toLocaleString(),
      growth: metrics.orderGrowth,
      icon: FiShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "總客戶數",
      value: metrics.totalCustomers.toLocaleString(),
      growth: metrics.customerGrowth,
      icon: FiUsers,
      color: "text-purple-600",
    },
    {
      title: "平均訂單金額",
      value: `NT$ ${metrics.averageOrderValue}`,
      growth: 5.8,
      icon: FiTrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">進階數據分析</h1>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range === "7d"
                ? "7天"
                : range === "30d"
                ? "30天"
                : range === "90d"
                ? "90天"
                : "1年"}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <span
                  className={`text-sm font-medium ${
                    metric.growth > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.growth > 0 ? "+" : ""}
                  {metric.growth}%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">銷售趨勢</h3>
          <Line
            data={salesTrendData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">產品類別分布</h3>
          <Doughnut
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </motion.div>

        {/* Customer Behavior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">客戶分析</h3>
          <Bar
            data={customerBehaviorData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </motion.div>
      </div>

      {/* Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white p-6 rounded-xl shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">商業洞察</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">熱銷分析</h4>
            <p className="text-blue-700 text-sm">
              蛋糕類產品佔總銷售額 35%，建議增加新口味選擇
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">客戶留存</h4>
            <p className="text-green-700 text-sm">
              回購率達 60%，客戶忠誠度表現良好
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">成長機會</h4>
            <p className="text-orange-700 text-sm">
              飲品類別有 15% 成長空間，可考慮季節性推廣
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
