import React from "react";
import SearchBar from "./SearchBar";
import Login from "./LoginButton";
import { TokenContext } from "./Contexts";
import LogoutButton from "./LogoutButton";
import SignUp from "./SignUp";

const Header = () => {
  return (
    <header className="bg-red-500 text-white p-5 w-full flex justify-between items-center">
      <h1 className="text-2xl">Biedronka Shakeomat</h1>
      <SearchBar />
      <div>
        <TokenContext.Consumer>
          {(token) =>
            token ? (
              <div className="flex justify-between">
                <div className="flex justify-center items-center pr-4">
                  Logged in
                </div>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex justify-between">
                <Login />
                <SignUp />
              </div>
            )
          }
        </TokenContext.Consumer>
      </div>
    </header>
  );
};

export default Header;
