import React, { useEffect, useState } from "react";
import { FaCoffee, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const ChatList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = AuthUser();

    // 🟢 Fetch cart for logged-in user
    const fetchCart = () => {
        axios
            .get(`http://localhost:8000/api/user-cart/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => {
                if (res.data.success) {
                    setItems(res.data.cart);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch cart:", err);
                toast.error("Failed to fetch cart.");
            })
            .finally(() => setLoading(false));
    };

    // 🟡 Increase quantity
    const increaseQty = (cartId) => {
        axios
            .put(`http://localhost:8000/api/cart/increment/${cartId}`, {}, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => {
                toast.success("Quantity increased");
                fetchCart();
            })
            .catch(() => toast.error("Failed to increase quantity"));
    };

    // 🔴 Decrease quantity
    const decreaseQty = (cartId) => {
        axios
            .put(`http://localhost:8000/api/cart/decrement/${cartId}`, {}, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => {
                toast.success(res.data.message);
                fetchCart();
            })
            .catch(() => toast.error("Failed to decrease quantity"));
    };

    // 🛒 Checkout
    const handleCheckout = (image_path, product_name) => {
        if (items.length === 0) {
            toast.error("🛒 Your cart is empty!");
            return;
        }

        axios.post(
            "http://localhost:8000/api/checkout",
            {
                payment_method: "cod",
                delivery_address: "Dhaka, Bangladesh",
                image_path: image_path,
                product_name: product_name,
            },
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            }
        )
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    setItems([]); // clear UI cart
                }
            })
            .catch((err) => {
                console.error("Checkout failed:", err);
                toast.error("Failed to confirm order.");
            });
    };


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            fetchCart();
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg">Loading cart...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f0e6] w-[60%] mx-auto flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#3e2723] rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#4e342e] text-[#f5f0e6] p-4 flex items-center gap-2">
                    <FaCoffee className="w-6 h-6" />
                    <h1 className="text-lg font-semibold">Coffee Cart</h1>
                </div>

                {/* Cart List */}
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto bg-[#f5f0e6]">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-[#d7ccc8] rounded-xl px-4 py-3 shadow-sm"
                            >
                                <div>
                                    <p className="text-[#3e2723] font-semibold">
                                        {item.product?.product_name}
                                    </p>
                                    <p className="text-sm text-[#5d4037]">
                                        ${item.unit_price} each
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="bg-[#6d4c41] text-white px-2 py-1 rounded-full hover:bg-[#5d4037]"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="font-bold text-[#3e2723] w-6 text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="bg-[#6d4c41] text-white px-2 py-1 rounded-full hover:bg-[#5d4037]"
                                    >
                                        <FaPlus />
                                    </button>
                                    <span className="text-[#4e342e] font-bold">
                                        ${(item.quantity * item.unit_price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[#5d4037] font-medium">
                            🛒 Your cart is empty
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#4e342e] text-[#f5f0e6] p-4 flex justify-between items-center">
                    <span className="font-bold text-lg">
                        Total: $
                        {items
                            .reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
                            .toFixed(2)}
                    </span>
                    <button
                        onClick={()=>handleCheckout()}
                        className="bg-[#6d4c41] hover:bg-[#5d4037] text-white px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                        disabled={items.length === 0}
                    >
                        <FaShoppingCart className="w-5 h-5" /> Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
