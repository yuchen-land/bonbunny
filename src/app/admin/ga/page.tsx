"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import AdminLayout from "../components/AdminLayout";
import { FiSettings, FiCode, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface GAConfig {
  measurementId: string;
  connected: boolean;
  lastSync: string | null;
  events: {
    pageViews: boolean;
    purchases: boolean;
    addToCart: boolean;
    signUp: boolean;
    login: boolean;
  };
}

const GAIntegrationPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [gaConfig, setGaConfig] = useState<GAConfig>({
    measurementId: "",
    connected: false,
    lastSync: null,
    events: {
      pageViews: true,
      purchases: true,
      addToCart: true,
      signUp: true,
      login: true,
    },
  });
  const [measurementId, setMeasurementId] = useState("");

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    // 載入 GA 設定
    loadGAConfig();
  }, []);

  const loadGAConfig = async () => {
    try {
      const response = await fetch("/api/admin/settings/ga", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGaConfig(data);
        setMeasurementId(data.measurementId || "");
      }
    } catch (error) {
      console.error("Failed to load GA config:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveGAConfig = async () => {
    try {
      const response = await fetch("/api/admin/settings/ga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          measurementId,
          events: gaConfig.events,
        }),
      });

      if (response.ok) {
        await loadGAConfig();
        alert("Google Analytics 設定已保存");
      } else {
        alert("保存失敗");
      }
    } catch (error) {
      console.error("Failed to save GA config:", error);
      alert("保存失敗");
    }
  };

  const testGA = async () => {
    try {
      const response = await fetch("/api/admin/settings/ga/test", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`測試結果: ${result.success ? "連接成功" : "連接失敗"}`);
      }
    } catch (error) {
      console.error("GA test failed:", error);
      alert("測試失敗");
    }
  };

  const syncData = async () => {
    try {
      const response = await fetch("/api/admin/reports/analytics/sync", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("數據同步完成");
        await loadGAConfig();
      } else {
        alert("同步失敗");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      alert("同步失敗");
    }
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

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Google Analytics 整合</h1>
            <p className="mt-1 text-sm text-gray-600">
              設定和管理 Google Analytics 數據追蹤
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {gaConfig.connected ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="w-4 h-4 mr-1" />
                已連接
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                未連接
              </span>
            )}
          </div>
        </div>

        {/* GA Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiSettings className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">基本設定</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={measurementId}
                onChange={(e) => setMeasurementId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                請輸入您的 Google Analytics 4 測量 ID
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={saveGAConfig}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                保存設定
              </button>
              <button
                onClick={testGA}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                測試連接
              </button>
              {gaConfig.connected && (
                <button
                  onClick={syncData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  同步數據
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Event Tracking */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiCode className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">事件追蹤設定</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(gaConfig.events).map(([eventKey, enabled]) => {
              const eventLabels = {
                pageViews: "頁面瀏覽",
                purchases: "購買完成",
                addToCart: "加入購物車",
                signUp: "註冊",
                login: "登入",
              };

              return (
                <div key={eventKey} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {eventLabels[eventKey as keyof typeof eventLabels]}
                    </span>
                    <p className="text-xs text-gray-500">
                      追蹤用戶 {eventLabels[eventKey as keyof typeof eventLabels]} 事件
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) =>
                        setGaConfig((prev) => ({
                          ...prev,
                          events: {
                            ...prev.events,
                            [eventKey]: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status and Stats */}
        {gaConfig.connected && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">連接狀態</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {gaConfig.connected ? "已連接" : "未連接"}
                </div>
                <div className="text-sm text-gray-600">連接狀態</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {gaConfig.measurementId || "未設定"}
                </div>
                <div className="text-sm text-gray-600">測量 ID</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {gaConfig.lastSync
                    ? new Date(gaConfig.lastSync).toLocaleDateString()
                    : "從未同步"}
                </div>
                <div className="text-sm text-gray-600">最後同步</div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Guide */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">整合指南</h3>
          <div className="prose text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>登入 Google Analytics 並創建新的 GA4 屬性</li>
              <li>獲取您的測量 ID (格式: G-XXXXXXXXXX)</li>
              <li>將測量 ID 輸入上方設定欄位並保存</li>
              <li>點擊"測試連接"確認設定正確</li>
              <li>選擇您想要追蹤的事件類型</li>
              <li>點擊"同步數據"開始數據收集</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800">
                <strong>注意:</strong> 設定完成後，數據可能需要 24-48 小時才會在 Google Analytics 中顯示。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GAIntegrationPage;
