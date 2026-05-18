"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    image: "",
    ratingsAverage: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        ratingsAverage: Number(formData.ratingsAverage),
      });

      alert("Product Added Successfully 🔥");
      console.log(res.data);

      setFormData({
        title: "",
        description: "",
        brand: "",
        price: "",
        stock: "",
        image: "",
        ratingsAverage: "",
      });

    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-10">

        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Rating (0 - 5)
              </label>
              <input
                type="number"
                name="ratingsAverage"
                value={formData.ratingsAverage}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                placeholder="Example: 4.5"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Write product description..."
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste product image URL"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-md transition"
          >
            Add Product
          </button>

        </form>
      </div>
    </div>
  );
}