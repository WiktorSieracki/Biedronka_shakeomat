"use client";
import { useState } from "react";
import {  useSearchParams } from "next/navigation";

export default function UpdateUser() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId").toString();
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const updateUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Error updating user');
      }

      const data = await response.json();
      setMessage('User updated successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} placeholder="User Name" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="User Email" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <input type="password" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} placeholder="User Password" className="mb-3 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300" />
      <button onClick={updateUser} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update User</button>
      {message && <p className="mt-3 text-green-500">{message}</p>}
    </div>
  );
}