'use client';

import Image from "next/image";
import api from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetails({ params }: Props) {

  const { id } = use(params);
  const { getToken } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* ---------------- FETCH PRODUCT ---------------- */

  useEffect(() => {

    const fetchProduct = async () => {
      try {

        const token = await getToken();

        const res = await api.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProduct(res.data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchReviews();

  }, [id]);

  /* ---------------- ACTIONS ---------------- */

  const handleAddToCart = async (productId: string) => {

    try {

      const token = await getToken();

      await api.post(
        "/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart 🛒");

    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderNow = async () => {

    const token = await getToken();

    const res = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = res.data;

    if (!user.addresses || user.addresses.length === 0) {
      router.push(`/checkout?buyNow=true&productId=${id}&addAddress=true`);
    } else {
      router.push(`/checkout?buyNow=true&productId=${id}`);
    }

  };

  const handleReviewSubmit = async () => {

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {

      const token = await getToken();

      await api.post(
        "/reviews",
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review added ⭐");

      setComment("");
      setRating(5);

      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);

    } catch (error: any) {
      alert(error.response?.data?.message || "Error");
    }

  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (

    <div className="bg-gray-100 min-h-screen py-6">

      {/* PRODUCT SECTION */}

      <div className="max-w-6xl mx-auto bg-white rounded shadow-sm p-4 md:p-6 grid md:grid-cols-2 gap-8">

        {/* IMAGE */}

        <div className="flex flex-col items-center">

          <div className="relative w-full h-[300px] md:h-[420px] border rounded bg-white">

            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-6"
            />

          </div>

          {/* DESKTOP BUTTONS */}

          <div className="hidden md:flex gap-4 w-full mt-6">

            <button
              onClick={() => handleAddToCart(product._id)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={handleOrderNow}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-semibold"
            >
              ⚡ Buy Now
            </button>

          </div>

        </div>

        {/* DETAILS */}

        <div>

          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {product.title}
          </h1>

          {/* RATING */}

          <div className="flex items-center gap-3 mt-3">

            <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
              {product.ratingsAverage ?? 4} ★
            </span>

            <span className="text-gray-500 text-sm">
              {reviews.length} Reviews
            </span>

          </div>

          {/* PRICE */}

          <div className="mt-5">

            <div className="flex items-center gap-3">

              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>

              <span className="line-through text-gray-400">
                ₹{product.price + 1000}
              </span>

              <span className="text-green-600 font-semibold">
                20% off
              </span>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              Inclusive of all taxes
            </p>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">

            <h2 className="font-semibold mb-2">
              Description
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

          </div>

        </div>

      </div>


      {/* REVIEWS SECTION */}

      <div className="max-w-6xl mx-auto bg-white mt-6 p-6 rounded shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          Customer Reviews
        </h2>

        {/* ADD REVIEW */}

        <div className="border p-4 rounded mb-6">

          <h3 className="font-medium mb-2">
            Write a Review
          </h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded mb-3 w-full"
          >
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={1}>1 Star</option>
          </select>

          <textarea
            rows={3}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <button
            onClick={handleReviewSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>

        </div>

        {/* REVIEW LIST */}

        <div className="space-y-4">

          {reviews.map((review) => (

            <div key={review._id} className="border p-4 rounded">

              <div className="flex justify-between">

                <span className="font-semibold">
                  {review.user?.name || "User"}
                </span>

                <span className="text-yellow-500">
                  ⭐ {review.rating}
                </span>

              </div>

              <p className="text-gray-600 text-sm mt-2">
                {review.comment}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* MOBILE STICKY BUTTONS */}

      <div className="fixed bottom-0 left-0 right-0 md:hidden flex">

        <button
          onClick={() => handleAddToCart(product._id)}
          className="w-1/2 bg-orange-500 text-white py-4 font-semibold"
        >
          Add to Cart
        </button>

        <button
          onClick={handleOrderNow}
          className="w-1/2 bg-yellow-500 text-white py-4 font-semibold"
        >
          Buy Now
        </button>

      </div>

    </div>
  );
}