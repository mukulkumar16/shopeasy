'use client'
import Image from "next/image";
import { Product } from "../page";
import api from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  product: Product;
}

export default function ProdCard({ product }: Props) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [inCart, setInCart] = useState(false);
  const handleOrderNow = async () => {
    const token = await getToken();

    const res = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data;

    if (!user.addresses || user.addresses.length === 0) {
      router.push(`/checkout?buyNow=true&productId=${product._id}&addAddress=true`);
    } else {
      router.push(`/checkout?buyNow=true&productId=${product._id}`);
    }
  };

  useEffect(() => {
    const checkCart = async () => {
      try {
        const token = await getToken();

        const res = await api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItems = res.data.items;

        const exists = cartItems.find(
          (item: any) => item.product._id === product._id
        );

        if (exists) setInCart(true);
      } catch (error) {
        console.log(error);
      }
    };

    checkCart();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      const token = await getToken();

      await api.post(
        "/cart/add",
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInCart(true); // 👈 change button
      alert("Added to cart 🛒");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div
        className="
        bg-white
        border
        rounded-lg
        hover:shadow-md
        transition
        duration-300
        overflow-hidden
        group
        cursor-pointer
        flex
        flex-col
        h-full
      "
      >
        {/* Product Image */}
        <div className="relative w-full h-48 sm:h-52 bg-gray-50 flex items-center justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">

          {/* Title */}
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
            {product.title}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white text-xs px-2 py-[2px] rounded">
              {product.ratingsAverage ?? 4} ★
            </span>
            <span className="text-xs text-gray-500">(120)</span>
          </div>

          {/* Price Section */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-lg font-semibold text-gray-900">
              ₹{product.price}
            </span>

            <span className="text-sm text-gray-400 line-through">
              ₹{Math.round(product.price * 1.3)}
            </span>

            <span className="text-sm text-green-600 font-medium">
              30% off
            </span>
          </div>

          {/* Buttons */}
          <div className="mt-auto flex gap-2 pt-4">

            {inCart ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push("/cart");
                }}
                className="
      flex-1
      text-sm
      bg-green-500
      hover:bg-green-600
      text-white
      font-medium
      py-2
      rounded
      transition
    "
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddToCart(product._id);
                }}
                className="
      flex-1
      text-sm
      bg-yellow-400
      hover:bg-yellow-500
      text-gray-900
      font-medium
      py-2
      rounded
      transition
    "
              >
                Add
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleOrderNow();
              }}
              className="
              flex-1
              text-sm
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-medium
              py-2
              rounded
              transition
            "
            >
              Buy
            </button>

          </div>
        </div>
      </div>
    </Link>
  );
}