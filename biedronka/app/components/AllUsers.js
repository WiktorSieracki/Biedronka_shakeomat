import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const token = Cookies.get("token");
  let logged_in_user_id = null;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded && "_id" in decoded) {
      logged_in_user_id = decoded._id;
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting user");
      }
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  

  return (
    <div className="flex justify-center">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-blue-100 rounded-lg p-4 m-2 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-2">{user.name}</h2>

          {token && logged_in_user_id !== user._id && (
            <Link href={`/ChatRoom?userId=${user._id}`}> Go to Chat Room </Link>
            )}
            <br/>
          <Link href={`/UpdateUser?userId=${user._id}`}> EditUser </Link>
          <br/>
          <button
            onClick={() => deleteUser(user._id)}
            className="mt-2 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
