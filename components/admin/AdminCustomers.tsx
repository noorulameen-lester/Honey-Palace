"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Users,
  UserPlus,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Eye,
  Edit,
  Star,
} from "lucide-react"

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 12

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const [ordersRes, bulkOrdersRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/bulk-orders"),
      ])
      const ordersData = await ordersRes.json()
      const bulkOrdersData = await bulkOrdersRes.json()
      let customersArr: any[] = []
      if (ordersData.success) {
        customersArr = customersArr.concat(
          ordersData.orders.map((order: any) => ({
            name: `${order.formData?.firstName || ""} ${order.formData?.lastName || ""}`.trim(),
            email: order.formData?.email,
            phone: order.formData?.phone,
            address: order.formData?.address,
            ordersCount: 1,
            totalSpent: order.total || 0,
            joinDate: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "-",
            lastOrder: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "-",
            status: "Active",
            segment: "Active",
            source: "Order",
          }))
        )
      }
      if (bulkOrdersData.success) {
        customersArr = customersArr.concat(
          bulkOrdersData.orders.map((order: any) => ({
            name: order.formData?.contactPerson || order.formData?.businessName || "",
            email: order.formData?.email,
            phone: order.formData?.phone,
            address: order.formData?.address,
            ordersCount: 1,
            totalSpent: order.total || 0,
            joinDate: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "-",
            lastOrder: order.createdAt ? new Date(order.createdAt).toISOString().split("T")[0] : "-",
            status: "Active",
            segment: "Bulk",
            source: "BulkOrder",
          }))
        )
      }
      // Deduplicate by email
      const deduped: Record<string, any> = {}
      for (const c of customersArr) {
        if (!c.email) continue
        if (!deduped[c.email]) {
          deduped[c.email] = { ...c }
        } else {
          deduped[c.email].ordersCount += 1
          deduped[c.email].totalSpent += c.totalSpent
          if (c.lastOrder > deduped[c.email].lastOrder) {
            deduped[c.email].lastOrder = c.lastOrder
          }
        }
      }
      setCustomers(Object.values(deduped))
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = segmentFilter === "all" || customer.segment.toLowerCase() === segmentFilter.toLowerCase()
    return matchesSearch && matchesSegment
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalCustomers = customers.length
  const vipCustomers = customers.filter((c) => c.segment === "VIP").length
  const activeCustomers = customers.filter((c) => c.status === "Active").length
  const newCustomers = customers.filter((c) => c.segment === "New").length

  const getSegmentColor = (segment: string) => {
    switch (segment.toLowerCase()) {
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "new":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and analyze your customer base</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Export Customers
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">VIP Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{vipCustomers}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeCustomers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">New Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{newCustomers}</p>
              </div>
              <UserPlus className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCustomers.map((customer, idx) => (
          <Card key={customer.email || idx} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{customer.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{customer.email}</p>
                </div>
                <Badge className={getSegmentColor(customer.segment)}>{customer.segment}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{customer.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Joined: {customer.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ShoppingBag className="h-4 w-4 text-gray-400" />
                  <span>{customer.ordersCount} orders</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Spent:</span>
                  <span className="font-semibold text-lg text-green-600">₹{customer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Last Order:</span>
                  <span className="text-sm">{customer.lastOrder}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedCustomer && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Name:</strong> {selectedCustomer.name}
                              </p>
                              <p>
                                <strong>Email:</strong> {selectedCustomer.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {selectedCustomer.phone}
                              </p>
                              <p>
                                <strong>Address:</strong> {selectedCustomer.address}
                              </p>
                              <p>
                                <strong>Status:</strong>
                                <Badge
                                  className={`ml-2 ${selectedCustomer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                  {selectedCustomer.status}
                                </Badge>
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Purchase History</h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Total Orders:</strong> {selectedCustomer.ordersCount}
                              </p>
                              <p>
                                <strong>Total Spent:</strong> ₹{selectedCustomer.totalSpent.toLocaleString()}
                              </p>
                              <p>
                                <strong>Average Order:</strong> ₹
                                {Math.round(
                                  selectedCustomer.totalSpent / selectedCustomer.ordersCount,
                                ).toLocaleString()}
                              </p>
                              <p>
                                <strong>Customer Since:</strong> {selectedCustomer.joinDate}
                              </p>
                              <p>
                                <strong>Last Order:</strong> {selectedCustomer.lastOrder}
                              </p>
                              <p>
                                <strong>Segment:</strong>
                                <Badge className={`ml-2 ${getSegmentColor(selectedCustomer.segment)}`}>
                                  {selectedCustomer.segment}
                                </Badge>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Recent Activity</h4>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Customer activity and order history would be displayed here.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
