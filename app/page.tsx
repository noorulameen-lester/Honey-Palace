"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import Head from "next/head";
import Image from "next/image";
import { FeaturedProducts } from "@/components/featured-products";
import { BrandStory } from "@/components/brand-story"; // ✅ Our Story Component
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Leaf, Truck, ShieldCheck, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen font-[Montserrat] text-gray-900 dark:text-gray-100 bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 dark:from-[#18181c] dark:via-[#23232a] dark:to-[#18181c] relative overflow-x-hidden">
        
        {/* Background Animated Gradient Blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="w-[30rem] h-[30rem] bg-yellow-800 rounded-full blur-[180px] opacity-20 absolute -top-32 -left-32 animate-pulse"></div>
          <div className="w-[24rem] h-[24rem] bg-orange-700 rounded-full blur-[150px] opacity-10 absolute bottom-20 right-0 animate-pulse"></div>
        </div>

        <Header />

        {/* ✅ Hero Section */}
        <section className="relative py-24 flex flex-col items-center justify-center text-center md:text-left">
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-6">
            {/* Left Content */}
            <div className="md:w-1/2">
              <h1 className="text-5xl md:text-6xl font-[Playfair Display] font-extrabold mb-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent animate-hero-text">
                Welcome to <span className="text-amber-600 dark:text-amber-400">Honey Palace</span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
                Experience the taste of nature with our premium collection of raw,
                unfiltered honey sourced directly from local beekeepers.
              </p>
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg transition-all duration-300 animate-bounce"
                onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
              >
                Shop Now
              </button>

              {/* About Section BELOW Shop Now */}
              <div className="mt-10 text-left">
                <h2 className="text-3xl font-[Playfair Display] font-bold text-amber-700 dark:text-amber-400 mb-3">
                  Why Choose Honey Palace?
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  At Honey Palace, we deliver 100% natural honey sourced from trusted local beekeepers. 
                  Taste the difference with pure, unfiltered goodness in every jar.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="Honey Palace/HONEY-PALACE-MAIN/images/Profile Pfic .png"
                alt="Honey Jars"
                className="rounded-3xl shadow-lg max-w-full md:max-w-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* ✅ Our Story Section (BrandStory) */}
        <section className="py-16 px-4">
          <BrandStory />
        </section>

        {/* ✅ Featured Products */}
        <section className="py-12 px-2">
          <div className="container mx-auto">
            <h2 className="text-6xl font-[Playfair Display] font-bold text-center mb-12 text-amber-600 dark:text-amber-400 animate-section-title">
              Featured Products
            </h2>
            <FeaturedProducts />
          </div>
        </section>

        {/* ✅ Features Section */}
        <section className="py-16 bg-amber-4000 dark:bg-gray-900">
          <div className="container mx-auto grid md:grid-cols-4 gap-8 text-center px-6">
            
            <div className="group p-6 rounded-xl shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                <Leaf className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">100% Pure & Natural</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No additives, no preservatives - just pure honey as nature intended.
              </p>
            </div>

            <div className="group p-6 rounded-xl shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                <Truck className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Free delivery on orders over $50 across the United States.
              </p>
            </div>

            <div className="group p-6 rounded-xl shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                <ShieldCheck className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Certified</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All our honey is tested and certified for purity and quality.
              </p>
            </div>

            <div className="group p-6 rounded-xl shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                <HeartPulse className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Health Benefits</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Rich in antioxidants and natural enzymes for your wellbeing.
              </p>
            </div>

          </div>
        </section>

        {/* ✅ Customer Reviews */}
        <section className="py-10 px-3">
          <div className="container mx-auto">
            <TestimonialsCarousel />
          </div>
        </section>
        <Footer />

        {/* ✅ Animations */}
        <style jsx global>{`
          @keyframes hero-text-fade-in {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-hero-text { animation: hero-text-fade-in 1.2s cubic-bezier(.4,0,.2,1) both; }

          @keyframes section-title-fade-in {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-section-title { animation: section-title-fade-in 1s cubic-bezier(.4,0,.2,1) both; }

          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
          }
          .animate-bounce { animation: bounce 1.2s infinite alternate; }
        `}</style>
      </main>
    </>
  );
}


