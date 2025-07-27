"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "https://www.instagram.com/honeypalace__/" },
]

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Bulk Orders", href: "/bulk-orders" },
]

const customerLinks = [
  { name: "FAQ", href: "#" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Track Order", href: "#" },
  { name: "Terms of Service", href: "/term-of-condition" },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background animated honeycomb */}
      <div className="absolute inset-0 opacity-10 bg-[url('/honeycomb-pattern.svg')] bg-cover bg-center animate-pulse" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Brand & Socials */}
          <div className="space-y-5">
            <motion.h3
              className="text-3xl font-extrabold text-amber-400 drop-shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              Honey Palace
            </motion.h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium quality honey sourced directly from local beekeepers. Pure, natural, and delicious.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  className="p-2 bg-gray-800 rounded-full hover:bg-amber-400 hover:text-black transition-colors"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={link.href} className="text-gray-300 hover:text-amber-400 transition">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Customer Service</h4>
            <ul className="space-y-2">
              {customerLinks.map((link, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={link.href} className="text-gray-300 hover:text-amber-400 transition">
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h4>
            <div className="space-y-4">
              <motion.div className="flex items-center space-x-3" whileHover={{ x: 3 }}>
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </motion.div>
              <motion.div className="flex items-center space-x-3" whileHover={{ x: 3 }}>
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">info@honeypalace.com</span>
              </motion.div>
              <motion.div className="flex items-center space-x-3" whileHover={{ x: 3 }}>
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">123 Honey Lane, Sweet Valley, CA 90210</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            © {new Date().getFullYear()} Honey Palace. All rights reserved. |
            <Link href="/privacy-policy" className="hover:text-amber-400 ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/term-of-condition" className="hover:text-amber-400 ml-1">
              Terms of Service
            </Link>{" "}
            |
            <Link href="/refund-policy" className="hover:text-amber-400 ml-1">
              Refund Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
