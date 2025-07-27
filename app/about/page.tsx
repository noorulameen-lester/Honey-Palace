"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Award, Users, Leaf, Heart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950 transition-colors duration-700">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30 animate-pulse absolute -top-32 -left-32"></div>
        <div className="w-72 h-72 bg-orange-300 rounded-full blur-2xl opacity-20 animate-pulse absolute top-24 right-0"></div>
      </div>
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 py-20 animate-fade-in-down transition-all duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent animate-gradient-move"
              style={{ fontFamily: "'Montserrat', 'Playfair Display', sans-serif" }}
            >
              Our Story: From Hive to Heart
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in">
              For over 3 years, Honey Palace has been dedicated to bringing you the purest, most delicious honey
              straight from nature's heart to your table.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                At Honey Palace, we believe honey is more than just nature’s sweetness – 
                it’s a symbol of care, purity, and tradition. Founded by Nafeesa TM,
                a woman entrepreneur from Wandoor with deep roots in farming, our mission is to revive
                the age-old art of beekeeping while empowering local communities.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Every jar of Honey Palace honey carries our promise of 100% natural goodness,
                sustainable practices, and respect for the environment – bringing the purest honey from our hives to your home.
              </p>
              <div>
                <Link href="/products">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                    Explore Our Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Beekeeper working with hives"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
                priority
              />
              {/* Animated honey drop */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-amber-400 rounded-full opacity-70 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-amber-50 dark:bg-amber-950/20 animate-fade-in-up transition-all duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core principles guide everything we do at Honey Palace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sustainability",
                description: "We support eco-friendly beekeeping practices that protect our environment.",
              },
              {
                icon: Heart,
                title: "Purity",
                description: "100% pure honey with no additives, preservatives, or artificial ingredients.",
              },
              {
                icon: Users,
                title: "Community",
                description: "Supporting local beekeepers and their families across the country.",
              },
              {
                icon: Award,
                title: "Quality",
                description: "Rigorous testing and quality control ensure the finest honey reaches you.",
              },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900 transition-shadow duration-500 bg-white/80 dark:bg-gray-900/80">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 text-white rounded-full mb-6 animate-float">
                      <Icon className="w-8 h-8" aria-label={value.title} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950 animate-fade-in-up transition-all duration-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Partner Beekeepers" },
              { number: "100+", label: "Happy Customers" },
              { number: "3", label: "Years of Experience" },
              { number: "100%", label: "Pure & Natural" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2 hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold text-amber-600 animate-count">{stat.number}</div>
                <div className="text-lg text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 animate-fade-in-up transition-all duration-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Experience Pure Honey?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Honey Palace for their premium honey needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 shadow-lg hover:scale-105 transition-all duration-300">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 bg-transparent hover:bg-amber-50 hover:scale-105 transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-15px);}
        }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-down { animation: fade-in-down 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-float { animation: float 2s ease-in-out infinite; }
        .animate-bounce { animation: bounce 1.2s infinite; }
        .animate-count { animation: fade-in-up 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 3s linear infinite alternate;
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  )
}
