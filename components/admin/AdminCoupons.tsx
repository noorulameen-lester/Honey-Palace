"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  CalendarIcon,
  Tag,
  Percent,
  DollarSign,
  Truck,
  Users,
  TrendingUp,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "expired":
      return "bg-red-100 text-red-800 border-red-200"
    case "disabled":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "percentage":
      return <Percent className="h-4 w-4" />
    case "fixed":
      return <DollarSign className="h-4 w-4" />
    case "free_shipping":
      return <Truck className="h-4 w-4" />
    default:
      return <Tag className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "percentage":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "fixed":
      return "bg-green-100 text-green-800 border-green-200"
    case "free_shipping":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    status: "active",
  })
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editCoupon, setEditCoupon] = useState<any>(null)
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(undefined)
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/coupons")
        const data = await res.json()
        if (data.success) {
          setCoupons(data.coupons)
        } else {
          setError(data.error || "Failed to fetch coupons")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch coupons")
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  const handleCreateCoupon = async () => {
    try {
      setLoading(true)
      setError(null)
      const couponData = {
        ...newCoupon,
        value: newCoupon.value ? Number(newCoupon.value) : 0,
        minOrder: newCoupon.minOrder ? Number(newCoupon.minOrder) : 0,
        maxDiscount: newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : 0,
        usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : 0,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        usageCount: 0,
      }
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponData),
      })
      const data = await res.json()
      if (data.success) {
    setIsCreateDialogOpen(false)
    setNewCoupon({
      code: "",
      type: "percentage",
      value: "",
      description: "",
      minOrder: "",
      maxDiscount: "",
      usageLimit: "",
      status: "active",
    })
    setStartDate(undefined)
    setEndDate(undefined)
        // Refetch coupons
        const res2 = await fetch("/api/coupons")
        const data2 = await res2.json()
        if (data2.success) setCoupons(data2.coupons)
      } else {
        setError(data.error || "Failed to create coupon")
      }
    } catch (err: any) {
      setError(err.message || "Failed to create coupon")
    } finally {
      setLoading(false)
    }
  }

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCoupon({ ...newCoupon, code: result })
  }

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    totalUsage: coupons.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0),
    avgUsage:
      coupons.length > 0
        ? Math.round(
            coupons.reduce((sum, coupon) => sum + ((coupon.usageCount || 0) / (coupon.usageLimit || 1)) * 100, 0) /
              coupons.length,
          )
        : 0,
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => (c._id || c.id) !== id))
      } else {
        setError(data.error || "Failed to delete coupon")
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete coupon")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (coupon: any) => {
    setEditCoupon({ ...coupon })
    setEditStartDate(coupon.startDate ? new Date(coupon.startDate) : undefined)
    setEditEndDate(coupon.endDate ? new Date(coupon.endDate) : undefined)
    setEditDialogOpen(true)
  }

  const handleEditCoupon = async () => {
    if (!editCoupon) return
    setLoading(true)
    setError(null)
    try {
      const patchData = {
        id: editCoupon._id || editCoupon.id,
        ...editCoupon,
        value: editCoupon.value ? Number(editCoupon.value) : 0,
        minOrder: editCoupon.minOrder ? Number(editCoupon.minOrder) : 0,
        maxDiscount: editCoupon.maxDiscount ? Number(editCoupon.maxDiscount) : 0,
        usageLimit: editCoupon.usageLimit ? Number(editCoupon.usageLimit) : 0,
        startDate: editStartDate ? editStartDate.toISOString() : null,
        endDate: editEndDate ? editEndDate.toISOString() : null,
      }
      const res = await fetch("/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      })
      const data = await res.json()
      if (data.success) {
        setEditDialogOpen(false)
        setEditCoupon(null)
        // Refetch coupons
        const res2 = await fetch("/api/coupons")
        const data2 = await res2.json()
        if (data2.success) setCoupons(data2.coupons)
      } else {
        setError(data.error || "Failed to update coupon")
      }
    } catch (err: any) {
      setError(err.message || "Failed to update coupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount coupons for your customers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>Set up a new discount coupon for your customers</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      placeholder="HONEY20"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    />
                    <Button type="button" variant="outline" onClick={generateCouponCode}>
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select value={newCoupon.type} onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this coupon offers..."
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {newCoupon.type === "percentage"
                      ? "Percentage (%)"
                      : newCoupon.type === "fixed"
                        ? "Amount ($)"
                        : "Value"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder={newCoupon.type === "percentage" ? "20" : "10"}
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    disabled={newCoupon.type === "free_shipping"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Minimum Order ($)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    placeholder="50"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="25"
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    placeholder="100"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={newCoupon.status === "active"}
                      onCheckedChange={(checked) =>
                        setNewCoupon({ ...newCoupon, status: checked ? "active" : "disabled" })
                      }
                    />
                    <Label htmlFor="status">{newCoupon.status === "active" ? "Active" : "Disabled"}</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCoupon}>Create Coupon</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Usage Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgUsage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>Manage your discount coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon._id || coupon.id || coupon.code}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{coupon.code}</div>
                        <div className="text-sm text-muted-foreground">{coupon.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(coupon.type)}>
                        {getTypeIcon(coupon.type)}
                        <span className="ml-1 capitalize">{coupon.type.replace("_", " ")}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : coupon.type === "fixed"
                          ? `$${coupon.value}`
                          : "Free Shipping"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {coupon.usageCount} / {coupon.usageLimit}
                        </div>
                        <Progress value={(coupon.usageCount / coupon.usageLimit) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(coupon.status)}>
                        <span className="capitalize">{coupon.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{format(coupon.endDate, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(coupon)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCoupon(coupon._id || coupon.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Coupon Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon details</DialogDescription>
          </DialogHeader>
          {editCoupon && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Coupon Code</Label>
                  <Input
                    id="edit-code"
                    value={editCoupon.code}
                    onChange={(e) => setEditCoupon({ ...editCoupon, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Discount Type</Label>
                  <Select value={editCoupon.type} onValueChange={(value) => setEditCoupon({ ...editCoupon, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editCoupon.description}
                  onChange={(e) => setEditCoupon({ ...editCoupon, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-value">Value</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editCoupon.value}
                    onChange={(e) => setEditCoupon({ ...editCoupon, value: Number(e.target.value) })}
                    disabled={editCoupon.type === "free_shipping"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minOrder">Minimum Order ($)</Label>
                  <Input
                    id="edit-minOrder"
                    type="number"
                    value={editCoupon.minOrder}
                    onChange={(e) => setEditCoupon({ ...editCoupon, minOrder: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxDiscount">Max Discount ($)</Label>
                  <Input
                    id="edit-maxDiscount"
                    type="number"
                    value={editCoupon.maxDiscount}
                    onChange={(e) => setEditCoupon({ ...editCoupon, maxDiscount: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                  <Input
                    id="edit-usageLimit"
                    type="number"
                    value={editCoupon.usageLimit}
                    onChange={(e) => setEditCoupon({ ...editCoupon, usageLimit: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-status"
                      checked={editCoupon.status === "active"}
                      onCheckedChange={(checked) =>
                        setEditCoupon({ ...editCoupon, status: checked ? "active" : "disabled" })
                      }
                    />
                    <Label htmlFor="edit-status">{editCoupon.status === "active" ? "Active" : "Disabled"}</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editStartDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editStartDate ? format(editStartDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={editStartDate} onSelect={setEditStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editEndDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editEndDate ? format(editEndDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={editEndDate} onSelect={setEditEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCoupon}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
