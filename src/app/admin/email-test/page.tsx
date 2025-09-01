"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/auth";
import AdminLayout from "../components/AdminLayout";

const EmailTestPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [orderId, setOrderId] = useState("");

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>;
  }

  const testOrderConfirmationEmail = async () => {
    if (!orderId.trim()) {
      setResult("請輸入訂單編號");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Fetch order data
      const orderResponse = await fetch(`/api/orders?orderId=${orderId}`);
      if (!orderResponse.ok) {
        throw new Error("找不到訂單");
      }

      const order = await orderResponse.json();

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("請重新登入");
      }

      // Test order confirmation email
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "order_confirmation",
          orderId: orderId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ 訂單確認信發送成功！收件人：${order.shippingInfo.email}`);
      } else {
        setResult(`❌ 發送失敗：${data.error}`);
      }
    } catch (error) {
      setResult(
        `❌ 錯誤：${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testTransferNotificationEmail = async () => {
    if (!orderId.trim()) {
      setResult("請輸入訂單編號");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Fetch order data
      const orderResponse = await fetch(`/api/orders?orderId=${orderId}`);
      if (!orderResponse.ok) {
        throw new Error("找不到訂單");
      }

      const order = await orderResponse.json();

      if (!order.paymentInfo.transferDetails?.isReported) {
        setResult("❌ 此訂單尚未回報匯款資訊");
        return;
      }

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("請重新登入");
      }

      // Test transfer notification email
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "transfer_notification",
          orderId: orderId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ 匯款通知信發送成功！收件人：${order.shippingInfo.email}`);
      } else {
        setResult(`❌ 發送失敗：${data.error}`);
      }
    } catch (error) {
      setResult(
        `❌ 錯誤：${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">郵件測試</h1>
          <p className="mt-1 text-sm text-gray-600">
            測試訂單確認信和匯款通知信的發送功能
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700"
              >
                訂單編號
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="例如：ORD1729123456ABCDE"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={testOrderConfirmationEmail}
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "發送中..." : "測試訂單確認信"}
              </button>

              <button
                onClick={testTransferNotificationEmail}
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "發送中..." : "測試匯款通知信"}
              </button>
            </div>

            {result && (
              <div className="mt-4 p-4 rounded-md bg-gray-50">
                <p className="text-sm text-gray-700">{result}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            ⚠️ 使用說明
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 請確保已在 .env 文件中設定 EMAIL_USER 和 EMAIL_PASSWORD</li>
            <li>• 使用 Gmail 應用程式密碼，而非一般密碼</li>
            <li>• 訂單確認信：任何有效訂單編號都可以測試</li>
            <li>• 匯款通知信：需要該訂單已回報匯款資訊</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailTestPage;
