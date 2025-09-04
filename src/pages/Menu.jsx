import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { user } = AuthUser();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }

        // Fetch products from API
        axios
            .get("http://localhost:8000/api/allproducts", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => {
                if (res.data.success) {
                    setProducts(res.data.products);
                }
            })
            .catch((err) => console.error("Failed to fetch products:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col mx-auto items-center justify-center h-[60vh]">
                <svg
                    className="animate-spin h-12 w-12 text-yellow-600 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                </svg>
                <span className="text-xl font-semibold text-gray-700">
                    Loading products...
                </span>
            </div>
        );
    }

    // Place Order Function
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

        axios
            .post("http://localhost:8000/api/orders", payload, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then(() => {
                toast.success(`Added ${product.product_name} to your orders!`);
            })
            .catch((err) => {
                console.error("Failed to add order:", err);
                toast.error(err.response?.data?.message || "Failed to add order.");
            });
    };

    // Add to Cart Function
    const handleAddToCart = (product) => {
        if (user?.role !== "Customer") {
            toast.error("Only customers can add to cart.");
            return;
        }

        const payload = {
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
            unit_price: product.price,
            total_price: product.price
        };

        axios
            .post("http://localhost:8000/api/addchart", payload, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => {
                toast.success(res.data.message || `${product.product_name} added to cart!`);
            })
            .catch((err) => {
                console.error("Failed to add to cart:", err);
                toast.error(err.response?.data?.message || "Failed to add to cart.");
            });
    };

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
                                    ${item.price}
                                </span>
                                {
                                    user.role != 'Manager' &&
                                    <div className="flex gap-2">
                                        {/* Order Button */}
                                        <button
                                            onClick={() => handleAddToOrder(item)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg transition"
                                        >
                                            Order
                                        </button>

                                        {/* Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;
