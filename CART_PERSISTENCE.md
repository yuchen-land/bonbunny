# 購物車持久化功能 (Cart Persistence)

本功能解決了購物車在頁面刷新後會清空以及未登入用戶購物車不會保存的問題。

## 實現功能

### ✅ 已實現的功能

1. **自動保存購物車** - 使用 localStorage 自動保存購物車內容
2. **頁面刷新不丟失** - 重新整理頁面後購物車內容依然存在
3. **未登入用戶支援** - 不需要登入即可保存購物車內容
4. **自動計算總金額** - 重新載入後自動重新計算總金額
5. **購物車清空** - 訂單完成後自動清空購物車
6. **水合處理** - 防止伺服器端與客戶端不一致的問題

### 🔧 技術實現

#### 1. Zustand 持久化中間件

```typescript
// src/app/store/cart.ts
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ... cart store implementation
    }),
    {
      name: "bonbunny-cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // 只保存商品項目
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.total = calculateTotal(state.items); // 重新計算總金額
        }
      },
    }
  )
);
```

#### 2. 水合鉤子 (Hydration Hook)

```typescript
// src/app/store/useCartHydration.ts
export const useCartHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    setIsHydrated(true); // 客戶端渲染後標記為已水合
  }, []);

  return {
    isHydrated,
    cartItems: isHydrated ? cartStore.items : [],
    cartTotal: isHydrated ? cartStore.total : 0,
    cartItemCount: isHydrated ? cartStore.items.length : 0,
  };
};
```

#### 3. 持久化工具函數

```typescript
// src/app/store/cartPersistence.ts
- initializeCartPersistence() - 初始化購物車持久化
- getCartItemCountFromStorage() - 從 localStorage 獲取購物車數量
- clearCartStorage() - 清除購物車存儲
- migrateCartData() - 處理資料格式遷移
```

#### 4. 自動初始化

```typescript
// src/app/ClientLayout.tsx
useEffect(() => {
  try {
    migrateCartData(); // 處理資料遷移
    initializeCartPersistence(); // 初始化持久化
  } catch (error) {
    console.error("Failed to initialize cart persistence:", error);
  }
}, []);
```

#### 5. 訂單完成後清空購物車

```typescript
// src/app/checkout/page.tsx
const { items, total, clearCart } = useCartStore();

// 在訂單創建成功後
if (orderCreated) {
  clearCart(); // 清空購物車
  router.push(`/checkout/confirmation/${orderId}`);
}
```

### 📱 用戶體驗改善

1. **即時保存** - 任何購物車操作都會立即保存到 localStorage
2. **無縫體驗** - 用戶無需感知購物車的保存和載入過程
3. **防止錯誤** - 使用水合鉤子防止 SSR 不一致錯誤
4. **自動恢復** - 頁面重新載入時自動恢復購物車狀態

### 🔍 測試方法

1. **基本持久化測試**：

   ```
   1. 添加商品到購物車
   2. 重新整理頁面
   3. 確認購物車內容依然存在
   ```

2. **跨會話測試**：

   ```
   1. 添加商品到購物車
   2. 關閉瀏覽器
   3. 重新開啟瀏覽器訪問網站
   4. 確認購物車內容依然存在
   ```

3. **訂單完成清空測試**：

   ```
   1. 添加商品到購物車
   2. 完成結帳流程
   3. 確認購物車已清空
   ```

4. **未登入用戶測試**：
   ```
   1. 未登入狀態下添加商品
   2. 重新整理頁面
   3. 確認購物車內容依然存在
   ```

### 📦 相關檔案

- `src/app/store/cart.ts` - 購物車 store 實現
- `src/app/store/cartPersistence.ts` - 持久化工具函數
- `src/app/store/useCartHydration.ts` - 水合鉤子
- `src/app/ClientLayout.tsx` - 應用初始化
- `src/app/components/Navbar.tsx` - 購物車數量顯示
- `src/app/checkout/page.tsx` - 結帳頁面清空購物車

### 🛠️ 維護注意事項

1. **資料格式變更** - 如果購物車資料結構需要更改，請更新 `migrateCartData` 函數
2. **localStorage 限制** - 注意 localStorage 5MB 大小限制
3. **隱私模式** - 私人瀏覽模式下 localStorage 可能不可用，應有適當的錯誤處理
4. **跨域限制** - 不同域名下的 localStorage 是獨立的

### 🔮 未來改進

1. **壓縮存儲** - 可以考慮壓縮購物車資料以節省空間
2. **資料加密** - 可以考慮加密敏感的購物車資料
3. **雲端同步** - 登入用戶可以考慮與伺服器同步購物車資料
4. **過期清理** - 可以設定購物車資料的過期時間

## 總結

購物車持久化功能成功解決了用戶體驗中的重要問題，讓用戶可以安心地瀏覽網站而不用擔心購物車內容丟失。該實現使用了現代的 React 和 Zustand 最佳實踐，提供了穩定可靠的用戶體驗。
