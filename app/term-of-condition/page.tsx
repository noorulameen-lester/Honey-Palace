import type { Metadata } from "next"
import { FileText, Scale, ShoppingCart, CreditCard, Truck, AlertTriangle, Copyright } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service - Honey Palace",
  description: "Terms and conditions for using Honey Palace services and making purchases.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">Please read these terms carefully before using our website and services.</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: July 1, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Agreement to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Scale className="w-6 h-6 text-amber-600 mr-3" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using the Honey Palace website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                </p>
              </section>

              {/* Use of Website */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Website</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Use</h3>
                <p className="text-gray-700 mb-4">
                  You may use our website and services for lawful purposes only, in compliance with all applicable laws and regulations in India.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Transmit harmful or malicious code (viruses, worms, etc.)</li>
                  <li>Attempt unauthorized access to our systems or data</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Impersonate another person or business</li>
                  <li>Collect or use other users’ information without consent</li>
                </ul>
              </section>

              {/* Products and Orders */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-6 h-6 text-amber-600 mr-3" />
                  Products and Orders
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Information</h3>
                <p className="text-gray-700 mb-4">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that all content is error-free, current, or complete.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Order Acceptance</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>All orders are subject to confirmation and availability.</li>
                  <li>We reserve the right to refuse or cancel any order at our discretion.</li>
                  <li>Prices are subject to change without prior notice.</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Age Requirement</h3>
                <p className="text-gray-700 mb-4">
                  You must be 18 years or older to place an order. By ordering, you confirm you meet this requirement.
                </p>
              </section>

              {/* Payment Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 text-amber-600 mr-3" />
                  Payment Terms
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Payment must be completed at the time of order.</li>
                  <li>We accept major Indian payment methods (UPI, credit/debit cards, Net Banking, etc.).</li>
                  <li>Prices are in INR unless otherwise specified.</li>
                  <li>Customers are responsible for applicable GST and other taxes.</li>
                  <li>Secure payment processing is handled by trusted third-party providers.</li>
                  <li>Failed payments may lead to order cancellation.</li>
                </ul>
              </section>

              {/* Shipping and Delivery */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-6 h-6 text-amber-600 mr-3" />
                  Shipping and Delivery
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping Policy</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Shipping charges are calculated at checkout.</li>
                  <li>Estimated delivery times are provided but not guaranteed.</li>
                  <li>Risk of loss passes to the customer upon delivery.</li>
                  <li>We are not responsible for delays caused by courier companies or natural events.</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">International Shipping</h3>
                <p className="text-gray-700 mb-4">
                  International customers are responsible for customs duties, taxes, and fees. Delivery times vary based on customs processing.
                </p>
              </section>

              {/* Returns and Refunds */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
                <p className="text-gray-700 mb-4">
                  Please refer to our Refund and Return Policy for detailed information about returns, exchanges, and refunds. That policy is incorporated into these Terms by reference.
                </p>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is owned by Honey Palace or its licensors and protected by copyright and trademark laws.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><span className="text-green-700">✔</span> View and use content for personal, non-commercial purposes.</li>
                </ul>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><span className="text-red-600">❌</span> Reproduce, distribute, or create derivative works without written permission.</li>
                  <li><span className="text-red-600">❌</span> Use Honey Palace trademarks or logos without authorization.</li>
                </ul>
              </section>

              {/* Disclaimers and Limitations */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                  Disclaimers and Limitations
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Warranty Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  Our products and services are provided “as is” without any express or implied warranties.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
                <p className="text-gray-700 mb-4">
                  Honey Palace shall not be liable for indirect, incidental, or consequential damages, including loss of data, profits, or business opportunities.
                </p>
              </section>

              {/* Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
                <p className="text-gray-700">
                  Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may suspend or terminate your access to our services at any time for violation of these Terms or applicable laws.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700">
                  These Terms are governed by and interpreted under the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Malappuram, Kerala, India.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700">
                  We may update these Terms from time to time. Updates will be posted on this page, and continued use of our services means you accept the changes.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms of Service:
                </p>
                <div className="bg-amber-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">1honeypalace@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Scale className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">+91 9207215392</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">Instagram: @honeypalace__</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">Customer Support Hours: Monday – Friday, 10:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">Closed: Saturday & Sunday</span>
                    </div>
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
