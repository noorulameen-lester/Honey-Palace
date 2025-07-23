"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
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

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?featured=true");
        if (!res.ok) throw new Error("Failed to fetch featured products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products.slice(0, 4));
        } else {
          setError(data.error || "Failed to fetch featured products");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">Loading featured products...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  if (!products.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">Featured Products</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product._id}
              className="group hover:shadow-2xl card-hover-up transition-all duration-300 border-0 shadow-lg rounded-3xl bg-white/90 dark:bg-zinc-900/80 flex flex-col"
            >
              <CardContent className="p-0 flex flex-col flex-1">
                <div className="relative overflow-hidden rounded-t-3xl">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name || "Product image"}
                    width={400}
                    height={400}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-2 line-clamp-2 min-h-[36px]">
                    {product.description || "No description available."}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
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
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-extrabold text-amber-600">₹{product.price}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full px-8 py-3 text-lg"
            onClick={() => router.push("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
