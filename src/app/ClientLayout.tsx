"use client";

import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";

interface Props {
  children: React.ReactNode;
  font: ReturnType<typeof Inter>;
}

export default function ClientLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  );
}
