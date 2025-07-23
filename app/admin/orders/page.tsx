"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Toggle individual selection
  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id));
    }
  };

  // Mark as shipped
  const handleMarkShipped = async () => {
    if (selectedOrders.length === 0) return alert("Select at least one order");

    await fetch("/api/admin/orders/mark-shipped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: selectedOrders }),
    });

    alert("Selected orders marked as shipped");
    window.location.reload();
  };

  // Delete selected orders
  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) return alert("Select at least one order");

    await fetch("/api/admin/orders/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIds: selectedOrders }),
    });

    alert("Selected orders deleted");
    window.location.reload();
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Orders (Admin)</h1>
      <div className="mb-4 flex gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={toggleSelectAll}
        >
          {selectedOrders.length === orders.length ? "Deselect All" : "Select All"}
        </button>
        <button
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          onClick={handleMarkShipped}
        >
          Mark as Shipped
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteOrders}
        >
          Delete Selected
        </button>
      </div>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg bg-white shadow flex items-center">
              <input
                type="checkbox"
                checked={selectedOrders.includes(order._id)}
                onChange={() => toggleSelect(order._id)}
                className="mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <Link
                  href={`/orders/${order._id}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}