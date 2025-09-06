import React, { useState, useEffect } from "react";
import { FaCoffee, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { Loader2, CreditCard } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";

/* 🌟 ErrorBoundary */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
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

/* 🌟 Cart Item Component */
const CartItem = ({ item, onIncrease, onDecrease }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
    <div>
      <p className="font-medium text-gray-800">{item.product_name}</p>
      <p className="text-sm text-gray-500">
        {item.quantity} × ৳{Number(item.unit_price).toFixed(2)}
      </p>
    </div>
    <div className="flex gap-3 items-center">
      <button
        onClick={() => onDecrease(item.id)}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
        aria-label="Decrease quantity"
      >
        <FaMinus />
      </button>
      <span className="font-semibold">{item.quantity}</span>
      <button
        onClick={() => onIncrease(item.id)}
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
        aria-label="Increase quantity"
      >
        <FaPlus />
      </button>
      <span className="ml-2 font-semibold text-gray-800">
        ৳{(item.unit_price * item.quantity).toFixed(2)}
      </span>
    </div>
  </div>
);

/* 🌟 Alerts */
const ErrorAlert = ({ message }) =>
  message && (
    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
      {message}
    </div>
  );

const SuccessAlert = ({ message }) =>
  message && (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
      {message}
    </div>
  );

/* 🌟 Main Payment Page */
const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = AuthUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  /* 🔹 Axios instance */
  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { Authorization: `Bearer ${JSON.parse(token)}` },
  });

  /* 🔹 Fetch cart */
  const fetchCart = async () => {
    if (!user?.id || !token) return navigate("/login");
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/user-cart/${user.id}`);
      if (res.data.success) {
        setCartItems(res.data.cart);
        setTotal(
          res.data.cart.reduce(
            (sum, item) => sum + item.unit_price * item.quantity,
            0
          )
        );
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

  /* 🔹 Modify quantity */
  const modifyQty = async (cartId, type) => {
    try {
      await api.put(`/cart/${type}/${cartId}`);
      toast.success(`Quantity ${type === "increment" ? "increased" : "decreased"}`);
      fetchCart();
    } catch {
      toast.error(`Failed to ${type} quantity`);
    }
  };

  /* 🔹 Checkout */
  const handleCheckout = async () => {
    if (!token || !user) return navigate("/login");
    if (cartItems.length === 0) return setError("🛒 Your cart is empty!");

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = cartItems.map((item) => ({
        product_name: String(item.product_name),
        amount: Math.round(item.unit_price),
        quantity: item.quantity,
      }));

      const res = await api.post("/create-checkout-session", {
        items: payload,
        userId: user.id,
        payment_method: "cod",
        delivery_address: "Dhaka, Bangladesh",
        image_path: null,
        product_name: "All Products",
      });

      if (res.data.url) {
        setSuccess("Redirecting to Stripe...");
        window.location.href = res.data.url;
      } else {
        setError("Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Initial Load */
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading cart...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="mx-auto w-[60%] min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <FaCoffee className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Coffee Shop</h1>
            <p className="text-gray-600">Your Cart</p>
          </div>

          {/* Cart Box */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaShoppingCart className="h-5 w-5 mr-2" />
              Your Cart
            </h2>

            {/* Items */}
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty!</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={(id) => modifyQty(id, "increment")}
                    onDecrease={(id) => modifyQty(id, "decrement")}
                  />
                ))}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 border-t">
              <span>Total</span>
              <span>৳{total.toFixed(2)}</span>
            </div>

            {/* Alerts */}
            <ErrorAlert message={error} />
            <SuccessAlert message={success} />

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
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
    </ErrorBoundary>
  );
};

export default PaymentPage;
