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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-4 bg-white shadow-md border border-gray-100 rounded-xl p-4 hover:shadow-lg transition"
          >
            <img
              src={order.image_path || "https://via.placeholder.com/80"}
              alt={order.product_name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-800">{order.product_name}</h2>
              <p className="text-gray-600 text-sm">Quantity: {order.quantity}</p>
              <p className="text-yellow-700 font-bold">${Number(order.total_price).toFixed(2)}</p>
              <p className="text-gray-500 capitalize">Status: {order.status}</p>
              <p className="text-sm text-gray-400">
                Ordered on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(order.id)}
              className="text-red-500 hover:text-red-700 font-semibold text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
