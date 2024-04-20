"use client";
import { useState } from "react";
import {  useSearchParams } from "next/navigation";

export default function UpdateProduct() {
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState({ name: null, price: null, description: null});
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId").toString();

  const updateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Error updating product');
      }

      const data = await response.json();
      setMessage('Product updated successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <input type="text" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} placeholder="Product Name" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <input type="text" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} placeholder="Product Price" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <input type="text" value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} placeholder="Product Description" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <button onClick={updateProduct} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Product</button>
      {message && <p className="mt-3 text-green-500">{message}</p>}
    </div>
  );
}