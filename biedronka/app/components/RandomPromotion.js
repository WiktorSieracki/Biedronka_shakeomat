import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import jwt from "jsonwebtoken";

export default function RandomPromotion() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/products").then((response) =>
      response.json().then((data) => {
        setProducts(data);
      })
    );
  }, []);

  const handleClick = () => {
    fetch("http://localhost:5000/products").then((response) =>
      response.json().then((data) => {
        setProducts(data);
      }));
    console.log("products", products);
    const randomIndex = Math.floor(Math.random() * products.length);
    setPromotion(products[randomIndex]);
  };
  
  
  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl text-gray-700 mb-4">Hello, {session.user.name}!</h2>
      <button
        onClick={handleClick}
        className="mt-3 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Get Random Promotion
      </button>
      {promotion && (
        <div className="mt-5 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg text-gray-700 mb-2">Your Promotion:</h3>
          <p className="text-md text-gray-500 mb-1">{promotion.name}</p>
          <p className="text-lg text-red-500 font-bold">
            {(promotion.price * 0.8).toFixed(2)} zł
          </p>
        </div>
      )}
    </div>
  );
}
