"use client"
// Cloudinary config
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmg8aykl8";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, TrendingUp, Eye, Upload, X } from "lucide-react"
import Image from "next/image"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"



export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    images: [] as File[],
    imagePreviews: [] as string[],
    image: null as File | null,
    imagePreview: "",
    features: [""],
    specifications: [{ key: "", value: "" }],
    benefits: [""],
    isBulk: false,
    minBulkQuantity: "",
    bulkPrice: "",
  })
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/products")
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setError("Server error: Invalid JSON response");
        setLoading(false);
        return;
      }
      if (data.success) {
        setProducts(data.products)
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "Active").length
  const lowStockProducts = products.filter((p) => p.lowStock).length
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

  const handleSaveProduct = async () => {
    if (!editingProduct) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description,
          price: Number(editingProduct.price),
          stock: Number(editingProduct.stock),
          category: editingProduct.category,
        }),
      })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
        setEditingProduct(null)
      }
    } catch (err) {
      // Optionally, show error
    }
    setSavingEdit(false)
  }

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProductId(productId)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        setDeletingProductId(null);
        return;
      }
      if (data.success) {
        fetchProducts()
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product");
    }
    setDeletingProductId(null)
  }

  const handleAddProduct = async () => {
    if (adding) return; // Prevent multiple submissions
    setAdding(true)
    let imageUrls: string[] = [];
    if (newProduct.images && newProduct.images.length > 0) {
      for (const file of newProduct.images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrls.push(data.secure_url || "");
      }
    }
    // fallback for single image (legacy)
    let imageUrl = "";
    if (!imageUrls.length && newProduct.image) {
      const formData = new FormData();
      formData.append("file", newProduct.image);
      formData.append("upload_preset", "ml_default");
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.secure_url || "";
    }
    // Always ensure a unique id is present for cart/buy logic
    const productToSave = {
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      stock: Number(newProduct.stock),
      category: newProduct.category,
      images: imageUrls,
      image: imageUrl,
      status: "Active",
      sold: 0,
      revenue: 0,
      lowStock: Number(newProduct.stock) < 10,
      features: newProduct.features.filter(f => f.trim() !== ""),
      specifications: Object.fromEntries(newProduct.specifications.filter(s => s.key.trim() && s.value.trim()).map(s => [s.key, s.value])),
      benefits: newProduct.benefits.filter(b => b.trim() !== ""),
      isBulk: newProduct.isBulk,
      minBulkQuantity: newProduct.isBulk ? Number(newProduct.minBulkQuantity) : undefined,
      bulkPrice: newProduct.isBulk ? Number(newProduct.bulkPrice) : undefined,
      // Add a fallback id if not present (for local dev, not prod DB)
      id: `${newProduct.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      })
      const data = await res.json()
      if (data.success) {
        await fetchProducts()
        setIsAddingProduct(false)
        setNewProduct({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          category: "",
          images: [],
          imagePreviews: [],
          image: null,
          imagePreview: "",
          features: [""],
          specifications: [{ key: "", value: "" }],
          benefits: [""],
          isBulk: false,
          minBulkQuantity: "",
          bulkPrice: "",
        })
      }
    } catch (err) {
      // Optionally, show error
    }
    setAdding(false)
  }

  // Revoke object URLs to prevent memory leaks
  const imagePreviewsRef = useRef<string[]>([])
  useEffect(() => {
    // Clean up previews on unmount
    return () => {
      imagePreviewsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Revoke old previews
    imagePreviewsRef.current.forEach(url => URL.revokeObjectURL(url))
    const previews = files.map(file => URL.createObjectURL(file))
    imagePreviewsRef.current = previews
    setNewProduct((prev) => ({
      ...prev,
      images: files,
      imagePreviews: previews,
    }))
  }

  // Remove image by index from images and previews
  const removeImage = (idx: number) => {
    setNewProduct(prev => {
      // Revoke the object URL for the preview being removed
      if (prev.imagePreviews[idx]) {
        URL.revokeObjectURL(prev.imagePreviews[idx])
      }
      const newImages = prev.images.filter((_, i) => i !== idx)
      const newPreviews = prev.imagePreviews.filter((_, i) => i !== idx)
      // Update the ref as well
      imagePreviewsRef.current = newPreviews
      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      }
    })
  }

  // Reset all products (backend + frontend)
  const handleResetProducts = async () => {
    if (!window.confirm("Are you sure you want to reset all products and revenue? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/analytics/reset-products", { method: "POST" });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        return;
      }
      if (!data.success) {
        alert(data?.error || "Failed to reset products");
        return;
      }
      await fetchProducts();
    } catch (err) {
      alert("Failed to reset products");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Bulk Product Toggle */}
                <div className="flex items-center space-x-4">
                  <Label htmlFor="isBulk">Bulk Product?</Label>
                  <input
                    id="isBulk"
                    type="checkbox"
                    checked={newProduct.isBulk}
                    onChange={e => setNewProduct(prev => ({ ...prev, isBulk: e.target.checked }))}
                    className="h-5 w-5"
                  />
                </div>
                {newProduct.isBulk && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minBulkQuantity">Min No. of Products</Label>
                      <Input
                        id="minBulkQuantity"
                        type="number"
                        placeholder="e.g. 10"
                        value={newProduct.minBulkQuantity !== undefined ? String(newProduct.minBulkQuantity ?? '') : ''}
                        onChange={e => setNewProduct(prev => ({ ...prev, minBulkQuantity: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulkPrice">Bulk Price (₹)</Label>
                      <Input
                        id="bulkPrice"
                        type="number"
                        placeholder="e.g. 200"
                        value={newProduct.bulkPrice !== undefined ? String(newProduct.bulkPrice ?? '') : ''}
                        onChange={e => setNewProduct(prev => ({ ...prev, bulkPrice: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="images">Product Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {newProduct.imagePreviews && newProduct.imagePreviews.length > 0 ? (
                      <div className="flex flex-wrap gap-4 justify-center">
                        {newProduct.imagePreviews.map((preview, idx) => (
                          <div key={idx} className="relative h-24 w-24 rounded-lg overflow-hidden">
                            <Image src={preview || "/placeholder.svg"} alt={`Product preview ${idx + 1}`} fill className="object-cover" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removeImage(idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload product images</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="images-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("images-upload")?.click()}
                        >
                          Choose Images
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="0"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, originalPrice: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Honey, Beeswax"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                    />
                  </div>
                </div>
                {/* Advanced Section: Features, Specifications, Benefits */}
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="features">
                    <AccordionTrigger>Features</AccordionTrigger>
                    <AccordionContent>
                      {newProduct.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <Input
                            value={String(feature ?? "")}
                            placeholder={`Feature ${idx + 1}`}
                            onChange={e => {
                              const features = [...newProduct.features]
                              features[idx] = e.target.value
                              setNewProduct(prev => ({ ...prev, features }))
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setNewProduct(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
                            }}
                            disabled={newProduct.features.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewProduct(prev => ({ ...prev, features: [...prev.features, ""] }))}
                      >
                        Add Feature
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="specifications">
                    <AccordionTrigger>Specifications</AccordionTrigger>
                    <AccordionContent>
                      {newProduct.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <Input
                            value={String(spec.key ?? "")}
                            placeholder="Key"
                            onChange={e => {
                              const specifications = [...newProduct.specifications]
                              specifications[idx].key = e.target.value
                              setNewProduct(prev => ({ ...prev, specifications }))
                            }}
                          />
                          <Input
                            value={String(spec.value ?? "")}
                            placeholder="Value"
                            onChange={e => {
                              const specifications = [...newProduct.specifications]
                              specifications[idx].value = e.target.value
                              setNewProduct(prev => ({ ...prev, specifications }))
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setNewProduct(prev => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== idx) }))
                            }}
                            disabled={newProduct.specifications.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewProduct(prev => ({ ...prev, specifications: [...prev.specifications, { key: "", value: "" }] }))}
                      >
                        Add Specification
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="benefits">
                    <AccordionTrigger>Benefits</AccordionTrigger>
                    <AccordionContent>
                      {newProduct.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                          <Input
                            value={String(benefit ?? "")}
                            placeholder={`Benefit ${idx + 1}`}
                            onChange={e => {
                              const benefits = [...newProduct.benefits]
                              benefits[idx] = e.target.value
                              setNewProduct(prev => ({ ...prev, benefits }))
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setNewProduct(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== idx) }))
                            }}
                            disabled={newProduct.benefits.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setNewProduct(prev => ({ ...prev, benefits: [...prev.benefits, ""] }))}
                      >
                        Add Benefit
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-amber-600 hover:bg-amber-700" disabled={adding}>
                    {adding ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleResetProducts}
            className="ml-2"
            title="Reset all products"
          >
            Reset All Products
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeProducts}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{lowStockProducts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <Card key={product._id || product.id || idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                  {(() => {
                    let imgSrc = "/placeholder.svg";
                    if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === "string" && product.images[0]) {
                      imgSrc = product.images[0];
                    } else if (typeof product.image === "string" && product.image && product.image.trim() !== "") {
                      imgSrc = product.image;
                    }
                    return (
                      imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={String(product.name || 'Product image')}
                          fill
                          className="object-cover"
                        />
                      ) : null
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
                    {product.lowStock && (
                      <Badge variant="destructive" className="ml-2">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{product.description || "No description available."}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Price:</span>
                      <span className="font-medium">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                      <span className={`font-medium ${product.lowStock ? "text-red-600" : "text-green-600"}`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Sold:</span>
                      <span className="font-medium">{product.sold} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Revenue:</span>
                      <span className="font-medium text-green-600">
                        ₹{typeof product.revenue === "number" ? product.revenue.toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex space-x-2">
                  <Dialog open={viewDialogOpen} onOpenChange={(open) => {
                    setViewDialogOpen(open)
                    if (!open) setSelectedProduct(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setViewDialogOpen(true) }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                      </DialogHeader>
                      {selectedProduct && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                              {(() => {
                                let imgSrc = "/placeholder.svg";
                                if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 && typeof selectedProduct.images[0] === "string" && selectedProduct.images[0]) {
                                  imgSrc = selectedProduct.images[0];
                                } else if (typeof selectedProduct.image === "string" && selectedProduct.image) {
                                  imgSrc = selectedProduct.image;
                                }
                                return (
                                  <Image
                                    src={imgSrc}
                                    alt={String(selectedProduct.name || 'Product image')}
                                    fill
                                    className="object-cover"
                                  />
                                );
                              })()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{selectedProduct.category}</p>
                              <p className="text-2xl font-bold text-amber-600">₹{selectedProduct.price}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{selectedProduct.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Stock</p>
                              <p className="font-semibold">{selectedProduct.stock} units</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Units Sold</p>
                              <p className="font-semibold">{selectedProduct.sold}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                              <p className="font-semibold text-green-600">
                                ₹{selectedProduct.revenue?.toLocaleString?.() ?? 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">Status</p>
                              <Badge variant="outline">{selectedProduct.status}</Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editDialogOpen} onOpenChange={(open) => {
                    setEditDialogOpen(open)
                    if (!open) setEditingProduct(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct({ ...product, id: String(product._id || product.id) }); setEditDialogOpen(true) }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Product Name</Label>
                              <Input
                                id="edit-name"
                                value={editingProduct.name ?? ""}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-price">Price (₹)</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                value={editingProduct.price !== undefined ? String(editingProduct.price) : ""}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, price: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editingProduct.description ?? ""}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-stock">Stock Quantity</Label>
                              <Input
                                id="edit-stock"
                                type="number"
                                value={editingProduct.stock !== undefined ? String(editingProduct.stock) : ""}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, stock: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Input
                                id="edit-category"
                                value={editingProduct.category ?? ""}
                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveProduct} className="bg-amber-600 hover:bg-amber-700" disabled={savingEdit}>
                              {savingEdit ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                  </svg>
                                  Saving...
                                </span>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProduct(String(product._id || product.id))} disabled={deletingProductId === String(product._id || product.id)}>
                    {deletingProductId === String(product._id || product.id) ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
