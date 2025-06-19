"use client";

import { FC, useState, useEffect } from "react";
import { FiEye, FiLock, FiUnlock, FiLoader } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { User } from "@/app/types";
import { useAdminStore } from "@/app/store/admin";

const UsersPage: FC = () => {
  const {
    users,
    error,
    isLoading,
    selectedUser,
    fetchUsers,
    updateUser,
    setSelectedUser,
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  const handleToggleBlock = async (user: User) => {
    try {
      await updateUser(user.id, {
        isBlocked: !user.isBlocked,
      });
    } catch (error) {
      console.error("無法更新會員狀態:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">會員管理</h1>
          <div className="w-64">
            <input
              type="text"
              placeholder="搜尋會員..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    會員資料
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    聯絡方式
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    註冊日期
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    最後登入
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    狀態
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "未登入"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? "已封鎖" : "正常"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`${
                            user.isBlocked
                              ? "text-green-600 hover:text-green-800"
                              : "text-red-600 hover:text-red-800"
                          }`}
                        >
                          {user.isBlocked ? (
                            <FiUnlock className="w-5 h-5" />
                          ) : (
                            <FiLock className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  會員詳細資料
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    名稱: {selectedUser.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Email: {selectedUser.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    電話: {selectedUser.phone}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    註冊時間:{" "}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                  {selectedUser.address && (
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">地址:</p>
                      <p className="text-sm text-gray-500">
                        {selectedUser.address.postalCode}{" "}
                        {selectedUser.address.city}
                        {selectedUser.address.district}{" "}
                        {selectedUser.address.street}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
