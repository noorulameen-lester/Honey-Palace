import { Shield, Truck, Award, Heart } from "lucide-react"

const highlights = [
  {
    icon: Shield,
    title: "100% Pure & Natural",
    description: "No additives, no preservatives - just pure honey as nature intended",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over $50 across the United States",
  },
  {
    icon: Award,
    title: "Quality Certified",
    description: "All our honey is tested and certified for purity and quality",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Rich in antioxidants and natural enzymes for your wellbeing",
  },
]

export function Highlights() {
  return (
    <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{highlight.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{highlight.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
