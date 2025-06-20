import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./lib/registry";
import ClientLayout from "@/app/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BonBunny 甜點工作室",
  description: "精緻手工甜點, 為您打造完美的甜蜜時光",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BonBunny",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#FFFFFF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${inter.className} h-full bg-background text-foreground antialiased`}
      >
        <StyledComponentsRegistry>
          <ClientLayout font={inter}>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
