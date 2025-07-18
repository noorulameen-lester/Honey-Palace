"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Download, Package, Users, Truck, Phone, Mail, MapPin, Plus, Minus, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const bulkProducts = [
  {
    id: 1,
    name: "500ml Raw Honey",
    retailPrice: 350,
    bulkPrice: 280,
    minQuantity: 50,
    image: "/placeholder.svg?height=200&width=200",
    selected: false,
    quantity: 50,
  },
  {
    id: 2,
    name: "1 Litre Raw Honey",
    retailPrice: 600,
    bulkPrice: 480,
    minQuantity: 25,
    image: "/placeholder.svg?height=200&width=200",
    selected: false,
    quantity: 25,
  },
  {
    id: 3,
    name: "Royal Glow Honey Wax",
    retailPrice: 40,
    bulkPrice: 32,
    minQuantity: 100,
    image: "/placeholder.svg?height=200&width=200",
    selected: false,
    quantity: 100,
  },
]

export default function BulkOrdersPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    gstNumber: "",
    message: "",
  })

  const [selectedProducts, setSelectedProducts] = useState(bulkProducts)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<null | { success: boolean; message: string }>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductSelection = (productId: number, checked: boolean) => {
    setSelectedProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, selected: checked } : product)),
    )
  }

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, quantity: Math.max(product.minQuantity, newQuantity) } : product,
      ),
    )
  }

  const calculateTotal = () => {
    return selectedProducts
      .filter((product) => product.selected)
      .reduce((total, product) => total + product.bulkPrice * product.quantity, 0)
  }

  const calculateSavings = () => {
    return selectedProducts
      .filter((product) => product.selected)
      .reduce((total, product) => total + (product.retailPrice - product.bulkPrice) * product.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedItems = selectedProducts.filter((product) => product.selected)
    setSubmitting(true)
    setSubmitResult(null)
    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, selectedItems, total: calculateTotal() }),
      })
      const data = await res.json()
      if (data.success) {
        setOrderId(data.orderId)
        router.push(`/bulk-orders/success?orderId=${data.orderId}`)
      } else {
        setSubmitResult({ success: false, message: data.error || "Submission failed" })
      }
    } catch (err: any) {
      setSubmitResult({ success: false, message: err.message || "Submission failed" })
    } finally {
      setSubmitting(false)
    }
  }

  const downloadCatalog = () => {
    console.log("Downloading catalog...")
    // Handle catalog download
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bulk Orders & Wholesale
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Partner with Honey Palace for premium quality honey products at wholesale prices. Perfect for shops,
              clinics, ayurvedic centers, and resellers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Wholesale Pricing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Get up to 20% discount on bulk orders with competitive wholesale rates
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Quick processing and delivery across India with proper packaging
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Dedicated Support</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Personal account manager for all your bulk order requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Selection */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Select Products</h2>
              <Button onClick={downloadCatalog} variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Catalog
              </Button>
            </div>

            <div className="space-y-6">
              {selectedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`border-2 transition-all ${product.selected ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20" : "border-gray-200"}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={product.selected}
                        onCheckedChange={(checked) => handleProductSelection(product.id, checked as boolean)}
                        className="mt-2"
                      />
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{product.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">Retail Price</p>
                            <p className="font-semibold text-gray-500 line-through">₹{product.retailPrice}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">Bulk Price</p>
                            <p className="font-semibold text-amber-600">₹{product.bulkPrice}</p>
                          </div>
                        </div>

                        {product.selected && (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Label className="text-sm">Quantity:</Label>
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(product.id, product.quantity - 10)}
                                  disabled={product.quantity <= product.minQuantity}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      product.id,
                                      Number.parseInt(e.target.value) || product.minQuantity,
                                    )
                                  }
                                  className="w-20 text-center border-0 focus-visible:ring-0"
                                  min={product.minQuantity}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(product.id, product.quantity + 10)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <p>Min Order: {product.minQuantity} units</p>
                              <p className="font-semibold text-amber-600">
                                Subtotal: ₹{(product.bulkPrice * product.quantity).toLocaleString()}
                              </p>
                              <p className="text-green-600">
                                You save: ₹
                                {((product.retailPrice - product.bulkPrice) * product.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {!product.selected && (
                          <div className="mt-2">
                            <Badge variant="secondary">Min Order: {product.minQuantity} units</Badge>
                            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Save ₹{product.retailPrice - product.bulkPrice} per unit
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            {selectedProducts.some((p) => p.selected) && (
              <Card className="mt-8 border-0 shadow-lg bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-amber-800 dark:text-amber-200">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Selected Items:</span>
                      <span>{selectedProducts.filter((p) => p.selected).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Quantity:</span>
                      <span>{selectedProducts.filter((p) => p.selected).reduce((sum, p) => sum + p.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings:</span>
                      <span>₹{calculateSavings().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-amber-600">
                      <span>Total Amount:</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            <Card className="mt-8 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Why Choose Honey Palace for Bulk Orders?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-amber-600 rounded-full mt-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Quality Assurance:</strong> FSSAI certified products with consistent quality
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-amber-600 rounded-full mt-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Competitive Pricing:</strong> Best wholesale rates with volume discounts
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-amber-600 rounded-full mt-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Reliable Supply:</strong> Consistent stock availability and timely delivery
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-amber-600 rounded-full mt-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Custom Packaging:</strong> Private labeling options available
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-amber-600 rounded-full mt-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Support:</strong> Dedicated account manager for your business needs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiry Form */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Request Bulk Order Quote</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you with a customized quote within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={2}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
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
                          <SelectItem value="kerala">Kerala</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => handleInputChange("businessType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail-shop">Retail Shop</SelectItem>
                          <SelectItem value="ayurvedic-clinic">Ayurvedic Clinic</SelectItem>
                          <SelectItem value="health-store">Health Store</SelectItem>
                          <SelectItem value="online-seller">Online Seller</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Requirements</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your specific requirements, delivery preferences, etc."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={!selectedProducts.some((p) => p.selected) || submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                    {selectedProducts.some((p) => p.selected) && !submitting && (
                      <span className="ml-2">- ₹{calculateTotal().toLocaleString()}</span>
                    )}
                  </Button>
                  {submitResult && (
                    <div className={`mt-2 text-center text-sm font-medium ${submitResult.success ? "text-green-600" : "text-red-600"}`}>
                      {submitResult.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Direct Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-gray-600 dark:text-gray-300">+91 9207215392</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-gray-600 dark:text-gray-300">1honeypalace@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-gray-600 dark:text-gray-300">Wandoor, Kerala, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
