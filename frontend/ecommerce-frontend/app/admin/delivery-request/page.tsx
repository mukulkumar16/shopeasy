"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function DeliveryRequestsPage() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const fetchRequests = async () => {
    const token = await getToken();

    const res = await api.get("/users/delivery-requests", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id: string) => {
    const token = await getToken();

    await api.put(
      `/users/approve-delivery/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchRequests();
  };

  const reject = async (id: string) => {
    const token = await getToken();

    await api.put(
      `/users/reject-delivery/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Delivery Role Requests</h1>

        {users.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border p-4 mb-3 rounded"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approve(user._id)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(user._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}