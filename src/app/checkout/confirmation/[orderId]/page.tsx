"use client";

import { FC } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

const Container = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  color: #4caf50;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const OrderId = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  span {
    font-weight: bold;
    color: #ff6b6b;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;

  &.primary {
    background-color: #ff6b6b;
    color: white;

    &:hover {
      background-color: #ff5252;
    }
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #666;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const OrderConfirmationPage: FC = () => {
  const params = useParams();
  const orderId = params.orderId;

  return (
    <Container>
      <SuccessIcon>
        <FaCheckCircle size={64} />
      </SuccessIcon>
      <Title>訂單已成功送出！</Title>
      <Message>感謝您的購買。我們將盡快處理您的訂單。</Message>
      <OrderId>
        訂單編號：<span>{orderId}</span>
      </OrderId>
      <Message>我們已將訂單確認信寄送至您的信箱，請查收。</Message>
      <ButtonContainer>
        <Button href="/" className="secondary">
          返回首頁
        </Button>
        <Button href={`/orders/${orderId}`} className="primary">
          查看訂單
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default OrderConfirmationPage;
