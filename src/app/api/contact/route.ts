import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Schema for validating contact form data
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要 2 個字符" }),
  email: z.string().email({ message: "請輸入有效的電子郵件地址" }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "主旨至少需要 5 個字符" }),
  message: z.string().min(10, { message: "訊息內容至少需要 10 個字符" }),
});

// Create email transporter
const createTransporter = () => {
  // For development, you can use services like Gmail, Outlook, or SMTP
  // For production, use services like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com", // Add to .env.local
      pass: process.env.EMAIL_PASSWORD || "your-app-password", // Add to .env.local
    },
  });
};

const sendContactEmail = async (contactData: any) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || "noreply@bonbunny.com",
    to: "yuchen880401@gmail.com",
    subject: `【BonBunny 聯絡表單】${contactData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">BonBunny 聯絡表單</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3>聯絡人資訊</h3>
          <p><strong>姓名：</strong> ${contactData.name}</p>
          <p><strong>電子郵件：</strong> ${contactData.email}</p>
          <p><strong>電話：</strong> ${contactData.phone || "未提供"}</p>
          <p><strong>主旨：</strong> ${contactData.subject}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3>訊息內容</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #ff6b6b; margin: 10px 0;">
            ${contactData.message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
          <p>此郵件由 BonBunny 聯絡表單自動發送</p>
          <p>發送時間：${new Date().toLocaleString("zh-TW")}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Generate contact record ID
    const contactId = `CONTACT${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create contact record
    const contactRecord = {
      id: contactId,
      ...validatedData,
      status: "new" as const,
      createdAt: new Date().toISOString(),
      repliedAt: null,
    };

    // Send email notification
    try {
      await sendContactEmail(validatedData);
      console.log("Contact email sent successfully");
    } catch (emailError) {
      console.error("Failed to send contact email:", emailError);
      // Continue processing even if email fails
    }

    // Log the contact record (in production, save to database)
    console.log("New contact form submission:", contactRecord);

    return NextResponse.json(
      {
        success: true,
        message: "您的訊息已成功送出，我們將盡快回覆您。",
        contactId: contactId,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "表單驗證失敗",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        error: "提交表單時發生錯誤，請稍後再試。",
      },
      { status: 500 }
    );
  }
}
