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

  const token = localStorage.getItem("token");

  // Fetch user's cart
  const fetchCart = async () => {
    if (!user || !user.id || !token) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`http://localhost:8000/api/user-cart/${user.id}`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });

      if (res.data.success) {
        setCartItems(res.data.cart);
        const totalAmount = res.data.cart.reduce(
          (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
          0
        );
        setTotal(totalAmount);
      } else {
        setError("Failed to fetch cart items");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching cart items");
    } finally {
      setLoading(false);
    }
  };

  // Increase quantity
  const increaseQty = async (cartId) => {
    try {
      await axios.put(`http://localhost:8000/api/cart/increment/${cartId}`, {}, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      toast.success("Quantity increased");
      fetchCart();
    } catch {
      toast.error("Failed to increase quantity");
    }
  };

  // Decrease quantity
  const decreaseQty = async (cartId) => {
    try {
      await axios.put(`http://localhost:8000/api/cart/decrement/${cartId}`, {}, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
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
      // Convert all items to correct Stripe format
      const payload = cartItems.map((item) => ({
        product_name: String(item.product_name),
        amount: Math.round(Number(item.unit_price) * 100), // cents
        quantity: Number(item.quantity) || 1,
      }));

      // Inside handleCheckout in PaymentPage.jsx

const response = await axios.post(
  "http://localhost:8000/api/create-checkout-session",
  {
    items: payload,     // Array of items
    userId: user.id,    // Pass user ID for backend to use
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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading cart...</p>
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
                <div className="text-center text-gray-500">
                  Your cart is empty!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p>{item.product_name}</p>
                      <p>{Number(item.quantity)} x ${Number(item.unit_price).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-red-500 text-white p-2 rounded-full"
                      >
                        <FaMinus />
                      </button>
                      <span>{Number(item.quantity)}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="bg-green-500 text-white p-2 rounded-full"
                      >
                        <FaPlus />
                      </button>
                      <span>${(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}

              {/* Total */}
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
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
