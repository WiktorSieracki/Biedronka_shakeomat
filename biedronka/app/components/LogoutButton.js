import React from "react";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const handleClick = () => {
    Cookies.remove("token");
    window.location.reload();
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-white hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
