"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import ProdCard from "../Components/ProdCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/search?q=${query}`);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) return <p className="p-6">Searching...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product) => (
           <ProdCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
}