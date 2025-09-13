import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import toast from "react-hot-toast";

const Profile = () => {
    const { http } = AuthUser();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));

            // fetch orders
            http
                .get("/orders")
                .then((res) => setOrders(res.data))
                .catch((err) => {
                    console.error("Error fetching orders:", err);
                    toast.error("Failed to load orders.");
                })
                .finally(() => setLoading(false));
        }
    }, []);

    if (!user) {
        return <p className="text-center mt-10 text-gray-600">No user data found</p>;
    }

    return (
        <div className="w-[60%] mx-auto mt-12 p-6">
            <div className="bg-gradient-to-br from-[#d7ccc8] to-[#a1887f] shadow-xl rounded-2xl p-8 text-center text-white mb-10">
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6d4c41] to-[#3e2723] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-sm opacity-80 mb-4">{user.role}</p>
                <p className="text-sm">{user.email}</p>
                <p className="text-sm">{user.contact_number}</p>
            </div>

            {JSON.parse(localStorage.getItem('user')).role!='Manager' && <h3 className="text-xl font-bold mb-4 text-[#3e2723]">☕ My Orders</h3>}

            {JSON.parse(localStorage.getItem('user')).role!='Manager'&& (loading ? (
                <div className="flex flex-col justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-[#6d4c41] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-[#4e342e] font-medium">Brewing your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <p className="text-gray-500 italic">You have no orders yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="p-5 rounded-xl shadow-md bg-[#efebe9] border border-[#d7ccc8]"
                        >
                            <h4 className="font-semibold text-[#4e342e] text-lg">
                                {order.product_name}
                            </h4>
                            <p className="text-sm text-gray-700">
                                Quantity: <span className="font-medium">{order.quantity}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Status: <span className="font-medium">{order.status}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Ordered on: {new Date(order.created_at).toLocaleDateString("en-GB")}
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Profile;
