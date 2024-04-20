"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "./components/Header";
import { TokenContext, SearchContext } from "./components/Contexts";
import AllProducts from "./components/AllProducts";
import Notifications from "./components/Notifications";
import AllUsers from "./components/AllUsers";
import AddProductButton from "./components/AddProductButton";
import RandomPromotion from "./components/RandomPromotion";

export default function Home() {
  const [token, setToken] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    setToken(tokenFromCookie);
  }, []);

  return (
    <TokenContext.Provider value={token}>
      <SearchContext.Provider value={{ search, setSearch }}>
        <Notifications />
        <Header />
        {token && <RandomPromotion />}
        <AllProducts />
        <AddProductButton />
        <AllUsers />
      </SearchContext.Provider>
    </TokenContext.Provider>
  );
}
