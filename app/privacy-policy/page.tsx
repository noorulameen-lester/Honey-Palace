import type { Metadata } from "next"
import { Shield, Lock, Eye, Database, Mail, Phone, Instagram } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy - Honey Palace",
  description: "Learn how Honey Palace protects and handles your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy matters to us. This policy explains how Honey Palace collects, uses, and protects your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: January 1, 2024</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-amber-600 mr-3" />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  At Honey Palace, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and secure your information when you use our website, WhatsApp, Instagram, or make purchases.<br/>
                  We comply with privacy laws, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023 (DPDP Act) in India.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-6 h-6 text-amber-600 mr-3" />
                  Information We Collect
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment details (securely handled via our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Messages and interactions on WhatsApp and Instagram</li>
                  <li>Account credentials and profile information (if you create an account)</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>IP address, browser type, and operating system</li>
                  <li>Device details and unique identifiers</li>
                  <li>Website usage data and analytics (via cookies and tracking technologies)</li>
                  <li>Location data (if enabled on your device)</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Process and deliver your orders</li>
                  <li>Communicate about your orders, account, or customer support</li>
                  <li>Provide service via WhatsApp and Instagram (with your consent)</li>
                  <li>Send offers and updates (if you opt in)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and security breaches</li>
                  <li>Fulfill legal requirements</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We never sell or rent your data. We may share information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With delivery and logistics partners</li>
                  <li>With payment gateways to process transactions securely</li>
                  <li>With IT service providers who assist our operations</li>
                  <li>When legally required by Indian authorities</li>
                  <li>During business transfers like mergers or acquisitions</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-amber-600 mr-3" />
                  Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We use strong security measures, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>SSL encryption for safe data transmission</li>
                  <li>Secure servers and encrypted databases</li>
                  <li>Regular updates and security audits</li>
                  <li>Employee access controls and training</li>
                  <li>PCI DSS compliant payment systems</li>
                  <li>We also comply with the DPDP Act for data localization and user consent practices.</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights (Under Indian Law)</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>✔ Access your personal data</li>
                  <li>✔ Correct inaccuracies</li>
                  <li>✔ Request deletion (subject to retention laws)</li>
                  <li>✔ Opt-out of marketing messages</li>
                  <li>✔ Receive a copy of your data (portability)</li>
                  <li>✔ Withdraw consent at any time</li>
                </ul>
                <p className="text-gray-700 mt-2">To exercise these rights, contact us below.</p>
              </section>

              {/* Cookies and Tracking */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Improve your experience</li>
                  <li>Analyze traffic and trends</li>
                  <li>Show relevant content and ads</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  You can change cookie settings in your browser. Disabling cookies may limit some features.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-amber-600 mr-3" />
                  Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  For any questions about this Privacy Policy or your data:
                </p>
                <div className="bg-amber-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">honeypalace@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">+91 9207215392</span>
                    </div>
                    <div className="flex items-center">
                      <Instagram className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-gray-700">@honeypalace__</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
                <p className="text-gray-700">
                  We may revise this policy occasionally. Updates will appear here with a new “Last updated” date. Continued use of our services means you agree to the updated policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
