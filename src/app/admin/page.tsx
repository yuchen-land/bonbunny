"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth";
import AdminLayout from "./components/AdminLayout";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">後台管理</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 統計卡片 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">總訂單數</h3>
            <p className="text-2xl font-semibold mt-2">123</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">總營業額</h3>
            <p className="text-2xl font-semibold mt-2">NT$ 45,678</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">商品數量</h3>
            <p className="text-2xl font-semibold mt-2">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">會員數量</h3>
            <p className="text-2xl font-semibold mt-2">89</p>
          </div>
        </div>

        {/* 最近訂單 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">最近訂單</h2>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客戶
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #ORD001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    王小明
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    NT$ 1,280
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      已付款
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2025-06-19
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
