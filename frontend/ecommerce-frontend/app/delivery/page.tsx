"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function DeliveryDashboard() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const token = await getToken();

    const res = await api.get("/orders/my-deliveries", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(res.data);
  };

  const markDelivered = async (id: string) => {
    const token = await getToken();

    await api.put(
      `/orders/mark-delivered/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Order Delivered");
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Deliveries</h1>

      {orders.length === 0 && <p>No assigned deliveries.</p>}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p><strong>Customer:</strong> {order.user?.name}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>

          <div className="mt-2 text-sm text-gray-600">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>Pincode: {order.shippingAddress.pincode}</p>
          </div>

          {order.orderStatus !== "delivered" && (
            <button
              onClick={() => markDelivered(order._id)}
              className="bg-green-600 text-white px-4 py-2 rounded mt-3"
            >
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}