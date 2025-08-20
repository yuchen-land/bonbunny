"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useCartStore } from "../store/cart";
import type { ShippingInfo, PaymentMethod } from "../types";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const PaymentMethodContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PaymentMethodButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${(props) => (props.selected ? "#ff6b6b" : "#ddd")};
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#fff8f8" : "white")};
  color: ${(props) => (props.selected ? "#ff6b6b" : "#666")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff6b6b;
  }
`;

const OrderSummary = styled(Section)`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  font-weight: bold;
  color: #333;

  &.total {
    color: #ff6b6b;
    font-size: 1.2rem;
  }
`;

const SubmitButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CheckoutPage: FC = () => {
  const router = useRouter();
  const { items, total } = useCartStore();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      district: "",
      postalCode: "",
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [keyof ShippingInfo, string];
      if (parent === "address") {
        setShippingInfo((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setShippingInfo((prev) => ({
        ...prev,
        [name as keyof ShippingInfo]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName) {
      newErrors.fullName = "請輸入姓名";
    }
    if (!shippingInfo.email) {
      newErrors.email = "請輸入電子郵件";
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }
    if (!shippingInfo.phone) {
      newErrors.phone = "請輸入電話號碼";
    }
    if (!shippingInfo.address.street) {
      newErrors["address.street"] = "請輸入街道地址";
    }
    if (!shippingInfo.address.city) {
      newErrors["address.city"] = "請選擇城市";
    }
    if (!shippingInfo.address.district) {
      newErrors["address.district"] = "請輸入區域";
    }
    if (!shippingInfo.address.postalCode) {
      newErrors["address.postalCode"] = "請輸入郵遞區號";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 準備訂單資料
      const orderData = {
        items: items,
        shippingInfo,
        paymentMethod,
        total,
      };

      // 發送訂單到後端
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "創建訂單失敗");
      }

      // 儲存訂單資料到 localStorage（用於確認頁面顯示）
      localStorage.setItem(`order_${result.order.id}`, JSON.stringify(result.order));

      // 清空購物車
      // clearCart(); // 如果購物車 store 有此方法的話

      // 導向到訂單確認頁面
      router.push(`/checkout/confirmation/${result.order.id}`);
    } catch (error) {
      console.error("Order creation error:", error);
      alert(error instanceof Error ? error.message : "創建訂單時發生錯誤，請稍後再試。");
    }
  };

  return (
    <Container>
      <div>
        <Title>結帳</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>配送資訊</SectionTitle>
            <FormGroup>
              <Label>姓名</Label>
              <Input
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && (
                <ErrorMessage>{errors.fullName}</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>電子郵件</Label>
              <Input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>電話</Label>
              <Input
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>街道地址</Label>
              <Input
                type="text"
                name="address.street"
                value={shippingInfo.address.street}
                onChange={handleInputChange}
              />
              {errors["address.street"] && (
                <ErrorMessage>{errors["address.street"]}</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>城市</Label>
              <Select
                name="address.city"
                value={shippingInfo.address.city}
                onChange={handleInputChange}
              >
                <option value="">請選擇城市</option>
                <option value="taipei">台北市</option>
                <option value="newtaipei">新北市</option>
                <option value="taoyuan">桃園市</option>
              </Select>
              {errors["address.city"] && (
                <ErrorMessage>{errors["address.city"]}</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>區域</Label>
              <Input
                type="text"
                name="address.district"
                value={shippingInfo.address.district}
                onChange={handleInputChange}
              />
              {errors["address.district"] && (
                <ErrorMessage>{errors["address.district"]}</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <Label>郵遞區號</Label>
              <Input
                type="text"
                name="address.postalCode"
                value={shippingInfo.address.postalCode}
                onChange={handleInputChange}
              />
              {errors["address.postalCode"] && (
                <ErrorMessage>{errors["address.postalCode"]}</ErrorMessage>
              )}
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>付款方式</SectionTitle>
            <PaymentMethodContainer>
              <PaymentMethodButton
                type="button"
                selected={paymentMethod === "bank_transfer"}
                onClick={() => setPaymentMethod("bank_transfer")}
              >
                銀行轉帳（匯款）
              </PaymentMethodButton>
            </PaymentMethodContainer>
          </Section>
        </Form>
      </div>

      <OrderSummary>
        <SectionTitle>訂單摘要</SectionTitle>
        <SummaryItem>
          <SummaryLabel>商品總計</SummaryLabel>
          <SummaryValue>NT$ {total}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>運費</SummaryLabel>
          <SummaryValue>NT$ 0</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>總計</SummaryLabel>
          <SummaryValue className="total">NT$ {total}</SummaryValue>
        </SummaryItem>
        <SubmitButton type="submit" onClick={handleSubmit}>
          確認訂購
        </SubmitButton>
      </OrderSummary>
    </Container>
  );
};

export default CheckoutPage;
