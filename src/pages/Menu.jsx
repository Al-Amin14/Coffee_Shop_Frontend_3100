import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const MenuPage = () => {
  const { http, token, user } = AuthUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    http
      .get("/products")
      .then((res) => {
        const productsData = Array.isArray(res.data) ? res.data : (res.data.products || []);
        const sanitizedProducts = productsData.map((product) => ({
          ...product,
          price: Number(product.price) || 0,
          image_path: product.image_path || "https://via.placeholder.com/400",
        }));
        setProducts(sanitizedProducts);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }, [token, navigate, http]);

  const handleAddToOrder = (product) => {
    if (user?.role !== "Customer") {
      toast.error("Only customers can place orders.");
      return;
    }

    const payload = {
      user_id: user.id,
      product_name: product.product_name,
      quantity: 1,
      total_price: product.price,
      image_path: product.image_path,
    };

    http
      .post("/orders", payload)
      .then(() => {
        toast.success(`Added ${product.product_name} to your orders!`);
        
      })
      .catch((err) => {
        console.error("Failed to add order:", err);
        toast.error(err.response?.data?.message || "Failed to add order.");
      });
  };

  if (loading) return <p className="p-6">Loading products...</p>;

  if (!products.length) return <p className="p-6">No products available.</p>;

  return (
    <div className="p-6 w-[70%] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Coffee Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={item.image_path}
              alt={item.product_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.product_name}</h2>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-yellow-700">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToOrder(item)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
