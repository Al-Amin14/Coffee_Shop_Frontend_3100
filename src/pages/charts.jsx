import React, { useState, useEffect } from "react";
import { FaCoffee, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { Loader2, CreditCard } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";

// ErrorBoundary to catch runtime errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-red-600">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const PaymentPage = () => {
    const navigate = useNavigate();
    const { user } = AuthUser();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
    });

    // Decrease quantity
    const decreaseQty = async (cartId) => {
        try {
            await axios.put(
                `http://localhost:8000/api/cart/decrement/${cartId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }
            );
            toast.success("Quantity decreased");
            fetchCart();
        } catch {
            toast.error("Failed to decrease quantity");
        }
    };

    // Handle Stripe checkout
    const handleCheckout = async () => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            setError("🛒 Your cart is empty!");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Convert items with amount in paisa (BDT * 100)
            const payload = cartItems.map((item) => ({
                product_name: String(item.product_name),
                amount: Math.round(Number(item.unit_price)), // BDT to paisa
                quantity: Number(item.quantity) || 1,
            }));

            const response = await axios.post(
                "http://localhost:8000/api/create-checkout-session",
                {
                    items: payload,
                    userId: user.id,
                },
                {
                    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
                }
            );

            if (response.data.url) {
                setSuccess("Redirecting to Stripe...");
                window.location.href = response.data.url;
            } else {
                setError("Failed to create checkout session");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create checkout session");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !user) {
            navigate("/login");
        } else {
            fetchCart();
        }
    }, [user, token, navigate]);

    if (loading) {
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
                            onClick={() => handleCheckout()}
                            className="bg-[#6d4c41] hover:bg-[#5d4037] text-white px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                            disabled={items.length === 0}
                        >
                            <FaShoppingCart className="w-5 h-5" /> Checkout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 pt-8">
                        <div className="flex justify-center mb-4">
                            <FaCoffee className="h-16 w-16 text-amber-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coffee Shop</h1>
                        <p className="text-gray-600">Your Cart</p>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <FaShoppingCart className="h-5 w-5 mr-2" />
                            Your Cart
                        </h2>

                        <div className="space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="text-center text-gray-500">Your cart is empty!</div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div>
                                            <p>{item.product_name}</p>
                                            <p>
                                                {Number(item.quantity)} x ৳
                                                {Number(item.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 items-center">
                                            <button
                                                onClick={() => decreaseQty(item.id)}
                                                className="bg-red-500 text-white p-2 rounded-full"
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus />
                                            </button>
                                            <span>{Number(item.quantity)}</span>
                                            <button
                                                onClick={() => increaseQty(item.id)}
                                                className="bg-green-500 text-white p-2 rounded-full"
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus />
                                            </button>
                                            <span>
                                                ৳
                                                {(Number(item.unit_price) * Number(item.quantity)).toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Total */}
                            <div className="flex justify-between font-bold text-gray-900 mt-6">
                                <span>Total</span>
                                <span>৳{total.toFixed(2)}</span>
                            </div>

                            {/* Error / Success */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}
                            {success && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-600 text-sm">{success}</p>
                                </div>
                            )}

                            {/* Checkout */}
                            <button
                                onClick={handleCheckout}
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Proceed to Checkout
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default PaymentPage;

