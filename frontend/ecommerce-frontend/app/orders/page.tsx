"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

interface OrderItem {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: {
    method: string;
    status: string;
  };
  orderStatus: string;
  totalAmount: number;
  deliveredAt?: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();

        const res = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data.orders);
        console.log("data fron orders " , res.data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "processing":
        return "text-yellow-600";
      case "shipped":
      case "out_for_delivery":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="p-6">No orders found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-sm shadow-sm mb-6"
          >
            {/* ORDER HEADER */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id.slice(-8)}
                </p>
                <p className="text-sm text-gray-500">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₹{order.totalAmount}
                </p>
                <p
                  className={`text-sm font-medium capitalize ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  ● {order.orderStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {/* ORDER ITEMS */}
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 px-6 py-5 border-b"
              >
                {/* PRODUCT IMAGE */}
                <div className="w-28 h-28 flex-shrink-0">
                  <img
                    src={item.product?.image}
                    alt={item.product?.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="flex-1">
                  <h2 className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                    {item.product?.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                  <p className="font-semibold mt-2">
                    ₹{item.product?.price}
                  </p>

                  {order.orderStatus === "delivered" && order.deliveredAt && (
                    <p className="text-green-600 text-sm mt-2">
                      Delivered on{" "}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* RIGHT SIDE STATUS */}
                <div className="md:text-right">
                  <p
                    className={`text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    Payment: {order.paymentInfo.method?.toUpperCase()} (
                    {order.paymentInfo.status})
                  </p>
                </div>
              </div>
            ))}

            {/* SHIPPING ADDRESS */}
            <div className="px-6 py-4 bg-gray-50 text-sm">
              <h3 className="font-semibold mb-2">
                Delivery Address
              </h3>
              <p className="font-medium">
                {order?.shippingAddress?.fullName}
              </p>
              <p>
                {order?.shippingAddress?.street},{" "}
                {order?.shippingAddress?.city},{" "}
                {order?.shippingAddress?.state}
              </p>
              <p>
                {order?.shippingAddress?.country} -{" "}
                {order?.shippingAddress?.pincode}
              </p>
              <p>Phone: {order?.shippingAddress?.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}