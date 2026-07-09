"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProdCard from "../Components/ProdCard";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>;

  return (
    <div>
      <h1 className="p-4 text-2xl font-bold">Search Results for "{query}"</h1>

      {products.length === 0 ? (
        <p className="p-4 text-2xl font-bold">No products found</p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProdCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}