import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import AuthUser from "../components/AuthUser";

const OrdersToday = ({stats}) => {
  const { http } = AuthUser();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Adjust the endpoint to match your Laravel route
    http.get("/orders/today-count")
      .then((response) => {
        setOrderCount(response.data.count);
      })
      .catch((error) => {
        console.error("Failed to fetch today's orders:", error);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        <FaShoppingCart size={24} />
      </div>
      <div>
        <p className="text-gray-600">Orders Today</p>
        <h2 className="text-xl font-bold">{stats?stats.orders_today:0}</h2>
      </div>
    </div>
  );
};

export default OrdersToday;
