"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

export default function RequestDeliveryPage() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const requestDelivery = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await api.put(
        "/users/request-delivery",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">Become Delivery Partner</h1>

        <button
          onClick={requestDelivery}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
        >
          {loading ? "Submitting..." : "Request Delivery Role"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}