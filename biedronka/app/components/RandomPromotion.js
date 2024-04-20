import React, { useContext, useEffect, useState } from "react";
import { TokenContext } from "./Contexts";
import jwt from "jsonwebtoken";

export default function RandomPromotion() {
  const token = useContext(TokenContext);
  const userId = jwt.decode(token)._id;
  const [user, setUser] = useState(jwt.decode(token));
  const [promotion, setPromotion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, []);

  useEffect(() => {
    if (user !== null && user.promotion) {
      fetch(`http://localhost:5000/products/${user.promotion}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => setPromotion(data));
    }
  }, [user]);

  const handleClick = async () => {
    const response = await fetch(
      `http://localhost:5000/users/promotions/random`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      setError(`You can only get one promotion per day.`);
    }
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl text-gray-700 mb-4">Hello, {user.name}</h2>
      <button
        onClick={handleClick}
        className="mt-3 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Get Random Promotion
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
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
