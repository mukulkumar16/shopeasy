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
}

interface DeliveryBoy {
  _id: string;
  name: string;
  email: string;
}

export default function AdminOrdersPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [selected, setSelected] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    const token = await getToken();

    const orderRes = await api.get("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const deliveryRes = await api.get("/users/delivery-boys", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(orderRes.data);
    setDeliveryBoys(deliveryRes.data);
  };

  const assignDeliveryBoy = async (orderId: string) => {
    const token = await getToken();

    await api.put(
      `/orders/assign-delivery/${orderId}`,
      { deliveryBoyId: selected[orderId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Delivery Boy Assigned");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Order Management</h1>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p><strong>Customer:</strong> {order.user?.name}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>

          {order.orderStatus !== "delivered" && (
            <div className="mt-3 flex gap-3">
              <select
                className="border p-2 rounded"
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    [order._id]: e.target.value,
                  })
                }
              >
                <option>Select Delivery Boy</option>
                {deliveryBoys.map((boy) => (
                  <option key={boy._id} value={boy._id}>
                    {boy.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => assignDeliveryBoy(order._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}