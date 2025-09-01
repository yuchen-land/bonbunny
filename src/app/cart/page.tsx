"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useCartStore } from "../store/cart";
import { FaTrash, FaTag } from "react-icons/fa";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const CartEmpty = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const EmptyMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  background-color: #ff6b6b;
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5252;
  }
`;

const CartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  color: #ff6b6b;
  font-weight: bold;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  min-width: 40px;
  text-align: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ff5252;
  }
`;

const CartSummary = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: 1.1rem;
  color: #666;
`;

const SummaryValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;

  &.total {
    color: #ff6b6b;
    font-size: 1.4rem;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-top: 1rem;
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

const CartPage: FC = () => {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("請輸入優惠券代碼");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          orderTotal: total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "套用優惠券失敗");
      }

      setAppliedCoupon(result.coupon);
      setDiscountAmount(result.discountAmount);
      setCouponCode("");
      setCouponError("");
    } catch (error) {
      console.error("Apply coupon error:", error);
      setCouponError(error instanceof Error ? error.message : "套用優惠券失敗");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError("");
  };

  const finalTotal = total - discountAmount;

  if (items.length === 0) {
    return (
      <Container>
        <CartEmpty>
          <EmptyMessage>您的購物車是空的</EmptyMessage>
          <ContinueShoppingButton href="/">繼續購物</ContinueShoppingButton>
        </CartEmpty>
      </Container>
    );
  }

  return (
    <Container>
      <Title>購物車</Title>
      <CartList>
        {items.map((item) => (
          <CartItem key={item.id}>
            <ImageWrapper>
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </ImageWrapper>
            <ItemInfo>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>NT$ {item.price}</ItemPrice>
              <QuantityControl>
                <QuantityButton
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </QuantityButton>
                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                <QuantityButton
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </QuantityButton>
              </QuantityControl>
            </ItemInfo>
            <DeleteButton onClick={() => removeItem(item.id)}>
              <FaTrash size={20} />
            </DeleteButton>
          </CartItem>
        ))}
      </CartList>

      <CartSummary>
        <SummaryRow>
          <SummaryLabel>小計</SummaryLabel>
          <SummaryValue>NT$ {total}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>運費</SummaryLabel>
          <SummaryValue>NT$ 0</SummaryValue>
        </SummaryRow>

        {/* 優惠券區域 */}
        <div
          style={{
            margin: "1rem 0",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          {!appliedCoupon ? (
            <>
              <div
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaTag />
                輸入優惠券代碼
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="請輸入優惠券代碼"
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                  disabled={couponLoading}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ff6b6b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: couponLoading ? "not-allowed" : "pointer",
                    opacity: couponLoading || !couponCode.trim() ? 0.6 : 1,
                  }}
                >
                  {couponLoading ? "驗證中..." : "套用"}
                </button>
              </div>
              {couponError && (
                <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
                  {couponError}
                </div>
              )}
            </>
          ) : (
            <div>
              <div
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#28a745",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaTag />
                已套用優惠券：{appliedCoupon.code}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6c757d",
                  marginBottom: "0.5rem",
                }}
              >
                {appliedCoupon.name}
              </div>
              <button
                onClick={removeCoupon}
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                移除優惠券
              </button>
            </div>
          )}
        </div>

        {appliedCoupon && (
          <SummaryRow>
            <SummaryLabel>優惠折扣</SummaryLabel>
            <SummaryValue style={{ color: "#28a745" }}>
              -NT$ {discountAmount}
            </SummaryValue>
          </SummaryRow>
        )}

        <SummaryRow>
          <SummaryLabel>總計</SummaryLabel>
          <SummaryValue className="total">NT$ {finalTotal}</SummaryValue>
        </SummaryRow>
        <CheckoutButton onClick={() => (window.location.href = "/checkout")}>
          前往結帳
        </CheckoutButton>
      </CartSummary>
    </Container>
  );
};

export default CartPage;
