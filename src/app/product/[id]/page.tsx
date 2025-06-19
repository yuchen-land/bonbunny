"use client";

import { FC } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useParams } from "next/navigation";
import { useCartStore } from "@/app/store/cart";
import { Product, ProductCategory, ProductStatus } from "@/app/types";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const ProductWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
`;

const Price = styled.div`
  font-size: 1.5rem;
  color: #ff6b6b;
  font-weight: bold;
`;

const AddToCartButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5252;
  }
`;

// 模擬產品數據
const mockProducts = [
  {
    id: "1",
    name: "草莓巧克力蛋糕",
    description:
      "新鮮草莓搭配濃郁巧克力，完美融合的美味。每一口都能感受到新鮮草莓的香甜與巧克力的濃郁。我們精心挑選高品質的巧克力，搭配當季的草莓，創造出這款經典的甜點。蛋糕體使用法國進口奶油，口感綿密細緻，是下午茶時光的最佳選擇。",
    price: 580,
    images: ["/images/strawberry-cake.jpg"],
    category: ProductCategory.CAKE,
    stock: 10,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "伯爵茶餅乾",
    description:
      "香濃伯爵茶香配上酥脆餅乾，下午茶的完美選擇。使用斯里蘭卡進口的優質伯爵茶葉，讓茶香完美滲入餅乾中。餅乾採用傳統歐式配方，口感酥脆，茶香濃郁。包裝精美，既適合自己享用，也是送禮的好選擇。",
    price: 280,
    images: ["/images/earl-grey-cookies.jpg"],
    category: ProductCategory.COOKIE,
    stock: 10,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "法式牛角麵包",
    description:
      "層層酥脆，使用頂級奶油製作的經典法式麵包。我們的牛角麵包採用傳統法式製作方法，需要72小時的製作過程。使用法國進口的AOP認證奶油，層層疊疊，烤成金黃色後外酥內軟，散發出濃郁的奶油香氣。",
    price: 220,
    images: ["/images/croissant.jpg"],
    category: ProductCategory.BREAD,
    stock: 10,
    status: ProductStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProductDetail: FC = () => {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);

  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return <Container>找不到此商品</Container>;
  }

  return (
    <Container>
      <ProductWrapper>
        <ImageWrapper>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </ImageWrapper>
        <ProductInfo>
          <Title>{product.name}</Title>
          <Description>{product.description}</Description>
          <Price>NT$ {product.price}</Price>
          <AddToCartButton onClick={() => addItem(product)}>
            加入購物車
          </AddToCartButton>
        </ProductInfo>
      </ProductWrapper>
    </Container>
  );
};

export default ProductDetail;
