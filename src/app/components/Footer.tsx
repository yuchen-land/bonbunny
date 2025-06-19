"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLine } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary mt-auto">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 品牌資訊 */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-primary">BonBunny</span>
            </Link>
            <p className="text-muted text-sm">
              精選手工甜點，為您帶來最幸福的滋味。每一口都充滿著我們對甜點的熱愛與堅持。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary transition-colors"
                aria-label="Line"
              >
                <FaLine className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* 快速連結 */}
          <div>
            <h3 className="font-bold text-lg mb-4">網站導覽</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/cake" className="text-muted hover:text-primary transition-colors">
                  蛋糕系列
                </Link>
              </li>
              <li>
                <Link href="/category/cookie" className="text-muted hover:text-primary transition-colors">
                  餅乾系列
                </Link>
              </li>
              <li>
                <Link href="/category/bread" className="text-muted hover:text-primary transition-colors">
                  麵包系列
                </Link>
              </li>
              <li>
                <Link href="/category/gift_set" className="text-muted hover:text-primary transition-colors">
                  禮盒系列
                </Link>
              </li>
            </ul>
          </div>

          {/* 顧客服務 */}
          <div>
            <h3 className="font-bold text-lg mb-4">顧客服務</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted hover:text-primary transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted hover:text-primary transition-colors">
                  常見問題
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted hover:text-primary transition-colors">
                  運送說明
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-primary transition-colors">
                  服務條款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-primary transition-colors">
                  隱私權政策
                </Link>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h3 className="font-bold text-lg mb-4">聯絡我們</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-muted">
                <MdPhone className="h-5 w-5 flex-shrink-0" />
                <span>02-2345-6789</span>
              </li>
              <li className="flex items-center space-x-3 text-muted">
                <MdEmail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:service@bonbunny.com" className="hover:text-primary transition-colors">
                  service@bonbunny.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-muted">
                <MdLocationOn className="h-5 w-5 flex-shrink-0" />
                <span>台北市大安區甜點街123號</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部資訊 */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted text-sm">
              © {currentYear} BonBunny。保留所有權利。
            </p>
            <div className="flex space-x-6">
              <Image
                src="/payment-methods.svg"
                alt="支付方式"
                width={200}
                height={30}
                className="opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
