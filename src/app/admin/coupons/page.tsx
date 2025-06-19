"use client";

import { FC, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import type { Coupon } from "@/app/types/coupon";

// 模擬優惠券數據
const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME100",
    name: "新會員優惠",
    description: "新會員首次購物折抵 100 元",
    type: "fixed",
    value: 100,
    minPurchase: 500,
    startDate: "2025-06-01T00:00:00.000Z",
    endDate: "2025-07-31T23:59:59.999Z",
    usageLimit: 1000,
    usageCount: 234,
    isActive: true,
    createdAt: "2025-05-30T10:00:00.000Z",
  },
  {
    id: "2",
    code: "SUMMER20",
    name: "夏季特惠",
    description: "全站商品 8 折",
    type: "percentage",
    value: 20,
    minPurchase: 1000,
    maxDiscount: 500,
    startDate: "2025-06-01T00:00:00.000Z",
    endDate: "2025-08-31T23:59:59.999Z",
    usageLimit: 500,
    usageCount: 123,
    isActive: true,
    createdAt: "2025-05-30T10:00:00.000Z",
  },
];

const CouponsPage: FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const handleDelete = (couponId: string) => {
    if (confirm("確定要刪除此優惠券？")) {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 處理表單提交
    setShowForm(false);
  };

  const handleToggleActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === couponId
          ? { ...coupon, isActive: !coupon.isActive }
          : coupon
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">優惠券管理</h1>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            <FiPlus className="mr-2" />
            新增優惠券
          </button>
        </div>

        {/* 優惠券列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優惠券資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用條件
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用狀況
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {coupon.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        代碼: {coupon.code}
                      </div>
                      <div className="text-xs text-gray-500">
                        {coupon.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.type === "fixed"
                        ? `折抵 ${coupon.value} 元`
                        : `${coupon.value}% OFF`}
                    </div>
                    <div className="text-sm text-gray-500">
                      最低消費: NT$ {coupon.minPurchase}
                    </div>
                    {coupon.maxDiscount && (
                      <div className="text-sm text-gray-500">
                        最高折抵: NT$ {coupon.maxDiscount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(coupon.startDate).toLocaleDateString()}
                      <br />
                      至
                      <br />
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    已使用 {coupon.usageCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(coupon.id)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "啟用中" : "已停用"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setShowForm(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 優惠券表單對話框 */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                {editingCoupon ? "編輯優惠券" : "新增優惠券"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    優惠券名稱
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    defaultValue={editingCoupon?.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    優惠碼
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    defaultValue={editingCoupon?.code}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    優惠說明
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    rows={2}
                    defaultValue={editingCoupon?.description}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      優惠類型
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.type}
                      required
                    >
                      <option value="fixed">固定金額</option>
                      <option value="percentage">百分比折扣</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      折扣值
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.value}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      最低消費
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.minPurchase}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      最高折抵
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.maxDiscount}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      開始日期
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.startDate.split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      結束日期
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      defaultValue={editingCoupon?.endDate.split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    使用次數限制
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    defaultValue={editingCoupon?.usageLimit}
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600"
                  >
                    {editingCoupon ? "更新" : "新增"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CouponsPage;
