"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Truck, MapPin, Phone, Mail, Shield } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const defaultCartItems = [
  {
    id: 1,
    name: "500ml Raw Honey",
    price: 350,
    quantity: 2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Royal Glow Honey Wax",
    price: 40,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isBuyNow = searchParams.get("buyNow") === "true"

  const [cartItems, setCartItems] = useState(defaultCartItems)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Shipping Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",

    // Payment Info
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Additional
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [pendingOrderData, setPendingOrderData] = useState<any>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    // Check if this is a buy now checkout
    if (isBuyNow) {
      const buyNowItem = sessionStorage.getItem("buyNowItem")
      if (buyNowItem) {
        const item = JSON.parse(buyNowItem)
        setCartItems([item])
      }
    }
  }, [isBuyNow])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true)
      const script = document.createElement("script")
      script.id = "razorpay-script"
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleUPIPayment = async (orderRes: any, orderId: string) => {
    await loadRazorpayScript()
    const { razorpayOrder, key_id } = orderRes
    return new Promise((resolve) => {
      const options = {
        key: key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Honey Palace",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          // Verify payment on backend
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            resolve({ success: true })
          } else {
            resolve({ success: false, error: verifyData.error })
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F37254" },
        modal: {
          ondismiss: async function () {
            // Mark as failed if user closes modal
            await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayOrder.id,
                razorpay_payment_id: "",
                razorpay_signature: "",
                orderId,
              }),
            })
            resolve({ success: false, error: "Payment cancelled" })
          },
        },
      }
      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  }

  const handleOtpSubmit = async () => {
    if (!otp || !pendingOrderId) return
    setSubmitting(true)
    setOtpError("")
    try {
      const res = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: pendingOrderId, otp }),
        })
        const data = await res.json()
          setSubmitting(false)
      if (data.success) {
        setShowOtpDialog(false)
        setOtp("")
        // If UPI, open Razorpay payment modal
        if (pendingOrderData && pendingOrderData.paymentMethod === "upi" && pendingOrderData.razorpayOrder) {
          await handleUPIPayment(pendingOrderData, pendingOrderId)
          // After payment, clear state and redirect
          setOrderId(pendingOrderData.orderId)
          setPendingOrderId(null)
          setPendingOrderData(null)
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              landmark: "",
              cardNumber: "",
              expiryDate: "",
              cvv: "",
              cardName: "",
              notes: "",
            })
            setCartItems([])
            if (isBuyNow) {
              sessionStorage.removeItem("buyNowItem")
            }
            router.push(`/order-success?orderId=${pendingOrderData.orderId}`)
          } else {
          // COD or other methods
          setOrderId(pendingOrderData?.orderId)
          setPendingOrderId(null)
          setPendingOrderData(null)
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            landmark: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            cardName: "",
            notes: "",
          })
          setCartItems([])
          if (isBuyNow) {
            sessionStorage.removeItem("buyNowItem")
          }
          router.push(`/order-success?orderId=${pendingOrderData?.orderId}`)
        }
      } else {
        setOtpError(data.error || "Invalid OTP")
      }
    } catch (err: any) {
      setSubmitting(false)
      setOtpError(err.message || "OTP verification failed")
    }
  }

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || String(formData[field as keyof typeof formData]).trim() === "") {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!validateForm()) {
      setFormError("Please fill in all required fields.")
      setSubmitting(false)
      return
    }
    setSubmitting(true)
    try {
      if (paymentMethod === "upi") {
        // Create order and get Razorpay order details
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formData,
            paymentMethod,
            cartItems,
            total,
            isBuyNow,
          }),
        })
        const data = await res.json()
        if (data.success && data.razorpayOrder) {
          setPendingOrderId(data.insertedId)
          setPendingOrderData({ ...data, paymentMethod: "upi" })
          setOrderId(data.orderId)
          setShowOtpDialog(true)
          setSubmitting(false)
          // Optionally, you can show the OTP for testing: alert(data.otp)
          return
        } else {
          setSubmitting(false)
          alert(data.error || "Order submission failed")
        }
        return
      }
      // COD or other methods
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          paymentMethod,
          cartItems,
          total,
          isBuyNow,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPendingOrderId(data.insertedId)
        setPendingOrderData({ ...data, paymentMethod })
        setOrderId(data.orderId)
        setShowOtpDialog(true)
        setSubmitting(false)
        // Optionally, you can show the OTP for testing: alert(data.otp)
      } else {
        setSubmitting(false)
        alert(data.error || "Order submission failed")
      }
    } catch (err: any) {
      setSubmitting(false)
      alert(err.message || "Order submission failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isBuyNow ? "Complete your purchase" : "Complete your order"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="andaman-and-nicobar-islands">Andaman and Nicobar Islands</SelectItem>
                          <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                          <SelectItem value="assam">Assam</SelectItem>
                          <SelectItem value="bihar">Bihar</SelectItem>
                          <SelectItem value="chandigarh">Chandigarh</SelectItem>
                          <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                          <SelectItem value="dadra-and-nagar-haveli-and-daman-and-diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="goa">Goa</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                          <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="jammu-and-kashmir">Jammu and Kashmir</SelectItem>
                          <SelectItem value="jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="ladakh">Ladakh</SelectItem>
                          <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                          <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="manipur">Manipur</SelectItem>
                          <SelectItem value="meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="mizoram">Mizoram</SelectItem>
                          <SelectItem value="nagaland">Nagaland</SelectItem>
                          <SelectItem value="odisha">Odisha</SelectItem>
                          <SelectItem value="puducherry">Puducherry</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="sikkim">Sikkim</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tripura">Tripura</SelectItem>
                          <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="west-bengal">West Bengal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange("landmark", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "cod"
                          ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20"
                          : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="text-center">
                        <Truck className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Pay when you receive</p>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "upi"
                          ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20"
                          : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <div className="text-center">
                        <div className="h-8 w-8 mx-auto mb-2 bg-amber-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">UPI</span>
                        </div>
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">PhonePe, GPay, Paytm</p>
                      </div>
                    </div>
                    {/* <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20"
                          : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Visa, Mastercard</p>
                      </div>
                    </div> */}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            required={paymentMethod === "card"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for delivery..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && <p className="text-sm text-green-600">Free shipping on orders above ₹500!</p>}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Fast Delivery (3-5 days)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">24/7 Customer Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {formError && (
              <div className="mb-4 text-red-600 font-medium text-center">{formError}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isBuyNow ? `Buy Now - ₹${total}` : `Place Order - ₹${total}`
              )}
            </Button>

            <p className="text-xs text-gray-600 dark:text-gray-300 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">An OTP has been sent to your email. Please enter it below to confirm your order.</p>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
              disabled={submitting}
            />
            {otpError && <p className="text-red-600 text-sm">{otpError}</p>}
            <Button className="w-full" onClick={handleOtpSubmit} disabled={submitting || otp.length !== 6}>
              {submitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
