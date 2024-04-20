import React from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/Login");
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-white hover:bg-green-700 text-black font-bold py-2 px-4 rounded mr-3"
      >
        Login
      </button>
    </div>
  );
}
