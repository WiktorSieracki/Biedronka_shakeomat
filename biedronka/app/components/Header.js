import React from "react";
import SearchBar from "./SearchBar";
import Login from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="bg-red-500 text-white p-5 w-full flex justify-between items-center">
      <h1 className="text-2xl">Biedronka Shakeomat</h1>
      <SearchBar />
      <div>
        {session ? (
          <div className="flex justify-between">
            <div className="flex justify-center items-center pr-4">
              Logged in
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex justify-between">
            <Login />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
