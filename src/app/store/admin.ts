import { create } from "zustand";
import { User } from "../types";

interface AdminState {
  users: User[];
  error: string | null;
  isLoading: boolean;
  selectedUser: User | null;
  fetchUsers: () => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  error: null,
  isLoading: false,
  selectedUser: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("無法取得會員資料");
      }

      const users = await response.json();
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("無法更新會員資料");
      }

      const updatedUser = await response.json();
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));
