import { User, Order, Product, ProductCategory, ProductStatus } from "../types";
import { Coupon } from "../types/coupon";

// Mock database
class Database {
  private static instance: Database;
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private products: Map<string, Product>;
  private coupons: Map<string, Coupon>;
  private settings: Map<string, any>;

  private constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.products = new Map();
    this.coupons = new Map();
    this.settings = new Map();
    this.initializeData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initializeData() {
    // Initialize some test data
    const products: Product[] = [
      {
        id: "1",
        name: "草莓鮮奶油蛋糕",
        description: "新鮮草莓配上香濃鮮奶油，口感綿密清爽",
        price: 880,
        images: ["/images/strawberry-cake.jpg"],
        category: ProductCategory.CAKE,
        stock: 10,
        status: ProductStatus.ACTIVE,
        ingredients: ["草莓", "鮮奶油", "蛋糕胚", "糖"],
        allergens: ["蛋", "奶"],
        nutritionalInfo: {
          calories: 289,
          protein: 4.5,
          fat: 15.2,
          carbohydrate: 35.1,
        },
        isRecommended: true,
        displayOrder: 1,
        createdAt: new Date("2025-05-01").toISOString(),
        updatedAt: new Date("2025-05-01").toISOString(),
      },
      {
        id: "2",
        name: "伯爵茶餅乾",
        description: "使用有機伯爵茶葉製成，香氣十足",
        price: 320,
        images: ["/images/earl-grey-cookies.jpg"],
        category: ProductCategory.COOKIE,
        stock: 50,
        status: ProductStatus.ACTIVE,
        ingredients: ["麵粉", "奶油", "糖", "伯爵茶葉"],
        allergens: ["麩質", "奶"],
        nutritionalInfo: {
          calories: 140,
          protein: 2.1,
          fat: 7.5,
          carbohydrate: 18.3,
        },
        isRecommended: true,
        displayOrder: 2,
        createdAt: new Date("2025-05-02").toISOString(),
        updatedAt: new Date("2025-05-02").toISOString(),
      },
    ];

    products.forEach((product) => {
      this.products.set(product.id, product);
    });

    // Initialize default admin user
    const adminUser: User = {
      id: "admin-001",
      email: "admin@bonbunny.com",
      name: "管理員",
      password: "$2a$10$vx65933cN9jIoS1JL4ian.6XdaRp0.9kokzjdQZWp/.Ir4gk49JUW", // hashed "admin123"
      role: "admin",
      createdAt: new Date().toISOString(),
      isAdmin: true, // For backward compatibility
    };

    this.users.set(adminUser.id, adminUser);
  }

  // User operations
  public async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  public async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return (
      Array.from(this.users.values()).find((user) => user.email === email) ||
      null
    );
  }

  public async createUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  public async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<User | null> {
    const user = await this.getUserById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  public async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Order operations
  public async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  public async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.shippingInfo.userId === userId
    );
  }

  public async createOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  public async updateOrder(
    id: string,
    data: Partial<Order>
  ): Promise<Order | null> {
    const order = await this.getOrderById(id);
    if (!order) return null;

    const updatedOrder = { ...order, ...data };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Product operations
  public async getProducts(
    options: {
      category?: ProductCategory;
      status?: ProductStatus;
      isRecommended?: boolean;
      search?: string;
      sort?: "price" | "createdAt" | "displayOrder";
      order?: "asc" | "desc";
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ products: Product[]; total: number }> {
    let filteredProducts = Array.from(this.products.values());

    // Filter by conditions
    if (options.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === options.category
      );
    }

    if (options.status) {
      filteredProducts = filteredProducts.filter(
        (p) => p.status === options.status
      );
    }

    if (options.isRecommended !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.isRecommended === options.isRecommended
      );
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (options.sort) {
      filteredProducts.sort((a, b) => {
        const aValue = a[options.sort!] as number | string;
        const bValue = b[options.sort!] as number | string;
        const order = options.order === "desc" ? -1 : 1;
        return aValue > bValue ? order : -order;
      });
    }

    // Pagination
    const total = filteredProducts.length;
    if (options.limit) {
      const start = options.offset || 0;
      filteredProducts = filteredProducts.slice(start, start + options.limit);
    }

    return { products: filteredProducts, total };
  }

  public async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  public async createProduct(
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  public async updateProduct(
    id: string,
    data: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.getProductById(id);
    if (!product) return null;

    const updatedProduct = { ...product, ...data };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProductById(id);
    if (!product) return false;

    // Soft delete: set status to deleted
    product.status = ProductStatus.DELETED;
    product.updatedAt = new Date().toISOString();
    return true;
  }

  // Stock related operations
  public async updateStock(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product) return false;

    const newStock = product.stock + quantity;
    if (newStock < 0) return false;

    product.stock = newStock;
    product.status = newStock === 0 ? ProductStatus.SOLDOUT : product.status;
    product.updatedAt = new Date().toISOString();
    return true;
  }

  // Coupon operations
  public async getCoupons(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }

  public async getCouponById(id: string): Promise<Coupon | null> {
    return this.coupons.get(id) || null;
  }

  public async getCouponByCode(code: string): Promise<Coupon | null> {
    return (
      Array.from(this.coupons.values()).find(
        (coupon) => coupon.code.toLowerCase() === code.toLowerCase()
      ) || null
    );
  }

  public async createCoupon(coupon: Coupon): Promise<Coupon> {
    this.coupons.set(coupon.id, coupon);
    return coupon;
  }

  public async updateCoupon(
    id: string,
    data: Partial<Coupon>
  ): Promise<Coupon | null> {
    const coupon = await this.getCouponById(id);
    if (!coupon) return null;

    const updatedCoupon = { ...coupon, ...data };
    this.coupons.set(id, updatedCoupon);
    return updatedCoupon;
  }

  public async deleteCoupon(id: string): Promise<boolean> {
    return this.coupons.delete(id);
  }

  // Settings operations
  public async getSetting(key: string): Promise<any> {
    return this.settings.get(key);
  }

  public async setSetting(key: string, value: any): Promise<void> {
    this.settings.set(key, value);
  }

  public async getAllSettings(): Promise<Record<string, any>> {
    const settings: Record<string, any> = {};
    this.settings.forEach((value, key) => {
      settings[key] = value;
    });
    return settings;
  }
}

export const db = Database.getInstance();
