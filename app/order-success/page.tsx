"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function OrderSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const orderSteps = [
    { icon: CheckCircle, label: "Order Confirmed", status: "completed" },
    { icon: Package, label: "Processing", status: "current" },
    { icon: Truck, label: "Shipped",status: "pending" },
    { icon: MapPin, label: "Delivered", status: "pending" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 text-lg">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 font-semibold">Order {orderId ? `#${orderId}` : "number unavailable"}</p>
                  <p className="text-amber-700 text-sm">Estimated delivery: 3-5 business days</p>
                </div>
              </motion.div>

              {/* Order Timeline */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                <div className="flex justify-between items-center">
                  {orderSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "current"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          step.status === "completed" || step.status === "current" ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                      {index < orderSteps.length - 1 && (
                        <div
                          className={`absolute h-0.5 w-16 mt-5 ${
                            step.status === "completed" ? "bg-green-300" : "bg-gray-200"
                          }`}
                          style={{ left: `${(index + 1) * 25}%` }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8 p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>support@honeypalace.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/products">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/orders">View Order Details</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
