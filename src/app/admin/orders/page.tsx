"use client";

import { FC, useState } from "react";
import { FiEye } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { Order, ProductCategory, ProductStatus } from "@/app/types";

// 模擬訂單數據
const mockOrders: Order[] = [
  {
    id: "ORD001",
    items: [
      {
        id: "1",
        name: "草莓蛋糕",
        description: "新鮮草莓與奶油的完美結合",
        price: 580,
        images: ["/images/strawberry-cake.jpg"],
        category: ProductCategory.CAKE,
        status: ProductStatus.ACTIVE,
        stock: 10,
        quantity: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    shippingInfo: {
      fullName: "王小明",
      email: "wang@example.com",
      phone: "0912345678",
      address: {
        street: "中山路 1 號",
        city: "taipei",
        district: "中正區",
        postalCode: "100",
      },
    },
    paymentInfo: {},
    status: "pending",
    total: 580,
    createdAt: "2025-06-19T10:00:00.000Z",
  },
];

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">訂單管理</h1>

        {/* 訂單列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  訂單編號
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客戶資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  訂單金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  建立時間
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.shippingInfo.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.shippingInfo.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    NT$ {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as Order["status"]
                        )
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    >
                      <option value="pending">待處理</option>
                      <option value="paid">已付款</option>
                      <option value="shipped">已出貨</option>
                      <option value="delivered">已送達</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 訂單詳情對話框 */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                訂單詳情 #{selectedOrder.id}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">客戶資訊</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>姓名：{selectedOrder.shippingInfo.fullName}</p>
                    <p>電話：{selectedOrder.shippingInfo.phone}</p>
                    <p>Email：{selectedOrder.shippingInfo.email}</p>
                    <p>
                      地址：
                      {`${selectedOrder.shippingInfo.address.city} ${selectedOrder.shippingInfo.address.district} ${selectedOrder.shippingInfo.address.street}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">商品明細</h3>
                  <div className="mt-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="ml-4">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              數量：{item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">
                          NT$ {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">總計</p>
                      <p className="text-sm font-medium">
                        NT$ {selectedOrder.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
