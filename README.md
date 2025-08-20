# BonBunny Pastry Studio

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

BonBunny is a modern e-commerce platform for artisanal pastries, offering an elegant online shopping experience. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS, it delivers a high-performance and visually appealing shopping website.

![BonBunny Preview](public/images/about-banner.jpg)

## 🌟 Key Features

### 🛍️ Shopping Experience

- Intuitive shopping cart interface
- Wishlist functionality
- Streamlined checkout process
- Coupon system integration

### 📱 User Experience

- Fully responsive design across all devices
- Modern glassmorphism design
- Smooth page transitions and animations
- PWA support for mobile installation

### 🔒 User Management

- JWT authentication
- Order history tracking
- Wishlist management
- Profile customization

### 👨‍💼 Admin Dashboard

- Product management (CRUD)
- Order processing system
- Customer management
- Analytics dashboard

## 🚀 Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)

### Development Tools

- ESLint
- Prettier
- Git
- VS Code

## 📦 Getting Started

1. Clone the repository：

   ```bash
   git clone https://github.com/yuchen-land/bonbunny.git
   cd bonbunny
   ```

2. Install dependencies：

   ```bash
   npm install
   ```

3. Set up environment variables：

   ```bash
   cp .env.example .env.local
   ```

4. Start development server：

   ```bash
   npm run dev
   ```

5. Open browser and visit：

   [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bonbunny/
├── src/
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript definitions
│   │   ├── api/          # API routes
│   │   └── lib/          # Shared utilities
│   └── public/
│       ├── icons/        # Site icons
│       └── images/       # Product images
├── tailwind.config.ts    # Tailwind configuration
├── next.config.js       # Next.js configuration
└── package.json
```

## 🎨 Feature Overview

### Homepage

- Dynamic carousel
- Featured products showcase
- Category navigation
- News and updates section

### Product Features

- Category browsing
- Search and filtering
- Product details
- Related products

### Shopping Cart

- Real-time updates
- Quantity management
- Coupon application
- Shipping calculation

### User Dashboard

- Order tracking
- Wishlist management
- Profile settings
- Password management

## 🔜 Roadmap

1. Feature Enhancements

   - Third-party payment integration
   - Loyalty points system
   - Product reviews
   - Live chat support

2. Technical Improvements

   - Image optimization
   - SEO enhancement
   - Performance monitoring
   - Automated testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- [Yu Chen](https://github.com/yuchen-land) - Project Developer

## 📬 Contact

For any questions or suggestions, please reach out：

- GitHub: [@yuchen-land](https://github.com/yuchen-land)
- Email: [yuchen880401@gmail.com]
