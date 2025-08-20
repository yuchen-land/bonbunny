import nodemailer from "nodemailer";
import type { Order } from "@/app/types";

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Format currency
const formatCurrency = (amount: number) => {
  return `NT$ ${amount.toLocaleString()}`;
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Order confirmation email template
export const generateOrderConfirmationEmail = (order: Order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; text-align: left;">${item.name}</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `
    )
    .join("");

  return {
    subject: `【BonBunny】訂單確認通知 - 訂單編號：${order.id}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>訂單確認通知</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">BonBunny 烘焙坊</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">感謝您的訂購！</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">訂單確認通知</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">訂單資訊</h3>
          <p><strong>訂單編號：</strong>${order.id}</p>
          <p><strong>訂單日期：</strong>${formatDate(order.createdAt)}</p>
          <p><strong>訂單狀態：</strong>待付款</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">收件人資訊</h3>
          <p><strong>姓名：</strong>${order.shippingInfo.fullName}</p>
          <p><strong>電話：</strong>${order.shippingInfo.phone}</p>
          <p><strong>Email：</strong>${order.shippingInfo.email}</p>
          <p><strong>地址：</strong>${order.shippingInfo.address.postalCode} ${order.shippingInfo.address.city}${order.shippingInfo.address.district}${order.shippingInfo.address.street}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">訂單明細</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">商品名稱</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">數量</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">單價</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">小計</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">訂單總計：</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea; border-top: 2px solid #ddd;">${formatCurrency(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">💰 付款資訊</h3>
          <p style="color: #856404; margin-bottom: 10px;"><strong>付款方式：</strong>銀行匯款</p>
          <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p style="margin: 5px 0;"><strong>銀行：</strong>台灣銀行</p>
            <p style="margin: 5px 0;"><strong>戶名：</strong>BonBunny 烘焙坊</p>
            <p style="margin: 5px 0;"><strong>帳號：</strong>123-456-789-012</p>
            <p style="margin: 5px 0;"><strong>匯款金額：</strong>${formatCurrency(order.total)}</p>
          </div>
          <p style="color: #856404; margin-top: 15px; font-size: 14px;">
            ⚠️ 請於收到此信後 3 天內完成匯款，並透過網站回報匯款資訊。
          </p>
        </div>

        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #155724; margin-top: 0;">📋 後續步驟</h3>
          <ol style="color: #155724; margin: 0; padding-left: 20px;">
            <li>完成銀行匯款</li>
            <li>登入網站回報匯款資訊</li>
            <li>等待我們確認付款</li>
            <li>開始製作您的美味糕點</li>
            <li>安排配送到府</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            如有任何問題，請聯繫我們：<br>
            📞 電話：(02) 1234-5678<br>
            📧 Email：yuchen880401@gmail.com
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            © 2025 BonBunny 烘焙坊. 版權所有.<br>
            此為系統自動發送的郵件，請勿直接回覆。
          </p>
        </div>
      </div>
    </body>
    </html>
    `,
  };
};

// Transfer notification email template
export const generateTransferNotificationEmail = (order: Order) => {
  const transferDetails = order.paymentInfo.transferDetails;
  
  if (!transferDetails) {
    throw new Error("Transfer details not found");
  }

  return {
    subject: `【BonBunny】匯款通知確認 - 訂單編號：${order.id}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>匯款通知確認</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">BonBunny 烘焙坊</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">匯款通知已收到！</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #28a745; margin-top: 0;">匯款通知確認</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">訂單資訊</h3>
          <p><strong>訂單編號：</strong>${order.id}</p>
          <p><strong>訂單金額：</strong>${formatCurrency(order.total)}</p>
          <p><strong>收件人：</strong>${order.shippingInfo.fullName}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">匯款資訊</h3>
          <p><strong>匯款日期：</strong>${transferDetails?.transferDate}</p>
          <p><strong>匯款時間：</strong>${transferDetails?.transferTime}</p>
          <p><strong>匯款金額：</strong>${formatCurrency(transferDetails?.transferAmount || 0)}</p>
          <p><strong>匯款帳號後5碼：</strong>${transferDetails?.transferAccount}</p>
          <p><strong>通知時間：</strong>${formatDate(transferDetails?.reportedAt || new Date().toISOString())}</p>
        </div>

        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #155724; margin-top: 0;">✅ 通知狀態</h3>
          <p style="color: #155724; margin: 0;">
            我們已收到您的匯款通知，將於 1-2 個工作天內確認付款狀態。<br>
            確認完成後，將立即開始製作您的訂單。
          </p>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">📋 後續流程</h3>
          <ol style="color: #856404; margin: 0; padding-left: 20px;">
            <li>我們確認您的付款（1-2工作天）</li>
            <li>開始製作您的美味糕點</li>
            <li>製作完成後安排配送</li>
            <li>您將收到出貨通知</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            如有任何問題，請聯繫我們：<br>
            📞 電話：(02) 1234-5678<br>
            📧 Email：yuchen880401@gmail.com
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 12px;">
            © 2025 BonBunny 烘焙坊. 版權所有.<br>
            此為系統自動發送的郵件，請勿直接回覆。
          </p>
        </div>
      </div>
    </body>
    </html>
    `,
  };
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order: Order) => {
  try {
    const transporter = createTransporter();
    const emailContent = generateOrderConfirmationEmail(order);
    
    const mailOptions = {
      from: `"BonBunny 烘焙坊" <${process.env.EMAIL_USER}>`,
      to: order.shippingInfo.email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    throw error;
  }
};

// Send transfer notification email
export const sendTransferNotificationEmail = async (order: Order) => {
  try {
    const transporter = createTransporter();
    const emailContent = generateTransferNotificationEmail(order);
    
    const mailOptions = {
      from: `"BonBunny 烘焙坊" <${process.env.EMAIL_USER}>`,
      to: order.shippingInfo.email,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Transfer notification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send transfer notification email:", error);
    throw error;
  }
};

// Send admin notification email (for internal use)
export const sendAdminNotificationEmail = async (order: Order, type: "new_order" | "transfer_reported") => {
  try {
    const transporter = createTransporter();
    
    let subject = "";
    let content = "";
    
    if (type === "new_order") {
      subject = `【新訂單通知】訂單編號：${order.id}`;
      content = `
        <h2>新訂單通知</h2>
        <p><strong>訂單編號：</strong>${order.id}</p>
        <p><strong>客戶姓名：</strong>${order.shippingInfo.fullName}</p>
        <p><strong>聯絡電話：</strong>${order.shippingInfo.phone}</p>
        <p><strong>訂單金額：</strong>${formatCurrency(order.total)}</p>
        <p><strong>訂單時間：</strong>${formatDate(order.createdAt)}</p>
        <p>請登入管理後台查看詳細資訊。</p>
      `;
    } else if (type === "transfer_reported") {
      const transferDetails = order.paymentInfo.transferDetails;
      subject = `【匯款通知】訂單編號：${order.id}`;
      content = `
        <h2>客戶匯款通知</h2>
        <p><strong>訂單編號：</strong>${order.id}</p>
        <p><strong>客戶姓名：</strong>${order.shippingInfo.fullName}</p>
        <p><strong>匯款日期：</strong>${transferDetails?.transferDate}</p>
        <p><strong>匯款金額：</strong>${formatCurrency(transferDetails?.transferAmount || 0)}</p>
        <p><strong>帳號後5碼：</strong>${transferDetails?.transferAccount}</p>
        <p>請儘速確認付款狀態。</p>
      `;
    }
    
    const mailOptions = {
      from: `"BonBunny 系統" <${process.env.EMAIL_USER}>`,
      to: "yuchen880401@gmail.com", // Admin email
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          ${content}
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    throw error;
  }
};
