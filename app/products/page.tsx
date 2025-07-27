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
import Head from "next/head";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
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
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 font-[Montserrat] flex flex-col">
        {/* Header */}
        <div className="w-full shadow-md bg-white dark:bg-gray-950 z-20">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 mb-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-96 h-96 bg-amber-200 dark:bg-amber-900 rounded-full blur-3xl opacity-30 animate-pulse absolute -top-32 -left-32"></div>
            <div className="w-72 h-72 bg-orange-300 dark:bg-orange-900 rounded-full blur-2xl opacity-20 animate-pulse absolute top-24 right-0"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-[Playfair Display] font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-down">
              Discover Our <span className="text-amber-600 dark:text-amber-400 animate-pulse">Premium Honey</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up">
              Taste the luxury of nature’s finest honey, curated for connoisseurs.
            </p>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 animate-fade-in-up"
              onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
            >
              Shop Now
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 animate-fade-in-up">
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-amber-500 transition-all duration-300"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-full shadow-sm w-40">
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
                <SelectTrigger className="rounded-full shadow-sm w-40">
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
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4 flex-1">
          {loading ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-2xl text-gray-600 dark:text-gray-300 animate-pulse">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-2xl text-gray-600 dark:text-gray-300">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, idx) => (
                <Card
                  key={product._id}
                  className="group border-0 shadow-xl rounded-3xl bg-white dark:bg-gray-900 flex flex-col hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <Image
                        src={
                          Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                            ? product.images[0]
                            : product.image && product.image.trim() !== ""
                            ? product.image
                            : "/placeholder.svg"
                        }
                        alt={product.name || "Product image"}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        unoptimized
                      />
                      {product.badge && (
                        <Badge
                          className={`absolute top-4 left-4 px-4 py-1 rounded-full shadow-md ${
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
                        {product.description?.trim() || "No description available."}
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
                          className="flex-1"
                          onClick={() => router.push(`/products/${product._id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="icon"
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                          onClick={() => {
                            addToCart(product, 1);
                            toast({ title: "Added to Cart", description: `${product.name} added to your cart.` });
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          sessionStorage.setItem(
                            "buyNowItem",
                            JSON.stringify({ id: product._id, name: product.name, price: product.price, quantity: 1 })
                          );
                          router.push("/checkout?buyNow=true");
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="w-full mt-12">
          <Footer />
        </div>
      </div>
    </>
  );
}
