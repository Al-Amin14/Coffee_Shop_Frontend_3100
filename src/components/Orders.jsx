import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const Orders = () => {
  const { http } = AuthUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    const role = JSON.parse(localStorage.getItem("user")).role;

    if (role === "Customer") {
      http
        .get("/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error("Failed to load orders.");
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .get("http://localhost:8000/api/orders/manager", {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error("Failed to load orders.");
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    http
      .delete(`/orders/${id}`)
      .then(() => {
        toast.success("Order deleted.");
        fetchOrders();
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        toast.error("Failed to delete order.");
      });
  };

  const handleConfirm = (orderId) => {
    const token = JSON.parse(localStorage.getItem("token"));

    axios
      .post(
        `http://localhost:8000/api/orders/confirm/${orderId}`,
        {
          payment_method: "bkash",
          delivery_address: "Mohanogor Project : Road 1",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          fetchOrders();
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error confirming order:", err);
        toast.error("Failed to confirm order.");
      });
  };

  const handleUpdateConfirmedBy = (orderId, confirmedBy) => {
    const token = JSON.parse(localStorage.getItem("token"));

    axios
      .put(
        `http://localhost:8000/api/orders/${orderId}/confirmed-by`,
        { confirmed_by: confirmedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchOrders();
        }
      })
      .catch((err) => {
        console.error("Error updating confirmed_by:", err);
        toast.error("Failed to update confirmed_by.");
      });
  };

  if (loading)
    return (
      <p className="p-6 text-gray-600 text-center animate-pulse font-bold text-3xl mx-auto w-full h-full ">
        Loading your orders...
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="p-6 text-gray-500 text-center italic">
        You have no orders yet.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
        🛒 Your Orders
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-5 bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100 rounded-2xl p-5 hover:shadow-2xl hover:scale-[1.02] transition duration-300"
          >
            <img
              src={order.image_path || "https://via.placeholder.com/80"}
              alt={order.product_name}
              className="w-28 h-28 object-cover rounded-xl border"
            />

            <div className="flex-grow space-y-2">
              <h2 className="text-xl font-bold text-gray-800">
                {order.product_name}
              </h2>
              <p className="text-gray-600 text-sm">
                Quantity:{" "}
                <span className="font-semibold text-gray-800">
                  {order.quantity}
                </span>
              </p>
              <p className="text-lg text-indigo-700 font-bold">
                ${Number(order.total_price).toFixed(2)}
              </p>

              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {order.status === "completed" && <FaCheckCircle />}
                  {order.status === "processing" && <FaHourglassHalf />}
                  {order.status === "cancelled" && <FaTimesCircle />}
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                Ordered on:{" "}
                {new Date(order.created_at).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="flex flex-col gap-3 items-end">
              {JSON.parse(localStorage.getItem("user")).role !== "Manager" ? (
                order.status === "completed" ? (
                  order.MangerConfirm === "completed" ? (
                    <span className="flex items-center text-green-600 font-medium text-sm">
                      <FaCheckCircle className="mr-1" /> Order Confirmed
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 font-medium text-sm">
                      <FaHourglassHalf className="mr-1" /> Pending Manager
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => handleConfirm(order.id)}
                    className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
                  >
                    Confirm Order
                  </button>
                )
              ) : order.status === "completed" ? (
                order.MangerConfirm !== "completed" ? (
                  <button
                    onClick={() =>
                      handleUpdateConfirmedBy(
                        order.id,
                        JSON.parse(localStorage.getItem("user")).name
                      )
                    }
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-md"
                  >
                    Confirm Orders
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">✔ Completed</span>
                )
              ) : (
                <span className="flex items-center text-red-600 font-medium text-sm">
                  <FaHourglassHalf className="mr-1" /> Waiting...
                </span>
              )}

              <button
                onClick={() => handleDelete(order.id)}
                className="flex items-center text-red-500 hover:text-red-700 text-xs"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
