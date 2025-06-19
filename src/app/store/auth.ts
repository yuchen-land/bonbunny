import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, LoginCredentials, RegisterData, User } from "../types";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (credentials: LoginCredentials): Promise<void> => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "登入失敗");
          }

          set({
            user: data.user,
            isAuthenticated: true,
            token: data.token,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("登入過程發生錯誤");
        }
      },

      register: async (data) => {
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "註冊失敗");
          }

          set({
            user: result.user,
            isAuthenticated: true,
            token: result.token,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("註冊過程發生錯誤");
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },

      updateProfile: async (data) => {
        try {
          const { token } = get();
          if (!token) throw new Error("未登入");

          const response = await fetch("/api/auth/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "更新資料失敗");
          }

          set({
            user: result.user,
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("更新資料過程發生錯誤");
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
