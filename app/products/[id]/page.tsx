"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, Zap } from "lucide-react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { addToCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product)
        } else {
          setError(data.error || "Failed to fetch product")
        }
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to fetch product")
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    console.log(`Added ${quantity} of ${product.name} to cart`)
    // Add to cart logic here
  }

  const handleBuyNow = () => {
    if (!product) return
    // Create buy now item
    const buyNowItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || product.image,
    }
    // Store in session storage
    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem))
    // Redirect to checkout with buy now flag
    router.push("/checkout?buyNow=true")
  }

  const incrementQuantity = () => {
    if (product && quantity < (product.stockCount || 99)) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading product...</div>
  }
  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">{error || "Product not found"}</div>
  }

  // Determine stock count and inStock status (only after product is loaded)
  const stock = typeof product.stock === 'number' ? product.stock : (typeof product.stockCount === 'number' ? product.stockCount : 99);
  const inStock = stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
              <Image
                src={product.images?.[selectedImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.originalPrice > product.price && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  Save ₹{product.originalPrice - product.price}
                </Badge>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-amber-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-9">
            <div>
              <h1 className="text-3xl font-bold py-10 text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                    {product.rating} ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-amber-600">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <Badge variant="outline" className="text-green-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock ({stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-lg py-3"
                  disabled={!inStock}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={() => {
                    addToCart(product, quantity);
                    toast({ title: "Added to Cart", description: `${product.name} (x${quantity}) has been added to your cart.` });
                  }}
                  variant="outline"
                  className="flex-1 text-lg py-3 bg-transparent"
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button variant="ghost" onClick={() => setIsWishlisted(!isWishlisted)} className="flex-1">
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>
                <Button variant="ghost" className="flex-1">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Free Shipping</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">On orders above ₹500</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">100% Natural</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">FSSAI Certified</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RotateCcw className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Easy Returns</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">7-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(product.features || []).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="space-y-4">
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                        >
                          <span className="font-medium">{key}</span>
                          <span className="text-gray-600 dark:text-gray-300">{value as string}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Health Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(product.benefits || []).map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="space-y-6">
                    {/* Sample reviews, you can fetch real reviews if available */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Priya S.</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        "Excellent quality honey! You can taste the purity. My family loves it and we use it daily. Fast
                        delivery and great packaging too."
                      </p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Rajesh K.</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        "Pure and natural honey as promised. The taste is amazing and you can feel the quality. Will
                        definitely order again!"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}
