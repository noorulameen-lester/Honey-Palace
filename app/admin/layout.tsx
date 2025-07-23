import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-yellow-700 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Honey Palace Admin</h1>
      </header>
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
