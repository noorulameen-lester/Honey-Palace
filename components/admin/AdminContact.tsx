"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Search,
  Eye,
  Reply,
  Star,
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  responded: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
}

const categoryIcons = {
  general: MessageSquare,
  product: AlertCircle,
  order: CheckCircle,
  bulk: XCircle,
  partnership: Star,
}

export function AdminContact() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    setLoading(true)
    fetch("/api/contacts")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.contacts)
        } else {
          setError(data.error || "Failed to fetch contact messages")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch contact messages")
        setLoading(false)
      })
  }, [])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    const matchesCategory = categoryFilter === "all" || message.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    inProgress: messages.filter((m) => m.status === "in-progress").length,
    avgResponseTime: "2.5 hours",
  }

  const handleStatusChange = (messageId: number, newStatus: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: newStatus,
              respondedAt: newStatus === "responded" ? new Date().toISOString() : msg.respondedAt,
            }
          : msg,
      ),
    )
  }

  const handleReply = () => {
    if (selectedMessage && replyText.trim()) {
      handleStatusChange(selectedMessage.id, "responded")
      setReplyText("")
      setSelectedMessage(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <div className="text-center py-12 text-xl text-gray-600 dark:text-gray-300">Loading contact messages...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-xl text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and respond to customer inquiries and messages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">New Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="bulk">Bulk Order</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.map((message, idx) => {
              const CategoryIcon = categoryIcons[message.category as keyof typeof categoryIcons] || MessageSquare;

              return (
                <div
                  key={message._id || message.id || idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-amber-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                          <Badge className={priorityColors[message.priority as keyof typeof priorityColors]}>
                            {message.priority}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {message.email} {message.phone && `• ${message.phone}`}
                        </p>

                        <p className="font-medium text-gray-900 dark:text-white mb-2">{message.subject}</p>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{message.message}</p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(message.createdAt)}
                          </span>
                          {message.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {message.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={statusColors[message.status as keyof typeof statusColors]}>
                        {message.status ? message.status.replace("-", " ") : "Unknown"}
                      </Badge>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>

                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Name</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Phone</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedMessage.phone || "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Category</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                    {selectedMessage.category}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Subject</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.subject}</p>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Message</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                  {selectedMessage.message}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Select
                                  value={selectedMessage.status}
                                  onValueChange={(value) => handleStatusChange(selectedMessage.id, value)}
                                >
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="responded">Responded</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="reply">Reply</Label>
                                <Textarea
                                  id="reply"
                                  placeholder="Type your reply..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={4}
                                />
                                <Button onClick={handleReply} className="bg-amber-600 hover:bg-amber-700">
                                  <Reply className="h-4 w-4 mr-2" />
                                  Send Reply
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No messages found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
