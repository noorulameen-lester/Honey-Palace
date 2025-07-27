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

// Firebase config (replace with your own)
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams() as Record<string, string | string[]>
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewForm, setReviewForm] = useState({ name: "", gmail: "", rating: 5, text: "" })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [editingReviewIdx, setEditingReviewIdx] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product)
          setReviews(data.product.reviewsList || [])
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
    addToCart(product, quantity)
    toast({ title: "Added to Cart", description: `${product.name} (x${quantity}) has been added to your cart.` })
  }

  const handleBuyNow = () => {
    if (!product) return
    const buyNowItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || product.image,
    }
    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem))
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

  // --- Review Form Handlers ---
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value })
  }
  const handleRatingChange = (rating: number) => {
    setReviewForm({ ...reviewForm, rating })
  }
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingReview(true)
    setTimeout(() => {
      if (editingReviewIdx !== null) {
        // Edit mode
        const updatedReviews = [...reviews]
        updatedReviews[editingReviewIdx] = {
          ...updatedReviews[editingReviewIdx],
          ...reviewForm,
          date: new Date().toISOString(),
        }
        setReviews(updatedReviews)
        setEditingReviewIdx(null)
      } else {
        // New review
        setReviews([
          {
            name: reviewForm.name,
            gmail: reviewForm.gmail,
            rating: reviewForm.rating,
            text: reviewForm.text,
            date: new Date().toISOString(),
          },
          ...reviews,
        ])
      }
      setReviewForm({ name: "", gmail: "", rating: 5, text: "" })
      setSubmittingReview(false)
      toast({ title: "Review submitted!", description: "Thank you for your feedback." })
    }, 500)
  }
  const handleEditReview = (idx: number) => {
    const review = reviews[idx]
    setReviewForm({
      name: review.name || "",
      gmail: review.gmail || "",
      rating: review.rating || 5,
      text: review.text || "",
    })
    setEditingReviewIdx(idx)
  }
  const handleDeleteReview = (idx: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((_, i) => i !== idx))
      if (editingReviewIdx === idx) {
        setReviewForm({ name: "", gmail: "", rating: 5, text: "" })
        setEditingReviewIdx(null)
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading product...</div>
  }
  if (error || !product) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">{error || "Product not found"}</div>
  }

  const stock = typeof product.stock === 'number' ? product.stock : (typeof product.stockCount === 'number' ? product.stockCount : 99);
  const inStock = stock > 0;

  // Calculate live average rating from reviews
  const liveRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : product.rating || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-[Montserrat]">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
              <Image
                src={Array.isArray(product.images) && product.images.length > 0 && product.images[selectedImage] && product.images[selectedImage].trim() !== ""
                  ? product.images[selectedImage]
                  : (product.image && product.image.trim() !== "" ? product.image : "/placeholder.svg")}
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
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? "border-amber-600 scale-105 shadow-lg" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {image && image.trim() !== "" ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg"
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl font-extrabold py-6 text-gray-900 dark:text-white mb-2 tracking-tight">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 transition-colors duration-200 ${
                        i < Math.round(liveRating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                    {liveRating} ({reviews.length} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-400">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{product.description || "No description available."}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {inStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">In Stock ({stock} available)</span>
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
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= stock}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 buy-now-btn text-lg py-3"
                  disabled={!inStock}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 custom-btn text-lg py-3 bg-transparent"
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <Card className="rounded-2xl shadow-lg bg-white/80 dark:bg-gray-800/80 border-0">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <Card className="rounded-2xl shadow bg-white/90 dark:bg-gray-800/90 border-0">
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
              <Card className="rounded-2xl shadow bg-white/90 dark:bg-gray-800/90 border-0">
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
              <Card className="rounded-2xl shadow bg-white/90 dark:bg-gray-800/90 border-0">
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
              <Card className="rounded-2xl shadow bg-white/90 dark:bg-gray-800/90 border-0">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-8 text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <Star className="h-7 w-7 text-yellow-400" />
                    Customer Reviews
                  </h3>
                  <div className="space-y-8">
                    {reviews.length === 0 && (
                      <div className="text-gray-500 dark:text-gray-400 text-center py-8 text-lg font-medium">
                        No reviews yet. Be the first to review!
                      </div>
                    )}
                    {reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="relative bg-gradient-to-br from-amber-100/60 to-yellow-50 dark:from-gray-900/60 dark:to-gray-800/80 rounded-xl p-6 shadow group transition hover:shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-amber-800 dark:text-amber-200">{review.name || "Anonymous"}</span>
                          {review.gmail && (
                            <span className="text-xs text-blue-600 dark:text-blue-400 ml-2 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                              {review.gmail}
                            </span>
                          )}
                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            {review.date ? new Date(review.date).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-2">{review.text}</p>
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="text-xs text-amber-600 hover:underline font-semibold"
                            onClick={() => handleEditReview(idx)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-600 hover:underline font-semibold"
                            onClick={() => handleDeleteReview(idx)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Write a Review Form */}
                  <form
                    className="mt-12 bg-gradient-to-br from-amber-50/80 to-yellow-100/80 dark:from-gray-900/80 dark:to-gray-800/80 rounded-2xl p-8 shadow-inner border border-amber-100 dark:border-gray-800"
                    onSubmit={handleReviewSubmit}
                  >
                    <h4 className="text-xl font-bold mb-6 text-amber-700 dark:text-amber-300">
                      {editingReviewIdx !== null ? "Edit Review" : "Write a Review"}
                    </h4>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={reviewForm.name}
                        onChange={handleReviewChange}
                        className="flex-1 px-4 py-2 rounded-lg border border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <input
                        type="email"
                        name="gmail"
                        placeholder="Your Gmail (optional)"
                        value={reviewForm.gmail}
                        onChange={handleReviewChange}
                        className="flex-1 px-4 py-2 rounded-lg border border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Your Rating:</span>
                        {[1,2,3,4,5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className="focus:outline-none"
                          >
                            <Star className={`h-7 w-7 ${reviewForm.rating >= star ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      name="text"
                      placeholder="Write your review..."
                      value={reviewForm.text}
                      onChange={handleReviewChange}
                      className="w-full px-4 py-3 rounded-lg border border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
                      rows={4}
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="submit" className="buy-now-btn text-base font-bold px-8 py-2" disabled={submittingReview}>
                        {submittingReview
                          ? (editingReviewIdx !== null ? "Updating..." : "Submitting...")
                          : (editingReviewIdx !== null ? "Update Review" : "Submit Review")}
                      </Button>
                      {editingReviewIdx !== null && (
                        <Button
                          type="button"
                          variant="outline"
                          className="custom-btn text-base font-bold px-8 py-2"
                          onClick={() => {
                            setReviewForm({ name: "", gmail: "", rating: 5, text: "" })
                            setEditingReviewIdx(null)
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        .custom-btn {
          background: #e88c24;
          color: #fff;
          border-radius: 1.5rem;
          font-weight: 700;
          border: none;
          box-shadow: 0 2px 8px rgba(232,140,36,0.08);
          transition: background 0.2s, color 0.2s, transform 0.15s;
          outline: none;
          cursor: pointer;
        }
        .custom-btn:hover, .custom-btn:focus {
          background: #c76d0a;
          color: #fff;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 16px rgba(232,140,36,0.16);
        }
        .custom-btn:active {
          background: #a85a08;
          transform: scale(0.98);
        }
        .dark .custom-btn {
          background: #fbbf24;
          color: #222;
          box-shadow: 0 2px 8px rgba(251,191,36,0.08);
        }
        .dark .custom-btn:hover, .dark .custom-btn:focus {
          background: #f59e0b;
          color: #222;
        }
        .dark .custom-btn:active {
          background: #d97706;
        }
        .buy-now-btn {
          background: #16a34a;
          color: #fff;
          border-radius: 1.5rem;
          font-weight: 700;
          border: none;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          outline: none;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(22,163,74,0.08);
        }
        .buy-now-btn:hover, .buy-now-btn:focus {
          background: #15803d;
          color: #fff;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 16px rgba(22,163,74,0.16);
        }
        .buy-now-btn:active {
          background: #166534;
          transform: scale(0.98);
        }
        .dark .buy-now-btn {
          background: #4ade80;
          color: #222;
          box-shadow: 0 2px 8px rgba(74,222,128,0.08);
        }
        .dark .buy-now-btn:hover, .dark .buy-now-btn:focus {
          background: #22c55e;
          color: #222;
        }
        .dark .buy-now-btn:active {
          background: #16a34a;
        }
      `}</style>
    </div>
  )
}
