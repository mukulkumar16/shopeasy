"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { SignOutButton, useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState<any>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDbUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchUser();
  }, [user, getToken]);

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6">

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold italic">ShopEasy</span>
            <span className="text-xs">
              Explore{" "}
              <span className="text-yellow-300 font-semibold">
                Plus ✨
              </span>
            </span>
          </Link>
        </div>

        {/* SEARCH BAR DESKTOP */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <div className="flex w-full outline rounded">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 text-white rounded-l-sm "
            />
            <button
              onClick={handleSearch}
              className="bg-white px-5 flex items-center outline justify-center rounded-r-sm"
            >
              <Search className="text-gray-500" size={20} />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          {!user ? (
            <Link href="/sign-in">
              <button className="bg-white text-[#2874f0] px-8 py-1 rounded-sm font-semibold">
                Login
              </button>
            </Link>
          ) : (
            <>
              { dbUser?.role !== 'admin' && <Link href="/orders">Orders</Link>}
               {dbUser?.role === "admin" && (
                <Link href="/admin/orders">Orders</Link>
              )}
              {dbUser?.role === "seller" && (
                <Link href="/admin/add-product">Add Product</Link>
              )}

              {dbUser?.role === "admin" && (
                <Link href="/admin/delivery-request">DeliveryBoy Req.</Link>
              )}
               {dbUser?.role === "admin" && (
                <Link href="/admin/seller-request">Seller Req.</Link>
              )}

              <Link href="/cart" className="relative flex items-center gap-2">
                <ShoppingCart size={20} />
                Cart
                
              </Link>

              <SignOutButton />
            </>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-2 text-white rounded-l-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-white px-4 rounded-r-sm"
          >
            <Search className="text-[#2874f0]" size={18} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white text-black p-4 space-x-4 shadow-lg text-sm">

          {!user ? (
            <Link href="/sign-in" onClick={() => setMobileMenu(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link href="/orders" onClick={() => setMobileMenu(false)}>
                Orders
              </Link>

              <Link href="/cart" onClick={() => setMobileMenu(false)}>
                Cart
              </Link>

              {dbUser?.role === "seller" && (
                <Link
                  href="/admin/add-product"
                  onClick={() => setMobileMenu(false)}
                >
                  Add Product
                </Link>
              )}

              {dbUser?.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenu(false)}
                >
                  Dashboard
                </Link>
              )}

              <SignOutButton />
            </>
          )}
        </div>
      )}
    </header>
  );
}