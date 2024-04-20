import React, { useContext } from "react";
import { SearchContext } from "./Contexts";

export default function SearchBar() {
  const { search, setSearch } = useContext(SearchContext);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="flex items-center justify-center h-1/2 w-3/5">
      <input
        className="border-2 border-gray-300 bg-white w-full h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none text-gray-700 "
        type="search"
        name="search"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mt-5 mr-4"
      ></button>
    </div>
  );
}
