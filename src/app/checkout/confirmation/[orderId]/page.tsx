"use client";

import { FC, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import { FaCheckCircle, FaCopy, FaUpload } from "react-icons/fa";

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

const BankInfoSection = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
`;

const BankInfoTitle = styled.h3`
  color: #856404;
  margin-bottom: 1rem;
  text-align: center;
`;

const BankDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
`;

const BankLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

const BankValue = styled.span`
  color: #666;
  font-family: monospace;
`;

const CopyButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background-color: #5a6268;
  }
`;

const TransferReportSection = styled.div`
  background-color: #e7f3ff;
  border: 1px solid #b6d7ff;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
`;

const TransferReportTitle = styled.h3`
  color: #004085;
  margin-bottom: 1rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const HomeButton = styled(Link)`
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const CheckOrderButton = styled(Link)`
  background-color: #ff6b6b;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff5252;
  }
`;

interface TransferReportData {
  transferDate: string;
  transferTime: string;
  transferAmount: string;
  transferAccount: string;
  receiptFile: File | null;
}

const OrderConfirmationPage: FC = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  // 模擬從 localStorage 或 API 獲取訂單資料
  const [orderData, setOrderData] = useState<any>(null);
  const [isTransferReported, setIsTransferReported] = useState(false);
  const [transferReportData, setTransferReportData] =
    useState<TransferReportData>({
      transferDate: "",
      transferTime: "",
      transferAmount: "",
      transferAccount: "",
      receiptFile: null,
    });

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        // 首先嘗試從 localStorage 讀取（剛創建的訂單）
        const savedOrder = localStorage.getItem(`order_${orderId}`);
        if (savedOrder) {
          const order = JSON.parse(savedOrder);
          setOrderData(order);

          // 檢查是否已經提交過轉帳回報
          if (order.paymentInfo?.transferDetails?.isReported) {
            setIsTransferReported(true);
          }
          return;
        }

        // 如果 localStorage 沒有，則從 API 讀取
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (response.ok) {
          const order = await response.json();
          setOrderData(order);

          // 檢查是否已經提交過轉帳回報
          if (order.paymentInfo?.transferDetails?.isReported) {
            setIsTransferReported(true);
          }
        } else {
          // 如果 API 也沒有找到，設置默認資料
          setOrderData({
            id: orderId,
            paymentInfo: { method: "bank_transfer" },
            total: 1000,
            status: "pending",
          });
        }
      } catch (error) {
        console.error("Load order error:", error);
        // 發生錯誤時設置默認資料
        setOrderData({
          id: orderId,
          paymentInfo: { method: "bank_transfer" },
          total: 1000,
          status: "pending",
        });
      }
    };

    loadOrderData();
  }, [orderId]);

  const bankInfo = {
    bankName: "台灣銀行",
    bankCode: "004",
    accountNumber: "123-456-789012",
    accountName: "BonBunny 甜點工作室",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已複製到剪貼簿");
  };

  const handleTransferReportChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;

    if (name === "receiptFile" && files) {
      setTransferReportData((prev) => ({
        ...prev,
        receiptFile: files[0],
      }));
    } else {
      setTransferReportData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTransferReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證必填欄位
    if (
      !transferReportData.transferDate ||
      !transferReportData.transferTime ||
      !transferReportData.transferAmount ||
      !transferReportData.transferAccount
    ) {
      alert("請填寫所有必填欄位");
      return;
    }

    try {
      // 準備提交資料
      const reportData = {
        orderId,
        transferDate: transferReportData.transferDate,
        transferTime: transferReportData.transferTime,
        transferAmount: transferReportData.transferAmount,
        transferAccount: transferReportData.transferAccount,
        // 如果有檔案，這裡需要處理檔案上傳
        // receiptFile: transferReportData.receiptFile ? await uploadFile(transferReportData.receiptFile) : undefined,
      };

      // 提交到後端
      const response = await fetch("/api/orders/transfer-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "提交失敗");
      }

      // 模擬提交成功
      setIsTransferReported(true);

      // 清除 localStorage 中的臨時資料
      localStorage.removeItem(`transfer_report_${orderId}`);

      alert("匯款資訊已成功回報！我們將在收到款項後盡快處理您的訂單。");
    } catch (error) {
      console.error("Transfer report submission error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "提交轉帳資訊時發生錯誤，請稍後再試。"
      );
    }
  };

  if (!orderData) {
    return <Container>載入中...</Container>;
  }

  return (
    <Container>
      <SuccessIcon>
        <FaCheckCircle size={80} />
      </SuccessIcon>
      <Title>訂單建立成功！</Title>
      <Message>感謝您的購買。我們將盡快處理您的訂單。</Message>

      <OrderId>
        訂單編號：<span>{orderId}</span>
      </OrderId>

      <BankInfoSection>
        <BankInfoTitle>💰 匯款資訊</BankInfoTitle>
        <p
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#856404",
          }}
        >
          請使用以下銀行資訊進行轉帳，並在轉帳後填寫下方回報表單
        </p>

        <BankDetail>
          <BankLabel>銀行名稱：</BankLabel>
          <BankValue>{bankInfo.bankName}</BankValue>
          <CopyButton onClick={() => copyToClipboard(bankInfo.bankName)}>
            <FaCopy /> 複製
          </CopyButton>
        </BankDetail>

        <BankDetail>
          <BankLabel>銀行代碼：</BankLabel>
          <BankValue>{bankInfo.bankCode}</BankValue>
          <CopyButton onClick={() => copyToClipboard(bankInfo.bankCode)}>
            <FaCopy /> 複製
          </CopyButton>
        </BankDetail>

        <BankDetail>
          <BankLabel>帳戶號碼：</BankLabel>
          <BankValue>{bankInfo.accountNumber}</BankValue>
          <CopyButton onClick={() => copyToClipboard(bankInfo.accountNumber)}>
            <FaCopy /> 複製
          </CopyButton>
        </BankDetail>

        <BankDetail>
          <BankLabel>戶名：</BankLabel>
          <BankValue>{bankInfo.accountName}</BankValue>
          <CopyButton onClick={() => copyToClipboard(bankInfo.accountName)}>
            <FaCopy /> 複製
          </CopyButton>
        </BankDetail>

        <BankDetail>
          <BankLabel>轉帳金額：</BankLabel>
          <BankValue style={{ color: "#ff6b6b", fontWeight: "bold" }}>
            NT$ {orderData.total?.toLocaleString()}
          </BankValue>
          <CopyButton
            onClick={() => copyToClipboard(orderData.total?.toString())}
          >
            <FaCopy /> 複製
          </CopyButton>
        </BankDetail>
      </BankInfoSection>

      {!isTransferReported && (
        <TransferReportSection>
          <TransferReportTitle>📋 匯款回報</TransferReportTitle>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              color: "#004085",
            }}
          >
            完成轉帳後，請填寫以下資訊協助我們核對款項
          </p>

          <form onSubmit={handleTransferReportSubmit}>
            <FormGroup>
              <Label>轉帳日期 *</Label>
              <Input
                type="date"
                name="transferDate"
                value={transferReportData.transferDate}
                onChange={handleTransferReportChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>轉帳時間 *</Label>
              <Input
                type="time"
                name="transferTime"
                value={transferReportData.transferTime}
                onChange={handleTransferReportChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>轉帳金額 *</Label>
              <Input
                type="number"
                name="transferAmount"
                value={transferReportData.transferAmount}
                onChange={handleTransferReportChange}
                placeholder={`請輸入 ${orderData.total}`}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>轉出帳號後五碼 *</Label>
              <Input
                type="text"
                name="transferAccount"
                value={transferReportData.transferAccount}
                onChange={handleTransferReportChange}
                placeholder="例如：12345"
                maxLength={5}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>轉帳收據（選填）</Label>
              <FileInput
                type="file"
                name="receiptFile"
                accept="image/*,.pdf"
                onChange={handleTransferReportChange}
              />
            </FormGroup>

            <SubmitButton type="submit">
              <FaUpload /> 提交匯款資訊
            </SubmitButton>
          </form>
        </TransferReportSection>
      )}

      {isTransferReported && (
        <TransferReportSection>
          <TransferReportTitle>✅ 匯款資訊已回報</TransferReportTitle>
          <p style={{ textAlign: "center", color: "#004085" }}>
            我們已收到您的匯款資訊，將在 1-2
            個工作天內核對款項並開始處理您的訂單。
          </p>
        </TransferReportSection>
      )}

      <ButtonContainer>
        <HomeButton href="/">返回首頁</HomeButton>
        <CheckOrderButton href="/profile">查看訂單狀態</CheckOrderButton>
      </ButtonContainer>
    </Container>
  );
};

export default OrderConfirmationPage;
