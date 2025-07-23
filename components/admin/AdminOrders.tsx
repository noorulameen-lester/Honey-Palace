"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Edit, Truck, Package, CheckCircle, Clock, Calendar, DollarSign, Trash2 } from "lucide-react"
import Image from "next/image"

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<any>(null)
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [showResetAllDialog, setShowResetAllDialog] = useState(false)
  const [orderToMarkFake, setOrderToMarkFake] = useState<any>(null)
  const [showMarkFakeDialog, setShowMarkFakeDialog] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    })
    const data = await res.json()
    if (data.success) {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)))
      if (editingOrder && editingOrder._id === orderId) setEditingOrder({ ...editingOrder, status })
    } else {
      alert(data.error || "Failed to update status")
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.id?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (order.formData?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order._id))
    }
  }

  const getStatusIcon = (status: string | undefined) => {
    switch ((status || '').toLowerCase()) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch ((status || '').toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Delete a single order (frontend only, add API call if needed)
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return
    // Optionally call your API here to delete from backend
    // await fetch(`/api/orders/${orderToDelete._id}`, { method: "DELETE" })
    setOrders((prev) => prev.filter((o) => o._id !== orderToDelete._id))
    setSelectedOrders((prev) => prev.filter((id) => id !== orderToDelete._id))
    setShowDeleteDialog(false)
    setOrderToDelete(null)
  }

  // Delete all selected orders (frontend only, add API call if needed)
  const handleBulkDeleteOrders = async () => {
    // Optionally call your API here to delete from backend
    // await fetch(`/api/orders/bulk-delete`, { method: "POST", body: JSON.stringify({ ids: selectedOrders }) })
    setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o._id)))
    setSelectedOrders([])
    setShowBulkDeleteDialog(false)
  }

  // Bulk mark as shipped
  const handleBulkMarkShipped = async () => {
    // Optionally call your API here to update status in backend
    setOrders((prev) =>
      prev.map((o) =>
        selectedOrders.includes(o._id) ? { ...o, status: "Shipped" } : o
      )
    )
    setSelectedOrders([])
  }

  // Bulk update status (example: set all selected to "Processing")
  const handleBulkUpdateStatus = async () => {
    setOrders((prev) =>
      prev.map((o) =>
        selectedOrders.includes(o._id) ? { ...o, status: "Processing" } : o
      )
    )
    setSelectedOrders([])
  }

  // Bulk export (example: just alert for now)
  const handleBulkExport = () => {
    const selected = orders.filter((o) => selectedOrders.includes(o._id))
    alert("Exported orders: " + selected.map((o) => o._id).join(", "))
  }

  // Reset all orders (backend + frontend)
  const handleResetAllOrders = async () => {
    try {
      const res = await fetch("/api/admin/analytics/reset-orders", { method: "POST" });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        alert("Server error: Invalid JSON response");
        setShowResetAllDialog(false);
        return;
      }
      if (!data.success) {
        alert(data?.error || "Failed to reset orders");
        setShowResetAllDialog(false);
        return;
      }
      await fetchOrders();
      setSelectedOrders([]);
      setShowResetAllDialog(false);
    } catch (err) {
      alert("Failed to reset orders");
      setShowResetAllDialog(false);
    }
  }

  // Mark order as fake (frontend only; for real, call an API endpoint)
  const handleMarkOrderFake = async () => {
    if (!orderToMarkFake) return
    // Optionally call your backend API here to mark as fake
    // await fetch(`/api/orders/${orderToMarkFake._id}/mark-fake`, { method: "PATCH" })
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderToMarkFake._id ? { ...o, status: "Fake" } : o
      )
    )
    setShowMarkFakeDialog(false)
    setOrderToMarkFake(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and track all customer orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Export Orders
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            Bulk Actions
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowResetAllDialog(true)}
            className="ml-2"
            title="Reset all orders"
          >
            Reset All Orders
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Orders</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Processing</p>
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">10</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Delivered</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{selectedOrders.length} order(s) selected</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleBulkMarkShipped}>
                  Mark as Shipped
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkUpdateStatus}>
                  Update Status
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkExport}>
                  Export Selected
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setShowBulkDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Orders List
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                ref={el => {
                  if (el) {
                    el.indeterminate = selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length
                  }
                }}
                onChange={handleSelectAll}
                className="accent-amber-600 h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading orders...</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedOrders.includes(order._id)}
                      onCheckedChange={() => handleSelectOrder(order._id)}
                    />
                    <div className="flex-1 space-y-3">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{order.id || order._id?.slice(-6)}</h3>
                          <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</span>
                        </div>
                      </div>
                      {/* Customer Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{order.formData?.firstName} {order.formData?.lastName}</p>
                            <p className="text-sm text-gray-600">{order.formData?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-lg">₹{order.total}</span>
                        </div>
                      </div>
                      {/* Products */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Products:</p>
                        <div className="flex flex-wrap gap-2">
                          {(order.cartItems || []).map((product: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                            >
                              <div className="relative h-8 w-8 rounded overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">
                                {product.name} x{product.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex justify-end space-x-2 pt-2 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {selectedOrder?.id || selectedOrder?._id?.slice(-6)}</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Details */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Name:</strong> {selectedOrder.formData?.firstName} {selectedOrder.formData?.lastName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedOrder.formData?.email}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {selectedOrder.formData?.phone}
                                      </p>
                                      <p>
                                        <strong>Address:</strong> {selectedOrder.formData?.address}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Order Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : "-"}
                                      </p>
                                      <p>
                                        <strong>Status:</strong> {selectedOrder.status}
                                      </p>
                                      <p>
                                        <strong>Payment:</strong> {selectedOrder.paymentMethod}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* Products */}
                                <div>
                                  <h4 className="font-semibold mb-2">Products</h4>
                                  <div className="space-y-2">
                                    {(selectedOrder.cartItems || []).map((product: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div className="relative h-12 w-12 rounded overflow-hidden">
                                            <Image
                                              src={product.image || "/placeholder.svg"}
                                              alt={product.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                                          </div>
                                        </div>
                                        <p className="font-semibold">₹{product.price * product.quantity}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center pt-3 border-t mt-3">
                                    <span className="font-semibold">Total:</span>
                                    <span className="font-bold text-lg">₹{selectedOrder.total}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingOrder(order)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Order - {editingOrder?.id || editingOrder?._id?.slice(-6)}</DialogTitle>
                            </DialogHeader>
                            {editingOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="status">Order Status</Label>
                                    <Select
                                      value={editingOrder.status}
                                      onValueChange={async (value) => {
                                        setEditingOrder({ ...editingOrder, status: value })
                                        await updateOrderStatus(editingOrder._id, value)
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                        <SelectItem value="Shipped">Shipped</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="notes">Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={editingOrder.notes || ""}
                                    onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                                    rows={3}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setEditingOrder(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => setEditingOrder(null)}
                                    className="bg-amber-600 hover:bg-amber-700"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => {
                            setOrderToMarkFake(order)
                            setShowMarkFakeDialog(true)
                          }}
                        >
                          Mark as Fake
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setOrderToDelete(order)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Delete single order dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to delete order <span className="font-semibold">{orderToDelete?.id || orderToDelete?._id?.slice(-6)}</span>?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteOrder}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete bulk orders dialog */}
      <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Orders</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to delete <span className="font-semibold">{selectedOrders.length}</span> selected order(s)?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBulkDeleteOrders}>
                Delete All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Reset all orders dialog */}
      <Dialog open={showResetAllDialog} onOpenChange={setShowResetAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Orders</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to reset <span className="font-semibold">{orders.length}</span> orders? This cannot be undone.</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowResetAllDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetAllOrders}>
                Reset All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Mark as fake dialog */}
      <Dialog open={showMarkFakeDialog} onOpenChange={setShowMarkFakeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order as Fake</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure you want to mark order <span className="font-semibold">{orderToMarkFake?.id || orderToMarkFake?._id?.slice(-6)}</span> as <span className="text-red-600 font-semibold">Fake</span>?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowMarkFakeDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleMarkOrderFake}>
                Mark as Fake
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
