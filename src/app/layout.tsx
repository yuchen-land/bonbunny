import { Inter, Noto_Sans_TC, Playfair_Display } from "next/font/google";
import { Metadata, Viewport } from "next";
import StyledComponentsRegistry from "./lib/registry";
import ClientLayout from "@/app/ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-tc",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BonBunny 甜點工作室",
  description: "精緻手工甜點, 為您打造完美的甜蜜時光",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "32x32" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BonBunny",
    startupImage: ["/icons/apple-touch-icon.png"],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-TW"
      className={`h-full ${inter.variable} ${notoSansTC.variable} ${playfairDisplay.variable}`}
    >
      <body className="h-full bg-background text-foreground antialiased font-body">
        <StyledComponentsRegistry>
          <ClientLayout font={inter}>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
