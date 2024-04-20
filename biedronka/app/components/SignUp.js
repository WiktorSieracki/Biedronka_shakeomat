import React from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/Signup");
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-white hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
      >
        SignUp
      </button>
    </div>
  );
}
