"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/users"),
        ])
        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()
        const usersData = await usersRes.json()
        if (ordersData.success) setOrders(ordersData.orders)
        if (productsData.success) setProducts(productsData.products)
        if (usersData.success) setCustomers(usersData.users || [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate stats
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalCustomers = customers.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)

  // Calculate live status counts
  const processingOrders = orders.filter((o) => (o.status || "").toLowerCase() === "processing").length
  const shippedOrders = orders.filter((o) => (o.status || "").toLowerCase() === "shipped").length
  const deliveredOrders = orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length

  // Always get the 4 most recent orders by createdAt
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
  // Top products by sales (count of orders per product name)
  const productSales: Record<string, { name: string; sales: number; revenue: number; image?: string }> = {}
  orders.forEach((order) => {
    const items = order.cartItems || order.items || []
    items.forEach((item: any) => {
      if (!productSales[item.name]) {
        productSales[item.name] = { name: item.name, sales: 0, revenue: 0, image: item.image }
      }
      productSales[item.name].sales += item.quantity || 1
      productSales[item.name].revenue += (item.price || 0) * (item.quantity || 1)
    })
  })
  // Ensure all products are included, even if not sold yet
  products.forEach((product) => {
    if (!productSales[product.name]) {
      productSales[product.name] = {
        name: product.name,
        sales: product.sold || 0,
        revenue: product.revenue || 0,
        image: product.image,
      }
    } else {
      // Add image from product db if not present
      if (!productSales[product.name].image && product.image) {
        productSales[product.name].image = product.image
      }
    }
  })
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4)
    .map((p, i, arr) => ({
      ...p,
      trend: i === 0 ? "up" : p.sales >= arr[i - 1]?.sales ? "up" : "down",
    }))

  // Reset all data (frontend only; for real reset, call an API endpoint)
  const handleResetAll = async () => {
    if (!window.confirm("Are you sure you want to reset all orders, products, customers, and revenue? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/analytics/reset-all", { method: "POST" });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        return;
      }
      if (!data.success) {
        alert(data?.error || "Failed to reset data");
        return;
      }
      setOrders([]);
      setProducts([]);
      setCustomers([]);
      // Optionally, refetch from backend to confirm
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/users"),
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();
      if (ordersData.success) setOrders(ordersData.orders);
      if (productsData.success) setProducts(productsData.products);
      if (usersData.success) setCustomers(usersData.users || []);
    } catch (err) {
      alert("Failed to reset data");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Store
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            <Edit className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleResetAll}
            className="ml-2"
            title="Reset all data"
          >
            Reset All Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? "-" : totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? "-" : totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? "-" : totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{loading ? "-" : totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats by status */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Processing</p>
                <p className="text-2xl font-bold">{loading ? "-" : processingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Shipped</p>
                <p className="text-2xl font-bold">{loading ? "-" : shippedOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Delivered</p>
                <p className="text-2xl font-bold">{loading ? "-" : deliveredOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Orders
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : recentOrders.length === 0 ? (
                <div>No recent orders</div>
              ) : (
                recentOrders.map((order) => {
                  const items = order.cartItems || order.items || []
                  const customerName = order.formData?.firstName || order.customer || order.name || order.email || "-"
                  const customerEmail = order.formData?.email || order.email || "-"
                  return (
                    <div
                      key={order._id || order.id}
                      className="flex flex-col gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={items[0]?.image || "/placeholder.svg"} alt={items[0]?.name || "Order"} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{customerName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{customerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">₹{order.total?.toLocaleString() || items.reduce((sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 1), 0).toLocaleString()}</p>
                          <Badge
                            variant={order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</div>
                      </div>
                      {/* Show all items in the order */}
                      {/* <div className="pl-14">
                        {items.map((item: any, idx: number) => (
                          <div key={item.id || item.name || idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                            <span>₹{item.price?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Top Products
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : topProducts.length === 0 ? (
                <div>No product sales data</div>
              ) : (
                topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">₹{product.revenue.toLocaleString()}</p>
                      <div className="flex items-center justify-end">
                        {product.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">Low Stock Alert</p>
                  <p className="text-sm text-red-700 dark:text-red-300">Royal Glow Honey Wax has only 5 units left</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Restock
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">Pending Orders</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">3 orders are waiting to be processed</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Process
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
