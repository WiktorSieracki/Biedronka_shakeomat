import React from "react";
import { signIn } from "next-auth/react";


export default function Login() {

  const handleClick = () => {
    signIn("keycloak");
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
