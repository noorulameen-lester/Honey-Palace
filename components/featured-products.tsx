"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
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
        <p className="text-lg text-gray-400 animate-pulse">Loading featured products...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }
  if (!products.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-amber-600 dark:text-amber-400">
    
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col bg-white dark:bg-[#1f1f25] rounded-2xl shadow-md dark:shadow-lg border border-gray-200 dark:border-[#2a2a35] p-5 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-52 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{product.name}</h3>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mb-4">
                ₹{product.price}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400/10"
                  onClick={() => router.push(`/products/${product._id}`)}
                >
                  View
                </Button>
                <Button
                  size="icon"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
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

              {/* Buy Now button full width */}
              <Button
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
                onClick={() => router.push(`/checkout?productId=${product._id}&qty=1`)}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full px-8 py-3 text-lg"
            onClick={() => router.push("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
