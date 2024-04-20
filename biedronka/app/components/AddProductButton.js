import React from "react";
import { useRouter } from "next/navigation";

export default function AddProductButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/AddProduct");
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Product
      </button>
    </div>
  );
}
