"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Calendar, DollarSign } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "in_transit":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Clock className="h-4 w-4" />
    case "shipped":
      return <Package className="h-4 w-4" />
    case "in_transit":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function OrderTrackingPage() {
  const [trackingInput, setTrackingInput] = useState("")
  const [showOrder, setShowOrder] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTrackOrder = async () => {
    if (!trackingInput.trim()) return
    setIsLoading(true)
    setError("")
    setShowOrder(false)
    setOrder(null)
    // Try orders first
    let found = false
    let res = await fetch(`/api/orders?id=${encodeURIComponent(trackingInput.trim())}`)
    let data = await res.json()
    if (data.success && data.order) {
      setOrder({ ...data.order, type: "order" })
      found = true
    } else {
      // Try bulk orders
      res = await fetch(`/api/bulk-orders?id=${encodeURIComponent(trackingInput.trim())}`)
      data = await res.json()
      if (data.success && data.order) {
        setOrder({ ...data.order, type: "bulk" })
        found = true
      }
    }
    setIsLoading(false)
    if (found) {
      setShowOrder(true)
    } else {
      setError("Order not found. Please check your order or tracking number.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 ">
      <Header />
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">Enter your order number or tracking number to see the latest updates</p>
        </div>

        {/* Tracking Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Order Tracking</span>
            </CardTitle>
            <CardDescription>Enter your order number (e.g., HP-2024-001234) or tracking number</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="tracking">Order Number / Tracking Number</Label>
                <Input
                  id="tracking"
                  placeholder="HP-2024-001234 or 1Z999AA1234567890"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleTrackOrder}
                  disabled={isLoading || !trackingInput.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  {isLoading ? "Tracking..." : "Track Order"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {showOrder && order && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Order {order.id}</CardTitle>
                    <CardDescription>Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status ? order.status.replace("_", " ") : "-"}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tracking Number</p>
                      <p className="text-sm text-muted-foreground font-mono">{order.trackingNumber || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Order Total</p>
                      <p className="text-sm text-muted-foreground">${order.total ? order.total.toFixed(2) : "-"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            {Array.isArray(order.timeline) && order.timeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                  <CardDescription>Track your order progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed
                              ? event.current
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {event.completed ? (
                            event.current ? (
                              <Truck className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                              {event.status}
                            </p>
                            <p className="text-sm text-gray-500">
                              {event.date} {event.time}
                            </p>
                          </div>
                          <p className={`text-sm ${event.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            {Array.isArray(order.items) && order.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id || item._id} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${order.subtotal ? order.subtotal.toFixed(2) : "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${order.shipping ? order.shipping.toFixed(2) : "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${order.tax ? order.tax.toFixed(2) : "-"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total ? order.total.toFixed(2) : "-"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {order.customer && order.shippingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Shipping Address</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-medium">{order.customer.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">support@honeypalace.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!showOrder && (
          <Card>
            <CardHeader>
              <CardTitle>Need Help Finding Your Order?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Order Number</h4>
                  <p className="text-sm text-muted-foreground">
                    You can find your order number in the confirmation email we sent you after your purchase. It starts
                    with "HP-" followed by the year and order number.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tracking Number</h4>
                  <p className="text-sm text-muted-foreground">
                    Once your order ships, we'll send you a tracking number via email. You can use this number to track
                    your package directly.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Still can't find your order? We're here to help!</p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">support@honeypalace.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error message */}
        {error && (
          <div className="text-center text-red-600 font-medium my-4">{error}</div>
        )}
      </div>
      <Footer />
    </div>
  )
}
