"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Eye,
  Download,
  Send,
  Plus,
  Building2,
  Phone,
  Mail,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function AdminBulkOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [bulkOrders, setBulkOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBulkOrders()
  }, [])

  const fetchBulkOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/bulk-orders")
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        setLoading(false);
        return;
      }
      if (data.success) {
        setBulkOrders(data.orders)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = bulkOrders.filter((order) => {
    const matchesSearch =
      (order.company?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (order.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (order.id?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: bulkOrders.length,
    pending: bulkOrders.filter((o) => o.status === "pending").length,
    processing: bulkOrders.filter((o) => o.status === "processing").length,
    completed: bulkOrders.filter((o) => o.status === "completed").length,
    totalRevenue: bulkOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Reset all bulk orders
  const handleResetBulkOrders = async () => {
    if (!window.confirm("Are you sure you want to reset all bulk orders? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/analytics/reset-bulk-orders", { method: "POST" });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        return;
      }
      if (!data.success) {
        alert(data?.error || "Failed to reset bulk orders");
        return;
      }
      await fetchBulkOrders();
    } catch (err) {
      alert("Failed to reset bulk orders");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Orders</h1>
          <p className="text-muted-foreground">Manage and track bulk orders from business customers</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Bulk Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Bulk Order</DialogTitle>
              </DialogHeader>
              <div>
                <p>Redirect to bulk order form or show form here.</p>
                {/* You can add your bulk order form here or link to the bulk order page */}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleResetBulkOrders}>
            Reset Bulk Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage all bulk orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[300px]"
                  />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value={selectedStatus} className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{order.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.contactPerson}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            <span className="capitalize">{order.paymentStatus}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                        <TableCell>${(order.totalAmount !== undefined ? order.totalAmount : Array.isArray(order.items) ? order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) : 0).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                                  <DialogDescription>Complete information for bulk order</DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Customer Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{selectedOrder.company}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <span className="font-medium">{selectedOrder.contactPerson}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedOrder.email}</span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedOrder.phone}</span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Order Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex justify-between">
                                            <span>Status:</span>
                                            <Badge className={getStatusColor(selectedOrder.status)}>
                                              {getStatusIcon(selectedOrder.status)}
                                              <span className="ml-1 capitalize">{selectedOrder.status}</span>
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Payment:</span>
                                            <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                                              <span className="capitalize">{selectedOrder.paymentStatus}</span>
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Order Date:</span>
                                            <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Delivery Date:</span>
                                            <span>{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Order Items */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Order Items</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Product</TableHead>
                                              <TableHead>Quantity</TableHead>
                                              <TableHead>Unit Price</TableHead>
                                              <TableHead>Total</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                              selectedOrder.items.map((item: any, index: number) => (
                                              <TableRow key={index}>
                                                <TableCell>
                                                  <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">{item.unit}</div>
                                                  </div>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                                <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                              </TableRow>
                                              ))
                                            ) : (
                                              <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground">No items found</TableCell>
                                              </TableRow>
                                            )}
                                          </TableBody>
                                        </Table>
                                        <div className="mt-4 flex justify-end">
                                          <div className="text-lg font-bold">
                                            Total: ${
                                              typeof selectedOrder.totalAmount === 'number' && !isNaN(selectedOrder.totalAmount)
                                                ? selectedOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                : Array.isArray(selectedOrder.items)
                                                  ? selectedOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                  : '0.00'
                                            }
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Shipping Address */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Shipping Address</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p>{selectedOrder.shippingAddress}</p>
                                      </CardContent>
                                    </Card>

                                    {/* Actions */}
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Invoice
                                      </Button>
                                      <Button variant="outline">
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Invoice
                                      </Button>
                                      <Select defaultValue={selectedOrder.status}>
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Update Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
