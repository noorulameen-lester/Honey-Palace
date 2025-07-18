import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Highlights } from "@/components/highlights"
import { BrandStory } from "@/components/brand-story"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <Highlights />
      <BrandStory />
      <TestimonialsCarousel />
      <Footer />
    </main>
  )
}
