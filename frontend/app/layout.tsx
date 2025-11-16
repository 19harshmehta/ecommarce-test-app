import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";
import { CartProvider } from "../components/CartContext";
import Header from "../components/Headers";

export const metadata: Metadata = {
  title: "Harsh Mehta 202412048 E-Commerce App Test",
  description: " Harsh Mehta 202412048 - A simple e-commerce application built with Next.js, TypeScript, Prisma, Mysql and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}