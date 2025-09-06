import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const OrderCard = ({ order }) => (
  <div className="flex items-center gap-4 bg-white shadow rounded-lg p-4">
    <img
      src={order.image_path || "https://via.placeholder.com/80"}
      alt={order.product_name}
      className="w-20 h-20 object-cover rounded-lg"
    />
    <div className="flex-grow">
      <h2 className="text-xl font-semibold">{order.product_name}</h2>
      <p>Quantity: {order.quantity}</p>
      <p className="font-bold text-yellow-700">${Number(order.total_price).toFixed(2)}</p>
      <p className="capitalize text-gray-600">Status: {order.status}</p>
      <p className="text-sm text-gray-500">Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
    </div>
  </div>
);

const Orders = () => {
  const { http } = AuthUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders.");
      })
      .finally(() => setLoading(false));
  }, [http]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading your orders...</p>;
  if (!orders.length) return <p className="p-6 text-center text-gray-600">You have no orders yet.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
