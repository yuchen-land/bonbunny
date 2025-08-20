"use client";

import { FC, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import { Product, ProductCategory } from "@/app/types";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

interface SearchFilters {
  q: string;
  category: ProductCategory | "";
  minPrice: string;
  maxPrice: string;
  inStock: boolean | null;
  sortBy: "name" | "price" | "createdAt" | "popularity";
  sortOrder: "asc" | "desc";
}

interface SearchResult {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    availableCategories: ProductCategory[];
    priceRange: { min: number; max: number };
    appliedFilters: any;
  };
}

const SearchPage: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    q: searchParams.get("q") || "",
    category: (searchParams.get("category") as ProductCategory) || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") ? searchParams.get("inStock") === "true" : null,
    sortBy: (searchParams.get("sortBy") as "name" | "price" | "createdAt" | "popularity") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Load search results
  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "12");

      const response = await fetch(`/api/products/search?${queryParams.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setSearchResult(result);
      } else {
        console.error("Search failed:", result.error);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Update URL
    const queryParams = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    router.push(`/search?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      q: filters.q, // Keep search query
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    router.push(`/search?q=${filters.q}`);
  };

  const getCategoryDisplayName = (category: ProductCategory): string => {
    const categoryNames: Record<ProductCategory, string> = {
      [ProductCategory.CAKE]: "蛋糕",
      [ProductCategory.COOKIE]: "餅乾",
      [ProductCategory.BREAD]: "麵包",
      [ProductCategory.PASTRY]: "糕點",
      [ProductCategory.DRINK]: "飲品",
      [ProductCategory.GIFT_SET]: "禮盒",
      [ProductCategory.OTHER]: "其他",
    };
    return categoryNames[category];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page.toString());
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">產品搜尋</h1>
          
          {/* Search Input */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋產品..."
                value={filters.q}
                onChange={(e) => updateFilters({ q: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <FaFilter />
              篩選
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品類別
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value as ProductCategory | "" })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">所有類別</option>
                    {searchResult?.filters.availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    價格範圍
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="最低價"
                      value={filters.minPrice}
                      onChange={(e) => updateFilters({ minPrice: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      type="number"
                      placeholder="最高價"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    庫存狀態
                  </label>
                  <select
                    value={filters.inStock === null ? "" : filters.inStock.toString()}
                    onChange={(e) => 
                      updateFilters({ 
                        inStock: e.target.value === "" ? null : e.target.value === "true" 
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">全部</option>
                    <option value="true">有庫存</option>
                    <option value="false">缺貨</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序方式
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value as "name" | "price" | "createdAt" | "popularity" })}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="createdAt">新品</option>
                      <option value="name">名稱</option>
                      <option value="price">價格</option>
                      <option value="popularity">熱門</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => updateFilters({ sortOrder: e.target.value as "asc" | "desc" })}
                      className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="desc">降序</option>
                      <option value="asc">升序</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <FaTimes />
                  清除篩選
                </button>
              </div>
            </div>
          )}

          {/* Search Results Info */}
          {searchResult && (
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                找到 {searchResult.pagination.totalProducts} 個商品
                {filters.q && <span> 關於 "{filters.q}"</span>}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">搜尋中...</div>
          </div>
        )}

        {/* Search Results */}
        {searchResult && !loading && (
          <>
            {searchResult.products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {searchResult.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {searchResult.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!searchResult.pagination.hasPrevPage}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一頁
                    </button>
                    
                    <span className="px-4 py-2 text-gray-600">
                      第 {currentPage} 頁，共 {searchResult.pagination.totalPages} 頁
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!searchResult.pagination.hasNextPage}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一頁
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500 text-lg mb-4">沒有找到符合條件的商品</div>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  清除篩選條件
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
