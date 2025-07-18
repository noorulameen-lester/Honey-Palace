"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react"
import { useState } from "react"

const salesData = [
  { month: "Jan", revenue: 45000, orders: 89, customers: 67 },
  { month: "Feb", revenue: 52000, orders: 104, customers: 78 },
  { month: "Mar", revenue: 48000, orders: 96, customers: 71 },
  { month: "Apr", revenue: 61000, orders: 122, customers: 89 },
  { month: "May", revenue: 55000, orders: 110, customers: 82 },
  { month: "Jun", revenue: 67000, orders: 134, customers: 95 },
]

const topProducts = [
  { name: "500ml Raw Honey", sales: 145, revenue: 50750, percentage: 31.2 },
  { name: "250ml Raw Honey", sales: 234, revenue: 46800, percentage: 28.8 },
  { name: "1 Litre Raw Honey", sales: 89, revenue: 62300, percentage: 38.3 },
  { name: "Royal Glow Honey Wax", sales: 67, revenue: 2680, percentage: 1.7 },
]

const customerSegments = [
  { segment: "VIP", count: 23, percentage: 14.7, revenue: 89000 },
  { segment: "Active", count: 89, percentage: 57.1, revenue: 156000 },
  { segment: "New", count: 31, percentage: 19.9, revenue: 45000 },
  { segment: "Inactive", count: 13, percentage: 8.3, revenue: 12000 },
]

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")

  const totalRevenue = 162530
  const totalOrders = 23
  const totalCustomers = 156
  const avgOrderValue = Math.round(totalRevenue / totalOrders)

  const revenueGrowth = 15.2
  const orderGrowth = 12.8
  const customerGrowth = 8.4

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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">+{revenueGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">+{orderGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">+{customerGrowth}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{avgOrderValue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium ml-1">+2.1%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(data.revenue / 70000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{data.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{data.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      {product.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments & Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        segment.segment === "VIP"
                          ? "bg-purple-500"
                          : segment.segment === "Active"
                            ? "bg-green-500"
                            : segment.segment === "New"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">{segment.segment}</p>
                      <p className="text-sm text-gray-600">{segment.count} customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{segment.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{segment.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">3.2%</p>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">+0.5%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customer Retention</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">+2.1%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cart Abandonment</p>
                  <p className="text-2xl font-bold">23%</p>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 ml-1">-1.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Return Rate</p>
                  <p className="text-2xl font-bold">2.1%</p>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 ml-1">-0.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">8</p>
              <p className="text-sm text-gray-600">Orders Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">₹12,450</p>
              <p className="text-sm text-gray-600">Revenue Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">5</p>
              <p className="text-sm text-gray-600">New Customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
