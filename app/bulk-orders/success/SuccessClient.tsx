"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle, Package, Clock, Mail, Phone, Download, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SuccessClient() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock bulk order data
  const bulkOrder = {
    id: orderId || "-",
    items: [
      { name: "Wildflower Honey", quantity: 50, unit: "500ml jars" },
      { name: "Manuka Honey", quantity: 25, unit: "250ml jars" },
      { name: "Acacia Honey", quantity: 30, unit: "1kg containers" },
    ],
    totalQuantity: 105,
    estimatedValue: "$2,850.00",
    submittedAt: new Date().toLocaleDateString(),
    estimatedProcessing: "2-3 business days",
  };

  return (
    <>
      <Header />
      <div
        className={`w-full max-w-4xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 text-white rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Bulk Order Submitted Successfully!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for your bulk order request. Our team will review your requirements and contact you within 24
            hours.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8 shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Order Summary</h2>
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Order #{bulkOrder.id}</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Details</h3>
                <div className="space-y-4">
                  {bulkOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{item.unit}</div>
                      </div>
                      <div className="text-lg font-semibold text-amber-600">{item.quantity} units</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Total Quantity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{bulkOrder.totalQuantity} units</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Value</span>
                    <span className="font-semibold text-amber-600 text-xl">{bulkOrder.estimatedValue}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300">Submitted</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{bulkOrder.submittedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-amber-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What Happens Next?</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Review & Quote</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Our team reviews your order and prepares a detailed quote
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Contact & Confirmation</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      We'll contact you within 24 hours to discuss details
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Processing & Delivery</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Order processing and scheduled delivery arrangement
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-amber-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Timeline</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Quote Preparation</span>
                  <Badge variant="secondary">24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Order Processing</span>
                  <Badge variant="secondary">{bulkOrder.estimatedProcessing}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Arrangement</span>
                  <Badge variant="secondary">1-2 days</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <div className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Estimated Total Timeline
                </div>
                <div className="text-lg font-bold text-amber-600">5-7 business days</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Need Immediate Assistance?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Call Us</div>
                    <div className="text-amber-600 font-medium">1-800-HONEY-01</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Email Us</div>
                    <div className="text-amber-600 font-medium">bulk@honeypalace.com</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Download className="w-4 h-4 mr-2" />
            Download Order Summary
          </Button>
          <Link href="/bulk-orders">
            <Button
              variant="outline"
              size="lg"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
            >
              Submit Another Order
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You will receive a confirmation email shortly with your order details and tracking information.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
} 