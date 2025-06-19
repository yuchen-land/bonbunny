import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./lib/registry";
import ClientLayout from "@/app/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BonBunny 甜點工作室",
  description: "精緻手工甜點, 為您打造完美的甜蜜時光",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full">
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
