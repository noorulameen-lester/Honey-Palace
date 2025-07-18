"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, Award, Truck, Shield } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "100% Pure & Natural",
    description: "Raw, unfiltered honey with no additives",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders over $50",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "30-day money-back guarantee",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "The best honey I've ever tasted! Pure and delicious.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "Amazing quality and fast shipping. Highly recommend!",
  },
  {
    name: "Emily Rodriguez",
    rating: 5,
    text: "Perfect for my morning tea. Will definitely order again.",
  },
]

export function HeroSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-yellow-200/30 dark:bg-yellow-800/20 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-800 dark:text-amber-200 text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Trusted by 10,000+ customers
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Pure{" "}
                <span className="text-amber-600 relative">
                  Honey
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" fill="none">
                    <path
                      d="M0 8C20 4 40 2 60 4C80 6 90 8 100 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-amber-400"
                    />
                  </svg>
                </span>
                <br />
                From Nature's Heart
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Discover our premium collection of raw, unfiltered honey sourced directly from local beekeepers.
                Experience the authentic taste of nature in every golden drop.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg group">
                  Shop Now
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 px-8 py-4 text-lg bg-transparent"
                >
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-amber-200 dark:border-amber-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pure & Natural</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Local Beekeepers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
            </div>

            {/* Rotating Testimonial */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center mb-3">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 italic">"{testimonials[currentTestimonial].text}"</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                - {testimonials[currentTestimonial].name}
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="relative overflow-hidden h-[40rem]  rounded-3xl shadow-2xl">
                <Image
                  src="https://i.pinimg.com/736x/5e/38/01/5e3801609851aafbbc2b1e180cdb0883.jpg"
                  alt="Premium Honey Collection"
                  width={600}
                  height={700}
                  className="object-cover w-full"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Fresh Harvest</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-amber-600 text-white rounded-2xl p-4 shadow-xl">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-90">Customer Rating</div>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 blur-3xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
