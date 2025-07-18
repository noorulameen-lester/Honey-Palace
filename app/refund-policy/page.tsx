import type { Metadata } from "next"
import { RotateCcw, Clock, CheckCircle, XCircle, AlertCircle, CreditCard, Phone, Mail, Instagram } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Refund and Return Policy - Honey Palace",
  description: "Learn about our refund and return policy for Honey Palace products.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <RotateCcw className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund and Return Policy</h1>
            <p className="text-xl text-gray-600">We want you to be completely satisfied with your Honey Palace purchase.</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: July 1, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Our Commitment */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-amber-600 mr-3" />
                  Our Commitment
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Honey Palace, we stand behind the quality of our premium honey products. If you're not fully satisfied with your purchase, we offer a clear return and refund policy for your peace of mind.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <p className="text-green-800 font-medium">✔ Satisfaction guarantee on all products</p>
                  <p className="text-green-800 font-medium">✔ Hassle-free exchanges and refunds for eligible cases</p>
                </div>
              </section>

              {/* Return Timeframe */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-amber-600 mr-3" />
                  Return Timeframe
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-amber-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-800 mb-3">Standard Products</h3>
                    <p className="text-amber-700">
                      <strong>Within 1 day of delivery</strong>
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Bulk Orders</h3>
                    <p className="text-blue-700">
                      <strong>Within 3 days of delivery</strong>
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                    <p className="text-yellow-800">
                      <strong>Important:</strong> Returns must be initiated within the specified timeframe. Contact us immediately if there are any concerns about your order.
                    </p>
                  </div>
                </div>
              </section>

              {/* What Can Be Returned */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Can Be Returned</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Eligible for Return
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Unopened honey jars in original packaging</li>
                      <li>Products damaged during shipping</li>
                      <li>Wrong items sent by mistake</li>
                      <li>Defective or contaminated products</li>
                      <li>Honey gift sets in original condition</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Not Eligible for Return
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Opened or partially consumed products</li>
                      <li>Items damaged by customer misuse</li>
                      <li>Products past the return window</li>
                      <li>Custom or personalized products</li>
                      <li>Honey that has naturally crystallized (normal in pure honey)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How to Return Items */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return Items</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Us</h3>
                      <ul className="text-gray-700 space-y-1">
                        <li className="flex items-center"><Mail className="w-5 h-5 text-amber-600 mr-2" /> <span>1honeypalace@gmail.com</span></li>
                        <li className="flex items-center"><Phone className="w-5 h-5 text-amber-600 mr-2" /> <span>+91 9207215392</span></li>
                        <li className="flex items-center"><Instagram className="w-5 h-5 text-amber-600 mr-2" /> <span>@honeypalace__</span></li>
                      </ul>
                      <p className="text-gray-700 mt-2">Provide your order number and reason for return.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Return Authorization</h3>
                      <p className="text-gray-700">We’ll issue a Return Merchandise Authorization (RMA) number and give you detailed return instructions.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Package and Ship</h3>
                      <p className="text-gray-700">Pack items securely in original packaging and ship using the provided prepaid label.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing</h3>
                      <p className="text-gray-700">After receiving and inspecting your return, we’ll process your refund or exchange within 3-5 business days.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 text-amber-600 mr-3" />
                  Refund Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Refund Method</h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-1">
                      <li>Store Credit (Immediate after return)</li>
                      <li>Credit/Debit Card (3-5 business days)</li>
                      <li>UPI/Bank Transfer (5-7 business days)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Refund Options</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Original payment method</li>
                      <li>Store credit for faster use</li>
                      <li>Exchange for a different product</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Exchanges */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
                <p className="text-gray-700 mb-4">We’re happy to exchange for:</p>
                <div className="bg-amber-50 rounded-lg p-6">
                  <ul className="list-disc list-inside text-amber-700 space-y-2">
                    <li>Different honey varieties (same price range)</li>
                    <li>Other jar sizes (price difference applies)</li>
                    <li>Gift sets and bundles</li>
                    <li>Seasonal/limited editions (subject to stock)</li>
                  </ul>
                  <p className="text-amber-700 mt-3">✅ Free shipping for exchanges if the error is ours.</p>
                </div>
              </section>

              {/* Damaged or Defective Items */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Defective Items</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>📌 Contact us within 48 hours of delivery</li>
                  <li>📷 Provide photos of damaged items</li>
                  <li>We’ll send a replacement or full refund. No need to return damaged items unless we request it.</li>
                </ul>
              </section>

              {/* International Returns */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Returns</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>🌎 International customers can return products, but:</li>
                  <li>Customer pays return shipping</li>
                  <li>Original shipping costs are non-refundable</li>
                  <li>Allow extra time for customs clearance</li>
                </ul>
              </section>

              {/* Customer Support */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Support</h2>
                <div className="bg-amber-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center"><Mail className="w-5 h-5 text-amber-600 mr-3" /> <span className="text-gray-700">1honeypalace@gmail.com</span></li>
                    <li className="flex items-center"><Phone className="w-5 h-5 text-amber-600 mr-3" /> <span className="text-gray-700">+91 9207215392</span></li>
                    <li className="flex items-center"><Instagram className="w-5 h-5 text-amber-600 mr-3" /> <span className="text-gray-700">@honeypalace__</span></li>
                  </ul>
                  <div className="text-gray-700 mt-4">
                    <span className="block">🕙 Working Hours: Monday – Friday, 10:00 AM – 4:00 PM</span>
                    <span className="block">🚫 Closed: Saturday & Sunday</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
