"use client";

import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

interface Props {
  children: React.ReactNode;
  font: ReturnType<typeof Inter>;
}

export default function ClientLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background">{children}</main>
      <Footer />
    </div>
  );
}
