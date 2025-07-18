"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products)
        } else {
          setError(data.error || "Failed to fetch products")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch products")
        setLoading(false)
      })
  }, [])

  // Show only the first 4 products as featured
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our most popular honey varieties, each carefully selected for their unique flavor and quality
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {(() => {
                      let imgSrc = "/placeholder.svg";
                      if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0]) {
                        imgSrc = product.images[0];
                      } else if (typeof product.image === "string" && product.image) {
                        imgSrc = product.image;
                      }
                      return (
                        <Image
                          src={imgSrc}
                          alt={String(product.name || 'Product image')}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      );
                    })()}
                    {product.badge && (
                      <Badge
                        className={`absolute top-4 left-4 ${
                          product.badge === "Best Seller"
                            ? "bg-amber-600"
                            : product.badge === "Premium"
                              ? "bg-purple-600"
                              : product.badge === "New"
                                ? "bg-green-600"
                                : "bg-red-600"
                        }`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {(() => {
                        if (!product.description) return null;
                        const lines = product.description.split(/\.|\n/).map((s: string) => s.trim()).filter(Boolean);
                        return lines.slice(0, 2).join('. ') + (lines.length > 2 ? '...' : '');
                      })()}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {product.rating} ({product.reviews || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-600">
                          {product.price ? `₹${product.price}` : ""}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/products/${product._id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          View Details
                        </Button>
                      </Link>
                      <Button size="icon" className="bg-amber-600 hover:bg-amber-700">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
