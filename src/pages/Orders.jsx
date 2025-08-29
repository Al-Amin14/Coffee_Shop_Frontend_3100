import React, { useEffect, useState } from "react";
import { FaCoffee, FaHistory, FaListUl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const navigate=useNavigate();
    // Example data for demo
    const [currentOrders, setCurrentOrders] = useState([
        { id: 1, name: "Cappuccino", qty: 1, price: 4.5, status: "Preparing" },
        { id: 2, name: "Latte", qty: 2, price: 5.0, status: "On the way" },
    ]);

    const [orderHistory, setOrderHistory] = useState([
        {
            id: 101,
            items: [
                { name: "Espresso", qty: 1, price: 3.0 },
                { name: "Latte", qty: 1, price: 5.0 },
            ],
            total: 8.0,
            date: "2025-08-28",
        },
        {
            id: 102,
            items: [{ name: "Cappuccino", qty: 2, price: 4.5 }],
            total: 9.0,
            date: "2025-08-25",
        },
    ]);
    
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    }, []);


    return (
        <div className="min-h-screen w-[60%] mx-auto bg-[#f5f0e6] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-[#3e2723] rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#4e342e] text-[#f5f0e6] p-4 flex items-center gap-2">
                    <FaCoffee className="w-6 h-6" />
                    <h1 className="text-lg font-semibold">My Orders</h1>
                </div>

                {/* Current Orders */}
                <div className="p-4 bg-[#f5f0e6]">
                    <h2 className="flex items-center gap-2 text-[#3e2723] font-bold mb-3">
                        <FaListUl /> Current Orders
                    </h2>
                    {currentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {currentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex justify-between items-center bg-[#d7ccc8] rounded-xl px-4 py-3 shadow-sm"
                                >
                                    <div>
                                        <p className="text-[#3e2723] font-semibold">
                                            {order.name} × {order.qty}
                                        </p>
                                        <p className="text-sm text-[#5d4037]">
                                            Status: {order.status}
                                        </p>
                                    </div>
                                    <span className="text-[#4e342e] font-bold">
                                        ${(order.qty * order.price).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#5d4037]">No active orders</p>
                    )}
                </div>

                {/* Order History */}
                <div className="p-4 bg-[#f5f0e6] border-t border-[#d7ccc8]">
                    <h2 className="flex items-center gap-2 text-[#3e2723] font-bold mb-3">
                        <FaHistory /> Order History
                    </h2>
                    {orderHistory.length > 0 ? (
                        <div className="space-y-3">
                            {orderHistory.map((history) => (
                                <div
                                    key={history.id}
                                    className="bg-[#d7ccc8] rounded-xl p-4 shadow-sm"
                                >
                                    <p className="text-[#3e2723] font-semibold">
                                        Order #{history.id}
                                    </p>
                                    <p className="text-sm text-[#5d4037] mb-1">
                                        Date: {history.date}
                                    </p>
                                    <ul className="ml-4 text-sm text-[#3e2723] list-disc">
                                        {history.items.map((item, i) => (
                                            <li key={i}>
                                                {item.name} × {item.qty} = $
                                                {(item.price * item.qty).toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-[#4e342e] font-bold mt-2">
                                        Total: ${history.total.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#5d4037]">No previous orders</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
