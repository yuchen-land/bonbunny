"use client";

import { FC, useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiBox } from "react-icons/fi";
import AdminLayout from "../components/AdminLayout";
import { Product, ProductCategory, ProductStatus } from "@/app/types";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  subCategory?: string;
  stock: number;
  status: ProductStatus;
  specifications?: Record<string, string>;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: Record<string, number>;
  isRecommended?: boolean;
  displayOrder?: number;
}

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
  images: [],
  category: ProductCategory.OTHER,
  stock: 0,
  status: ProductStatus.DRAFT,
};

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | ""
  >("");
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");

  // 載入商品列表
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError("載入商品列表失敗");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedStatus]);

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = selectedProduct
        ? `/api/admin/products/${selectedProduct.id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method: selectedProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save product");

      await fetchProducts();
      setIsModalOpen(false);
      setForm(initialForm);
      setSelectedProduct(null);
    } catch (err) {
      setError("儲存商品失敗");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理刪除商品
  const handleDelete = async (product: Product) => {
    if (!confirm("確定要刪除此商品？")) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      await fetchProducts();
    } catch (err) {
      setError("刪除商品失敗");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理庫存更新
  const handleStockUpdate = async (productId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error("Failed to update stock");

      await fetchProducts();
    } catch (err) {
      setError("更新庫存失敗");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">商品管理</h1>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setForm(initialForm);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <FiPlus />
            新增商品
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="搜尋商品..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ProductCategory | "")
            }
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分類</option>
            {Object.values(ProductCategory).map((category) => (
              <option key={category} value={category}>
                {category === ProductCategory.CAKE
                  ? "蛋糕"
                  : category === ProductCategory.COOKIE
                  ? "餅乾"
                  : category === ProductCategory.BREAD
                  ? "麵包"
                  : category === ProductCategory.PASTRY
                  ? "糕點"
                  : category === ProductCategory.DRINK
                  ? "飲品"
                  : category === ProductCategory.GIFT_SET
                  ? "禮盒"
                  : "其他"}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ProductStatus | "")
            }
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部狀態</option>
            {Object.values(ProductStatus).map((status) => (
              <option key={status} value={status}>
                {status === ProductStatus.DRAFT
                  ? "草稿"
                  : status === ProductStatus.ACTIVE
                  ? "上架中"
                  : status === ProductStatus.INACTIVE
                  ? "下架"
                  : status === ProductStatus.SOLDOUT
                  ? "售罄"
                  : "已刪除"}
              </option>
            ))}
          </select>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    價格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    庫存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        NT$ {product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => {
                            const quantity = parseInt(
                              prompt("請輸入要增加的庫存數量") || "0"
                            );
                            if (quantity)
                              handleStockUpdate(product.id, quantity);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <FiBox />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === ProductStatus.ACTIVE
                            ? "bg-green-100 text-green-800"
                            : product.status === ProductStatus.DRAFT
                            ? "bg-yellow-100 text-yellow-800"
                            : product.status === ProductStatus.INACTIVE
                            ? "bg-gray-100 text-gray-800"
                            : product.status === ProductStatus.SOLDOUT
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status === ProductStatus.ACTIVE
                          ? "上架中"
                          : product.status === ProductStatus.DRAFT
                          ? "草稿"
                          : product.status === ProductStatus.INACTIVE
                          ? "下架"
                          : product.status === ProductStatus.SOLDOUT
                          ? "售罄"
                          : "已刪除"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setForm(product);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
              <h2 className="text-lg font-medium mb-4">
                {selectedProduct ? "編輯商品" : "新增商品"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      商品名稱
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      價格
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      分類
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value as ProductCategory,
                        })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                    >
                      {Object.values(ProductCategory).map((category) => (
                        <option key={category} value={category}>
                          {category === ProductCategory.CAKE
                            ? "蛋糕"
                            : category === ProductCategory.COOKIE
                            ? "餅乾"
                            : category === ProductCategory.BREAD
                            ? "麵包"
                            : category === ProductCategory.PASTRY
                            ? "糕點"
                            : category === ProductCategory.DRINK
                            ? "飲品"
                            : category === ProductCategory.GIFT_SET
                            ? "禮盒"
                            : "其他"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      狀態
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as ProductStatus,
                        })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                    >
                      {Object.values(ProductStatus).map((status) => (
                        <option key={status} value={status}>
                          {status === ProductStatus.DRAFT
                            ? "草稿"
                            : status === ProductStatus.ACTIVE
                            ? "上架中"
                            : status === ProductStatus.INACTIVE
                            ? "下架"
                            : status === ProductStatus.SOLDOUT
                            ? "售罄"
                            : "已刪除"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      描述
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      圖片網址
                    </label>
                    <input
                      type="text"
                      value={form.images[0] || ""}
                      onChange={(e) =>
                        setForm({ ...form, images: [e.target.value] })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      庫存
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: Number(e.target.value) })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      食材列表（用逗號分隔）
                    </label>
                    <input
                      type="text"
                      value={form.ingredients?.join(", ") || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          ingredients: e.target.value
                            .split(",")
                            .map((i) => i.trim())
                            .filter(Boolean),
                        })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      placeholder="例如：麵粉, 糖, 奶油"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      過敏原（用逗號分隔）
                    </label>
                    <input
                      type="text"
                      value={form.allergens?.join(", ") || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          allergens: e.target.value
                            .split(",")
                            .map((a) => a.trim())
                            .filter(Boolean),
                        })
                      }
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                      placeholder="例如：麩質, 蛋, 奶製品"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isRecommended || false}
                        onChange={(e) =>
                          setForm({ ...form, isRecommended: e.target.checked })
                        }
                        className="rounded text-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        設為推薦商品
                      </span>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedProduct(null);
                      setForm(initialForm);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      "儲存"
                    )}
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

export default ProductsPage;
