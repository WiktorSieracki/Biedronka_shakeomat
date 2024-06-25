"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { TokenContext, SearchContext } from "./components/Contexts";
import AllProducts from "./components/AllProducts";
import Notifications from "./components/Notifications";
import AddProductButton from "./components/AddProductButton";
import RandomPromotion from "./components/RandomPromotion";
import { useSession } from "next-auth/react";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  return (
      <SearchContext.Provider value={{ search, setSearch }}>
        <Notifications />
        <Header />
        {session && <RandomPromotion />}
        <AllProducts />
        <AddProductButton />
      </SearchContext.Provider>
  );
}
