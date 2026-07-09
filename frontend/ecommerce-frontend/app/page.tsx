'use client'

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProdCard from "./Components/ProdCard";

export interface Product {
  _id: string;
  title: string;
  description?: string;
  brand?: string;
  price: number;
  stock?: number;
  image?: string;
  ratingsAverage?: number;
}

export default function Home() {

  const [data, setData] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allpost = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/postData");
        setData(res.data);
      } catch (error) {
        console.error(error);
      }finally {
        setLoading(false);
      }
    };

    allpost();
  }, []);

  // console.log("data of products " , data);

  if (loading) {
  return (
    <div className="px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg border p-4 shadow"
          >
            <div className="h-48 bg-gray-300 rounded"></div>

            <div className="mt-4 h-4 bg-gray-300 rounded w-3/4"></div>

            <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>

            <div className="mt-4 h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Top Banner */}
      <div className="bg-white shadow-sm px-6 py-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Featured Products
        </h1>
      </div>

      {/* Product Grid */}
      <div className="px-6 pb-10">
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-6
        ">
          {data.map((product) => (
            <ProdCard key={product._id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
}
