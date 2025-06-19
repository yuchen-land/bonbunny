"use client";

import { useEffect, FC, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useAuthStore } from "../store/auth";
import { useFavoritesStore } from "../store/favorites";
import type { User } from "../types";
import ProductCard from "../components/ProductCard";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const MainContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li<{ active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#ff6b6b" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#666")};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#ff5252" : "#f0f0f0")};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #666;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;

  &:hover {
    background-color: #ff5252;
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;

  &:hover {
    border-color: #ff6b6b;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const OrderId = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const OrderStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  background-color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#fff3cd";
      case "paid":
        return "#d4edda";
      case "shipped":
        return "#cce5ff";
      case "delivered":
        return "#d1e7dd";
      case "cancelled":
        return "#f8d7da";
      default:
        return "#eee";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#856404";
      case "paid":
        return "#155724";
      case "shipped":
        return "#004085";
      case "delivered":
        return "#0f5132";
      case "cancelled":
        return "#721c24";
      default:
        return "#666";
    }
  }};
`;

const OrderItems = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin: 2rem 0;
`;

type TabName = "profile" | "orders" | "favorites";

const ProfilePage: FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const { favorites, loadFavorites } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<TabName>("profile");
  const [formData, setFormData] = useState<
    Partial<Omit<User, "id" | "email" | "orders" | "favorites">>
  >({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || {
      street: "",
      city: "",
      district: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
        address: user.address || {
          street: "",
          city: "",
          district: "",
          postalCode: "",
        },
      });
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    }
  }, [isAuthenticated, user]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    alert("個人資料已更新");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [
        keyof typeof formData,
        string
      ];
      if (parent === "address" && formData.address) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address!,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as keyof typeof formData]: value,
      }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <Title>個人資料</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>姓名</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>電話</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>街道地址</Label>
                <Input
                  type="text"
                  name="address.street"
                  value={formData.address?.street || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>城市</Label>
                <Input
                  type="text"
                  name="address.city"
                  value={formData.address?.city || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>區域</Label>
                <Input
                  type="text"
                  name="address.district"
                  value={formData.address?.district || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>郵遞區號</Label>
                <Input
                  type="text"
                  name="address.postalCode"
                  value={formData.address?.postalCode || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <Button type="submit">更新資料</Button>
            </Form>
          </>
        );
      case "orders":
        return (
          <>
            <Title>訂單紀錄</Title>
            <OrderList>
              {user.orders ? (
                user.orders.map((order) => (
                  <OrderCard key={order.id}>
                    <OrderHeader>
                      <OrderId>訂單編號：{order.id}</OrderId>
                      <OrderStatus status={order.status}>
                        {order.status === "pending" && "待處理"}
                        {order.status === "paid" && "已付款"}
                        {order.status === "shipped" && "運送中"}
                        {order.status === "delivered" && "已送達"}
                        {order.status === "cancelled" && "已取消"}
                      </OrderStatus>
                    </OrderHeader>
                    <div>總金額：NT$ {order.total}</div>
                    <OrderItems>
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </OrderItems>
                  </OrderCard>
                ))
              ) : (
                <p>尚無訂單記錄</p>
              )}
            </OrderList>
          </>
        );
      case "favorites":
        return (
          <>
            <Title>收藏商品</Title>
            {favorites.length > 0 ? (
              <FavoritesGrid>
                {favorites.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </FavoritesGrid>
            ) : (
              <EmptyMessage>您還沒有收藏任何商品</EmptyMessage>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar>
        <NavList>
          <NavItem
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            個人資料
          </NavItem>
          <NavItem
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          >
            訂單紀錄
          </NavItem>
          <NavItem
            active={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          >
            收藏商品
          </NavItem>
        </NavList>
      </Sidebar>
      <MainContent>{renderContent()}</MainContent>
    </Container>
  );
};

export default ProfilePage;
