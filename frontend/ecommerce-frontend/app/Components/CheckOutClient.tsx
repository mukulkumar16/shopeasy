"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault?: boolean;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const buyNow = searchParams.get("buyNow");
  const productId = searchParams.get("productId");
  const addAddressMode = searchParams.get("addAddress");

  const { getToken } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Address>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const fetchUser = async () => {
    const token = await getToken();
    const res = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(res.data.addresses || []);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const token = await getToken();

    await api.post("/users/address", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFormData({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });

    setIsAdding(false);
    fetchUser();
  };

  const deleteAddress = async (id: string) => {
    const token = await getToken();

    await api.delete(`/users/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }

    fetchUser();
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }

    const token = await getToken();

    let res;

    if (buyNow && productId) {
      res = await api.post(
        "/payment/buy-now",
        {
          productId,
          quantity: 1,
          addressId: selectedAddressId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      res = await api.post(
        "/payment/create-checkout-session",
        { addressId: selectedAddressId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    window.location.href = res.data.url;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-4 md:p-6 rounded shadow">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Checkout</h1>

        {(isAdding || addresses.length === 0 || addAddressMode) && (
          <div className="mb-6">
            <h2 className="font-semibold mb-4 text-lg">
              Add Delivery Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={(formData as any)[key]}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={saveAddress}
                className="bg-blue-600 text-white px-6 py-2 rounded w-full md:w-auto"
              >
                Save Address
              </button>

              {addresses.length > 0 && (
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-300 px-6 py-2 rounded w-full md:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {addresses.length > 0 && !isAdding && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Select Delivery Address
              </h2>

              <button
                onClick={() => setIsAdding(true)}
                className="text-blue-600 text-sm font-medium"
              >
                + Add New Address
              </button>
            </div>

            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-4 mb-3 rounded transition ${
                  selectedAddressId === addr._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => setSelectedAddressId(addr._id ?? null)}
                  >
                    <input
                      type="radio"
                      checked={selectedAddressId === addr._id}
                      onChange={() =>
                        setSelectedAddressId(addr._id ?? null)
                      }
                      className="mt-1"
                    />

                    <div>
                      <p className="font-semibold">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {addr.street}, {addr.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {addr.state}, {addr.country} - {addr.pincode}
                      </p>
                      <p className="text-sm">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAddress(addr._id!)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              disabled={!selectedAddressId}
              onClick={handlePayment}
              className="mt-6 bg-yellow-500 text-black px-6 py-3 rounded w-full disabled:opacity-50"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}