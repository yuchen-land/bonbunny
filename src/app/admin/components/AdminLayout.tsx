"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiMail,
  FiPercent,
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: FiHome, label: "儀表板", href: "/admin" },
    { icon: FiBox, label: "商品管理", href: "/admin/products" },
    { icon: FiShoppingBag, label: "訂單管理", href: "/admin/orders" },
    { icon: FiUsers, label: "會員管理", href: "/admin/users" },
    { icon: FiPercent, label: "優惠券管理", href: "/admin/coupons" },
    { icon: FiBarChart, label: "銷售報表", href: "/admin/reports" },
    { icon: FiPieChart, label: "用戶分析", href: "/admin/analytics" },
    { icon: FiTrendingUp, label: "GA整合", href: "/admin/ga" },
    { icon: FiMail, label: "郵件測試", href: "/admin/email-test" },
    { icon: FiSettings, label: "設定", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">BonBunny Admin</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                  isActive ? "bg-gray-50 border-r-4 border-pink-500" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 主要內容區 */}
      <main className="ml-64 min-h-screen">
        {/* 頂部導航 */}
        <header className="bg-white h-16 px-6 flex items-center justify-end shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">管理員</span>
            <button
              className="text-gray-700 hover:text-gray-900"
              onClick={() => {
                /* 登出邏輯 */
              }}
            >
              登出
            </button>
          </div>
        </header>

        {/* 頁面內容 */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
