"use client";

import { FC, useState } from "react";
import AdminLayout from "../components/AdminLayout";

interface Settings {
  shopName: string;
  shopDescription: string;
  contactEmail: string;
  contactPhone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  allowGuestCheckout: boolean;
  requireEmailVerification: boolean;
  orderConfirmationEmail: boolean;
  shippingNotificationEmail: boolean;
}

const defaultSettings: Settings = {
  shopName: "BonBunny",
  shopDescription: "精緻手工甜點專賣店",
  contactEmail: "contact@bonbunny.com",
  contactPhone: "02-1234-5678",
  shippingFee: 60,
  freeShippingThreshold: 1000,
  allowGuestCheckout: true,
  requireEmailVerification: true,
  orderConfirmationEmail: true,
  shippingNotificationEmail: true,
};

const SettingsPage: FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 在實際應用中，這裡會發送設定到後端 API
    console.log("Saving settings:", settings);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">系統設定</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 商店基本資訊 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">商店基本資訊</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  商店名稱
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={settings.shopName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  商店描述
                </label>
                <textarea
                  name="shopDescription"
                  value={settings.shopDescription}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    聯絡電子郵件
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    聯絡電話
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 運費設定 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">運費設定</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  基本運費 (NT$)
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  免運門檻 (NT$)
                </label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* 訂單與會員設定 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">訂單與會員設定</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowGuestCheckout"
                  checked={settings.allowGuestCheckout}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  允許訪客結帳
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  要求會員驗證電子郵件
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="orderConfirmationEmail"
                  checked={settings.orderConfirmationEmail}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  發送訂單確認郵件
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="shippingNotificationEmail"
                  checked={settings.shippingNotificationEmail}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  發送出貨通知郵件
                </label>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              儲存設定
            </button>
          </div>

          {/* 成功提示 */}
          {isSuccess && (
            <div className="fixed bottom-4 right-4">
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">設定已成功儲存！</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
