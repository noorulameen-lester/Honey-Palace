"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Search, Filter } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { addToCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const categories = ["all", "Raw Honey", "Specialty", "Dark Honey", "Floral"]

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
      .catch(err => {
        setError("Failed to fetch products")
        setLoading(false)
      })
  }, [])

  const filteredProducts = products
    .filter(
      (product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory),
    )
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Products</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover our premium collection of pure, natural honey
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
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
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {(() => {
                        if (!product.description) return null;
                        // Split by period, fallback to line break
                        const lines = product.description.split(/\.|\n/).map((s: string) => s.trim()).filter(Boolean);
                        return lines.slice(0, 1).join('. ') + (lines.length > 2 ? '...' : '');
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
                      <Button size="icon" className="bg-amber-600 hover:bg-amber-700" onClick={() => {
                        addToCart(product, 1);
                        toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
                      }}>
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
