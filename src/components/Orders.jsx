import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const Orders = () => {
  const { http } = AuthUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    http
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    http
      .delete(`/orders/${id}`)
      .then(() => {
        toast.success("Order deleted.");
        fetchOrders(); // Refresh list
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        toast.error("Failed to delete order.");
      });
  };

  if (loading) return <p className="p-6 text-gray-600">Loading your orders...</p>;

  if (orders.length === 0) return <p className="p-6 text-gray-500">You have no orders yet.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Your Orders</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
          >
            {/* Image */}
            <img
              src={order.image_path || "https://via.placeholder.com/400x250"}
              alt={order.product_name}
              className="w-full h-40 object-cover"
            />

            {/* Content */}
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {order.product_name}
              </h2>

              <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>

              <p className="text-lg font-bold text-yellow-700">
                ${Number(order.total_price).toFixed(2)}
              </p>

              {/* Status badge */}
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>

              <p className="text-xs text-gray-400">
                Ordered on:{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* Actions */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => handleDelete(order.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
