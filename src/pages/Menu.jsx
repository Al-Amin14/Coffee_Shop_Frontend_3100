import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthUser from "../components/AuthUser";

const MenuPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ search state
    const [sortOrder, setSortOrder] = useState(""); // ✅ sort state
    const navigate = useNavigate();
    const { user } = AuthUser();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }

        axios
            .get("https://coffeeshopbackend3100-production.up.railway.app/api/allproducts", {
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

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    // ✅ filter products by search
    let filteredProducts = products.filter((item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ✅ sort products by price
    if (sortOrder === "asc") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    }

    const askBot = async (question) => {
        setMessages((prev) => [...prev, { role: "user", text: question }]);
        setLoadingMessage(true);

        try {
            const response = await fetch("https://coffeeshopbackend3100-production.up.railway.app/api/genai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
                body: JSON.stringify({ question: question + " give me short answer" }),
            });

            const data = await response.json();
            const botMessage = {
                role: "bot",
                text: data.reply || "Sorry, I couldn’t get an answer.",
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "⚠️ Error connecting to AI." },
            ]);
        } finally {
            setLoadingMessage(false);
        }
    };

    return (
        <div className="p-6 w-[70%] mx-auto relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Coffee Menu</h1>

            {/* ✅ Search + Sort */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search coffee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                >
                    <option value="">Sort by Price</option>
                    <option value="asc">Low → High</option>
                    <option value="desc">High → Low</option>
                </select>
            </div>

            {/* ✅ Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleProductClick(item)}
                            className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
                        >
                            <img
                                src={item.image_path}
                                alt={item.product_name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800">{item.product_name}</h2>
                                <p className="text-gray-600 text-sm mb-2 truncate">{item.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-yellow-700">
                                        ${item.price}
                                    </span>
                                    <span className="text-sm text-gray-400">Tap for more</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-3">No products found.</p>
                )}
            </div>

            {/* Chatbot Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-6 right-6 bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:bg-yellow-700 transition"
            >
                {isChatOpen ? "✖" : "💬"}
            </button>

            {/* Chatbot UI */}
            {isChatOpen && (
                <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl border p-4 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h2 className="text-lg font-bold text-yellow-700">Coffee Assistant</h2>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-red-500">
                            ✖
                        </button>
                    </div>

                    <div className="flex-1 p-2 space-y-2 overflow-y-auto h-48">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg max-w-[80%] ${msg.role === "user"
                                    ? "bg-yellow-100 ml-auto text-right"
                                    : "bg-gray-100 mr-auto text-left"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {loadingMessage && (
                            <div className="text-sm text-gray-400">⏳ Generating response...</div>
                        )}
                    </div>

                    {/* Fixed Questions */}
                    <div className="grid grid-cols-1 gap-2 mt-3">
                        <button
                            onClick={() => askBot("Which product should I choose?")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg text-sm"
                        >
                            Which product should I choose?
                        </button>
                        <button
                            onClick={() => askBot("Give me a description about the best coffee.")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg text-sm"
                        >
                            Best coffee description
                        </button>
                        <button
                            onClick={() => askBot("Recommend me one coffee like this.")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg text-sm"
                        >
                            Recommend one coffee
                        </button>
                        <button
                            onClick={() => askBot("What is the most popular coffee?")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg text-sm"
                        >
                            What is the most popular coffee?
                        </button>
                        <button
                            onClick={() => askBot("Which coffee is best for morning?")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg text-sm"
                        >
                            Which coffee is best for morning?
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
