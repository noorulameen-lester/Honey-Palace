"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Star, ShoppingCart, Search, Filter } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { addToCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
  badge?: string;
  rating?: number;
  reviews?: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = ["all", "Raw Honey", "Specialty", "Dark Honey", "Floral"];
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.error || "Failed to fetch products");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <Header />
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Our Products</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">
            Explore our premium honey collection crafted with love.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-10 items-center justify-between">
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full shadow-sm border-gray-200 focus:border-amber-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-full shadow-sm border-gray-200 w-40">
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
              <SelectTrigger className="rounded-full shadow-sm border-gray-200 w-40">
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
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600 dark:text-gray-300 animate-pulse">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600 dark:text-gray-300">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg rounded-3xl bg-white/90 dark:bg-zinc-900/80 flex flex-col"
              >
                <CardContent className="p-0 flex flex-col flex-1">
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name || "Product image"}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      unoptimized
                    />
                    {product.badge && (
                      <Badge
                        className={`absolute top-4 left-4 px-4 py-1 text-sm font-semibold rounded-full shadow ${
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
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                    <p className="text-gray-500 dark:text-gray-300 text-sm mb-3 line-clamp-2 min-h-[40px]">
                      {product.description || "No description available."}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
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
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {product.rating || 0} ({product.reviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-extrabold text-amber-600">₹{product.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/80 hover:bg-amber-50 border-amber-100"
                        onClick={() => router.push(`/products/${product._id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="icon"
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          try {
                            addToCart(product, 1);
                            toast({ title: "Added to Cart", description: `${product.name} added to your cart.` });
                          } catch {
                            toast({
                              title: "Error",
                              description: "Could not add to cart. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full"
                        onClick={() => {
                          try {
                            addToCart(product, 1);
                            window.location.href = "/checkout";
                          } catch {
                            toast({
                              title: "Error",
                              description: "Could not proceed to checkout. Try again.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Buy Now
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
  );
}