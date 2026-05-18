"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">ShopEasy</h2>
          <p className="mt-3 text-sm text-gray-400">
            Your one stop shop for electronics, fashion, and more.
            Discover the best deals everyday.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-medium mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-white font-medium mb-3">Customer Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-medium mb-3">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/refund" className="hover:text-white">Refund Policy</Link></li>
          </ul>
        </div>

      </div>

      {/* Social + Bottom */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Social Icons */}
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white"><Facebook size={20} /></Link>
            <Link href="#" className="hover:text-white"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-white"><Twitter size={20} /></Link>
            <Link href="#" className="hover:text-white"><Linkedin size={20} /></Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} ShopEasy. All rights reserved.
          </p>

        </div>
      </div>

    </footer>
  );
}