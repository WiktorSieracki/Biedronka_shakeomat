import React, { useEffect, useState } from "react";
import { SearchContext } from "./Contexts";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { search } = React.useContext(SearchContext);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/?search=${search}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
  
    fetchData();
  
    return () => {
      setProducts([]);
    };
  }, [search, refresh]);
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete the product');
      }
      await response.json(); // Assuming the response needs to be processed
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
