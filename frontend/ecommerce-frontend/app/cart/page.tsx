"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  title: string;
  price: number;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  priceAtTime: number;
}

interface CartType {
  items: CartItem[];
  totalPrice: number;
}

export default function CartPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCart = async () => {
    try {
      const token = await getToken();
      const res = await api.get<CartType>("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const token = await getToken();

    await api.put(
      "/cart/update",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
  };

  const removeItem = async (productId: string) => {
    const token = await getToken();

    await api.delete("/cart/remove", {
      headers: { Authorization: `Bearer ${token}` },
      data: { productId },
    });

    fetchCart();
  };

 const handleOrderNow = async () => {
  const token = await getToken();

  const res = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = res.data;

  if (!user.addresses || user.addresses.length === 0) {
    router.push("/checkout?addAddress=true");
  } else {
    router.push("/checkout");
  }
};


  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="p-6">Loading cart...</p>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty 🛒</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= LEFT - CART ITEMS ================= */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="flex justify-center sm:justify-start">
                <Image
                  src={item.product.image || "/placeholder.png"}
                  width={120}
                  height={120}
                  alt={item.product.title}
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {item.product.title}
                  </h2>

                  <p className="text-blue-600 font-bold mt-2">
                    ₹ {item.priceAtTime}
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="flex items-center border rounded">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1 disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="px-4">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-right font-semibold text-lg">
                ₹ {item.priceAtTime * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT - PRICE CARD ================= */}
        <div className="bg-white p-6 rounded shadow h-fit sticky top-20">
          <h2 className="text-lg font-semibold border-b pb-3 mb-4">
            PRICE DETAILS
          </h2>

          <div className="flex justify-between mb-2">
            <span>Price ({cart.items.length} items)</span>
            <span>₹ {cart.totalPrice}</span>
          </div>

          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>- ₹ 0</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
            <span>Total Amount</span>
            <span>₹ {cart.totalPrice}</span>
          </div>

          {/* ORDER NOW BUTTON */}
          <button
            onClick={handleOrderNow}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 mt-6 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
