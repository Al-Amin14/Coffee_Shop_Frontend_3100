import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TotalSales from "../components/TotalSales";
import OrdersToday from "../components/OrdersToday";
import PopularItems from "../components/PopularItems";
import Customer from "../components/Customer";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            fetchStats();
            fetchRecentOrders();
        }
    }, []);

    const fetchStats = () => {
        axios
            .get("https://coffeeshopbackend3100-production.up.railway.app/api/dashboard/stats", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => setStats(res.data))
            .catch((err) => {
                console.error("Error fetching stats:", err);
                toast.error("Failed to load dashboard stats.");
            });
    };

    const fetchRecentOrders = () => {
        setLoadingOrders(true);
        axios
            .get("https://coffeeshopbackend3100-production.up.railway.app/api/dashboard/recent-orders", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            })
            .then((res) => setRecentOrders(res.data))
            .catch((err) => {
                console.error("Error fetching recent orders:", err);
                toast.error("Failed to load recent orders.");
            })
            .finally(() => setLoadingOrders(false));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Top Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TotalSales stats={stats} />
                <OrdersToday stats={stats} />
                <PopularItems stats={stats} />
                <Customer stats={stats} />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Orders</h2>

                {loadingOrders ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-12 h-12 border-4 border-[#6d4c41] border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-4 text-[#4e342e] font-medium">Loading orders...</span>
                    </div>
                ) : recentOrders.length === 0 ? (
                    <p className="text-center text-gray-500">No recent orders.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border border-gray-200">Order ID</th>
                                <th className="p-3 border border-gray-200">Customer</th>
                                <th className="p-3 border border-gray-200">Total</th>
                                <th className="p-3 border border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="p-3 border border-gray-200">#{order.id}</td>
                                    <td className="p-3 border border-gray-200">{order.user?.name || "Unknown"}</td>
                                    <td className="p-3 border border-gray-200">tk {order.total_price}</td>
                                    <td
                                        className={`p-3 border border-gray-200 ${order.status === "completed"
                                                ? "text-green-600"
                                                : order.status === "pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
