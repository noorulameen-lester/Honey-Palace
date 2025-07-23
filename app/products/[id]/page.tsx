"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          setError(data.error || "Failed to fetch product");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <Header />
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-600 dark:text-gray-300 animate-pulse">Loading product...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : product ? (
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-3xl shadow-xl border-0 bg-white/90 dark:bg-zinc-900/80 flex flex-col md:flex-row">
              <div className="md:w-1/2 flex items-center justify-center p-8">
                <div className="relative w-full h-80">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name || "Product image"}
                    fill
                    className="object-contain rounded-2xl bg-white"
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
              </div>
              <CardContent className="flex-1 p-8 flex flex-col justify-center">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {product.rating || 0} ({product.reviews || 0})
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
                <div className="mb-6">
                  <span className="text-2xl font-extrabold text-amber-600">₹{product.price}</span>
                </div>
                <div className="flex gap-3 mb-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/80 hover:bg-amber-50 border-amber-100"
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
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full"
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
                <Button variant="ghost" onClick={() => router.back()} className="mt-2">
                  ← Back to Products
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
}