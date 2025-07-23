"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"confirmed" | "pending_payment" | "canceled" | "error" | null>(null) // null, "confirmed", "pending_payment", "canceled", "error"
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) return

    // Fetch order details from your API
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()

        if (res.ok) {
          setOrderStatus(data.status) // status could be "confirmed", "pending_payment", "canceled"
          if (data.status === "confirmed") {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        } else {
          console.error("Order fetch failed:", data.message)
          setOrderStatus("error")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setOrderStatus("error")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your order...</p>
      </div>
    )
  }

  if (!orderId || orderStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Invalid order or something went wrong.</p>
      </div>
    )
  }

  if (orderStatus !== "confirmed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-red-700 mb-2">Payment Not Completed</h1>
            <p className="text-gray-600 text-lg mb-4">
              Your payment was canceled or failed. Please try again to complete your purchase.
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/checkout">
                Retry Payment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Existing success page content if order is confirmed
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
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

      {/* Your existing success UI */}
      {/* ... (same as your current JSX for success) */}
    </div>
  )
}
