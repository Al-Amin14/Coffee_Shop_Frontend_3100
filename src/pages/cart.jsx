import React, { useState, useEffect } from "react";
import { FaCoffee, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { Loader2, CreditCard } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";


const pulseClass =
  "transition-transform duration-150 active:scale-95 hover:scale-105";

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


  const [updatingItemId, setUpdatingItemId] = useState(null);

  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const [totalFlash, setTotalFlash] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!user || !user.id || !token) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/user-cart/${user.id}`,
        {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }
      );

      if (res.data.success) {
        setCartItems(res.data.cart);
        const totalAmount = res.data.cart.reduce(
          (sum, item) =>
            sum + Number(item.unit_price) * Number(item.quantity),
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

  const increaseQty = async (cartId) => {
    setUpdatingItemId(cartId); // 🔹 ADD
    try {
      await axios.put(
        `http://localhost:8000/api/cart/increment/${cartId}`,
        {},
        {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }
      );
      toast.success("Quantity increased");

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        )
      );
    } catch {
      toast.error("Failed to increase quantity");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const decreaseQty = async (cartId) => {
    setUpdatingItemId(cartId);
    try {
      await axios.put(
        `http://localhost:8000/api/cart/decrement/${cartId}`,
        {},
        {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        }
      );
      toast.success("Quantity decreased");

      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === cartId
              ? {
                ...item,
                quantity: Math.max(Number(item.quantity) - 1, 0),
              }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch {
      toast.error("Failed to decrease quantity");
    } finally {
      setUpdatingItemId(null);
    }
  };

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
      // use the updated local cartItems
      const payload = cartItems.map((item) => ({
        product_name: String(
          item.product_name ||
          item.name ||
          item.product?.product_name ||
          "Coffee Product"
        ),
        amount: Math.round(Number(item.unit_price)),
        quantity: Number(item.quantity) || 1,
      }));
      // console.log(payload)

      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-checkout-session",
        {
          items: payload,
          userId: user.id,
          payment_method: "stripe",
          delivery_address: "Dhaka, Bangladesh",
          image_path: null,
          product_name: "All Products",
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
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
      setError(
        err.response?.data?.error ||
        "Failed to create checkout session"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.unit_price) * Number(item.quantity),
      0
    );
    setTotal(totalAmount);


    setTotalFlash(true);
    const timer = setTimeout(() => setTotalFlash(false), 300);
    return () => clearTimeout(timer);
  }, [cartItems]);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    } else {
      fetchCart();
    }
  }, []);

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-amber-50">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
        <p className="ml-3 text-lg font-medium">
          Loading your cart...
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="mx-auto w-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="flex justify-center mb-4">
              <FaCoffee className="h-16 w-16 text-amber-600 animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Coffee Shop
            </h1>
            <p className="text-gray-600">
              Complete your purchase
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FaShoppingCart className="h-5 w-5 mr-2 text-amber-600" />
              Your Selection
            </h2>

            <div className="space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500 italic">
                  Your cart is empty!
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-50 pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg uppercase">
                        {item.product_name ||
                          item.name ||
                          item.product?.product_name ||
                          "Unnamed Item"}
                      </p>
                      <p className="text-amber-600 text-sm">
                        ৳{Number(item.unit_price).toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          disabled={updatingItemId === item.id}
                          className={`bg-white text-red-500 p-1 rounded-full shadow-sm hover:bg-red-50 disabled:opacity-50 ${pulseClass}`}
                        >
                          <FaMinus size={12} />
                        </button>

                        <span className="mx-3 font-bold text-gray-700">
                          {Number(item.quantity)}
                        </span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          disabled={updatingItemId === item.id}
                          className={`bg-white text-green-500 p-1 rounded-full shadow-sm hover:bg-green-50 disabled:opacity-50 ${pulseClass}`}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <span className="font-black text-gray-900">
                          ৳
                          {(
                            Number(item.unit_price) *
                            Number(item.quantity)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div
                className={`flex justify-between font-black text-gray-900 mt-6 pt-4 border-t-2 border-dashed border-gray-200 transition-colors ${totalFlash ? "text-amber-600" : ""
                  }`}
              >
                <span className="text-lg">GRAND TOTAL</span>
                <span className="text-2xl text-amber-700">
                  ৳{total.toFixed(2)}
                </span>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">
                    {success}
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className={`w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-amber-700 hover:to-orange-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-lg ${pulseClass}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-6 w-6 mr-2" />
                    Checkout Now
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
