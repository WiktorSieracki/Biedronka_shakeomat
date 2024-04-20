import React, { useEffect, useState } from "react";
import { SearchContext } from "./Contexts";
import Link from "next/link";


export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { search } = React.useContext(SearchContext);

  useEffect(() => {
    fetch(`http://localhost:5000/products/?search=${search}`)
      .then((response) => response.json())
      .then((data) => setProducts(data));

    return () => {
      setProducts([]);
    };
  }, [search,refresh]);

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => setRefresh(!refresh))
      .catch((error) => console.error(error));
  };
  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product) => (
        <div
          key={product._id}
          className="m-4 bg-gray-300 p-6 rounded shadow-lg w-64"
        >
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <p className="text-green-500 text-lg font-semibold">
            {product.price} zł
          </p>
          <p className="text-gray-700">{product.description}</p>
          <button
            onClick={() => handleDelete(product._id)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
          <Link href={`/UpdateProduct?productId=${product._id}`}> EditProduct </Link>
        </div>
      ))}
    </div>
  );
}
