"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Settings,
  TrendingUp,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Home,
  Ticket,
  Truck,
  Mail
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"

// Import admin components
import AdminDashboard from "@/components/admin/AdminDashboard"
import AdminProducts from "@/components/admin/AdminProducts"
import AdminOrders from "@/components/admin/AdminOrders"
import AdminCustomers from "@/components/admin/AdminCustomers"
import AdminAnalytics from "@/components/admin/AdminAnalytics"
import AdminSettings from "@/components/admin/AdminSettings"
import AdminCoupons from "@/components/admin/AdminCoupons"
import AdminBulkOrders from "@/components/admin/AdminBulkOrders"
import { AdminContact } from "@/components/admin/AdminContact"

interface AdminStats {
  orders: number
  products: number
  customers: number
  lowStock: number
}

const AdminPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    orders: 23,
    products: 4,
    customers: 156,
    lowStock: 3,
  })

  useEffect(() => {
    // Check authentication
    const isAdmin = localStorage.getItem("isAdmin")
    const adminUser = localStorage.getItem("adminUser")

    if (isAdmin === "true" && adminUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(adminUser))
    } else {
      router.push("/auth/login")
    }
    setIsLoading(false)
  }, [router])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users  },
    { id: "coupons", label: "Coupons", icon: Ticket  },
    { id: "bulk-orders", label: "Bulk Orders", icon: Truck  },
    { id: "contact", label: "Contact", icon: Mail  },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("adminUser")
      router.replace("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (tab: string) => activeTab === tab

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">🍯</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between p-4 lg:hidden">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-amber-600 mr-4"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-xl font-bold text-amber-600">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600/70 hover:text-amber-600" aria-label="Go to store">
            <Home size={20} />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                disabled={isLoggingOut}
              >
                <LogOut size={20} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to login again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Yes, logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-0 flex flex-col h-screen`}
        aria-label="Admin Sidebar"
      >
        <div className="p-6 border-b border-gray-200 hidden lg:flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mr-3">
            <span className="text-white font-bold">🍯</span>
          </div>
          <h1 className="text-xl font-bold text-amber-600">Honey Palace Admin</h1>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    isActive(item.id) ? "bg-amber-600/10 text-amber-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-current={isActive(item.id) ? "page" : undefined}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-600/10 flex items-center justify-center">
                  <Users className="text-amber-600" size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "admin@honeypalace.com"}</p>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700" aria-label="User options">
                  <ChevronDown size={18} />
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Store
                  </Link>
                  <Separator className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-50 flex-1 overflow-y-auto flex flex-col w-full">
        {/* Desktop Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-6 hidden lg:flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <Home size={16} className="mr-2" />
                View Store
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="icon" aria-label="Log out">
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 pt-20 lg:pt-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="orders">
              <AdminOrders />
            </TabsContent>
            <TabsContent value="products">
              <AdminProducts />
            </TabsContent>
            <TabsContent value="customers">
              <AdminCustomers />
            </TabsContent>
            <TabsContent value="coupons">
              <AdminCoupons />
            </TabsContent>
            <TabsContent value="bulk-orders">
              <AdminBulkOrders />
            </TabsContent>
            <TabsContent value="contact">
              <AdminContact />
            </TabsContent>
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center flex justify-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Honey Palace. All rights reserved.</p>
        </footer>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default AdminPage
