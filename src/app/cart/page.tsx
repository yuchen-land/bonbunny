"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useCartStore } from "../store/cart";
import { FaTrash } from "react-icons/fa";

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
        <SummaryRow>
          <SummaryLabel>總計</SummaryLabel>
          <SummaryValue className="total">NT$ {total}</SummaryValue>
        </SummaryRow>{" "}
        <CheckoutButton onClick={() => (window.location.href = "/checkout")}>
          前往結帳
        </CheckoutButton>
      </CartSummary>
    </Container>
  );
};

export default CartPage;
