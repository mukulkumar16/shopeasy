"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";

export default function SellerRequests() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  const fetchRequests = async () => {
    const token = await getToken();

    const res = await api.get("/users/seller-requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveUser = async (id: string) => {
    const token = await getToken();

    await api.put(
      `/users/approve-seller/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchRequests();
  };

  const rejectUser = async (id: string) => {
    const token = await getToken();

    await api.put(
      `/users/reject-seller/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchRequests();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>

      {users.length === 0 && <p>No pending requests</p>}

      {users.map((user) => (
        <div
          key={user._id}
          className="border p-4 rounded mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => approveUser(user._id)}
              className="bg-green-500 px-4 py-1 rounded text-white"
            >
              Approve
            </button>

            <button
              onClick={() => rejectUser(user._id)}
              className="bg-red-500 px-4 py-1 rounded text-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
