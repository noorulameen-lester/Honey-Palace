"use client"

import { useEffect, useState } from "react"
// Adjust the import paths below to match your actual file structure
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Package, Calendar, BarChart3, PieChart, Download

} from "lucide-react"

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("6months")

  // Reset all analytics
  const handleResetAllAnalytics = async () => {
    if (!window.confirm("Are you sure you want to reset all analytics? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/analytics/reset-all", { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        alert(data?.error || "Failed to reset analytics");
        return;
      }
      alert("Analytics reset successfully");
      // Refresh the page or refetch data
      window.location.reload();
    } catch (err) {
      alert("Failed to reset analytics");
    }
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const [ordersRes, bulkOrdersRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/bulk-orders"),
        ])
        const ordersData = await ordersRes.json()
        const bulkOrdersData = await bulkOrdersRes.json()
        // Build customers from orders and bulk orders
        let customersArr: any[] = []
        if (ordersData.success) {
          customersArr = customersArr.concat(
            ordersData.orders.map((order: any) => ({
              email: order.formData?.email,
              name: `${order.formData?.firstName || ""} ${order.formData?.lastName || ""}`.trim(),
            }))
          )
        }
        if (bulkOrdersData.success) {
          customersArr = customersArr.concat(
            bulkOrdersData.orders.map((order: any) => ({
              email: order.formData?.email,
              name: order.formData?.contactPerson || order.formData?.businessName || "",
            }))
          )
        }
        // Deduplicate by email
        const deduped: Record<string, any> = {}
        for (const c of customersArr) {
          if (!c.email) continue
          if (!deduped[c.email]) {
            deduped[c.email] = { ...c }
          }
        }
        setAnalytics((prev: any) => ({
          ...prev,
          totalCustomers: Object.keys(deduped).length,
        }))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Loading analytics...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>
  }

  // Provide fallback values for missing fields to avoid errors
  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    avgOrderValue = 0,
    revenueGrowth = 0,
    orderGrowth = 0,
    customerGrowth = 0,
    salesData = [],
    topProducts = [],
    customerSegments = [],
    shippedOrders = 0,
    pendingOrders = 0,
  } = analytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleResetAllAnalytics}
            title="Reset all analytics"
          >
            Reset All Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">
                    +{revenueGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">
                    +{orderGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">
                    +{customerGrowth}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Order Value */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{avgOrderValue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">
                    +2.1%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {/* Revenue Trend & Top Products */}
      {/* Replace hardcoded salesData and topProducts below with API data */}
    </div>
  )
}
