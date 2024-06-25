"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = (event) => {
    console.log("session", session.roles);
    if (session.roles.includes("admin") === false) {
      alert("You are not authorized to add products");
      return;
    }
    event.preventDefault();
    const product = { name, price, description };
    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.access_token,
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then(() => router.push("/"))
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 p-2 w-full border-2 rounded"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-4 p-2 w-full border-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 p-2 w-full border-2 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}
