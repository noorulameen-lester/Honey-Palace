"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Bulk Orders", href: "/bulk-orders" },
    { name: "Order Tracking", href: "/order-tracking" },
    { name: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    function updateCartTotal() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartTotal(cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0))
      } catch {
        setCartTotal(0)
      }
    }
    updateCartTotal()
    window.addEventListener("storage", updateCartTotal)
    return () => window.removeEventListener("storage", updateCartTotal)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-[#1a1a1e] dark:to-[#222228] border-b border-amber-200 dark:border-gray-700 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/favicon.ico"
              alt="Honey Palace"
              width={40}
              height={40}
              className="rounded-md shadow-md"
            />
            <span className="font-extrabold text-3xl header-title-gradient tracking-wide animate-header-title">
              Honey Palace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-semibold header-link transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-amber-100 dark:hover:bg-gray-800">
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-amber-500 transition" />
                {cartTotal > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs bg-amber-500 text-white shadow-md">
                    {cartTotal}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}
            <Link href="/auth/login">
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-amber-100 dark:hover:bg-gray-800">
                <User className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-amber-500 transition" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 hover:bg-amber-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 animate-fade-in-down">
            <nav className="flex flex-col space-y-5 text-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-semibold header-link transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t px-4">
                <Input placeholder="Search products..." className="w-full" />
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes header-title-fade-in {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-header-title {
          animation: header-title-fade-in 1.2s ease-in-out both;
        }
        .header-title-gradient {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          letter-spacing: 0.5px;
        }
        .header-link {
          color: #333;
          position: relative;
          font-size: 1rem;
        }
        .header-link:after {
          content: "";
          display: block;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
          transition: width 0.3s;
          position: absolute;
          left: 0;
          bottom: -4px;
        }
        .header-link:hover {
          color: #f59e0b;
        }
        .header-link:hover:after {
          width: 100%;
        }
        .dark .header-link {
          color: #f3f3f7;
        }
        .dark .header-link:hover {
          color: #fbbf24;
        }
      `}</style>
    </header>
  )
}
