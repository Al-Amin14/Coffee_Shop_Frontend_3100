import React, { useEffect, useState } from "react";
import { FaCoffee, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
    const navigate=useNavigate()
    const [items, setItems] = useState([
        { id: 1, name: "Cappuccino", price: 4.5, qty: 1 },
        { id: 2, name: "Latte", price: 5.0, qty: 2 },
        { id: 3, name: "Espresso", price: 3.0, qty: 1 },
    ]);

    const handleCheckout = () => {
        if (items.length === 0) {
            alert("🛒 Your cart is empty!");
            return;
        }

        const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        alert(`✅ Order placed!\n\nTotal: $${total.toFixed(2)}\nThank you for shopping ☕`);

        setItems([]);
    };

    const increaseQty = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
        ));
    };

    const decreaseQty = (id) => {
        setItems(items
            .map(item =>
                item.id === id ? { ...item, qty: Math.max(item.qty - 1, 0) } : item
            )
            .filter(item => item.qty > 0) // remove item if qty is 0
        );
    };

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate('/login')
        }
    }, []);
    

    return (
        <div className="min-h-screen bg-[#f5f0e6] w-[60%] mx-auto flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#3e2723] rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#4e342e] text-[#f5f0e6] p-4 flex items-center gap-2">
                    <FaCoffee className="w-6 h-6" />
                    <h1 className="text-lg font-semibold">Coffee Chat List</h1>
                </div>

                {/* Chat List */}
                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto bg-[#f5f0e6]">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-[#d7ccc8] rounded-xl px-4 py-3 shadow-sm"
                            >
                                <div>
                                    <p className="text-[#3e2723] font-semibold">{item.name}</p>
                                    <p className="text-sm text-[#5d4037]">
                                        ${item.price.toFixed(2)} each
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="bg-[#6d4c41] text-white px-2 py-1 rounded-full hover:bg-[#5d4037]"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="font-bold text-[#3e2723] w-6 text-center">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="bg-[#6d4c41] text-white px-2 py-1 rounded-full hover:bg-[#5d4037]"
                                    >
                                        <FaPlus />
                                    </button>
                                    <span className="text-[#4e342e] font-bold">
                                        ${(item.qty * item.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[#5d4037] font-medium">
                            🛒 Your cart is empty
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#4e342e] text-[#f5f0e6] p-4 flex justify-between items-center">
                    <span className="font-bold text-lg">
                        Total: $
                        {items
                            .reduce((sum, item) => sum + item.price * item.qty, 0)
                            .toFixed(2)}
                    </span>
                    <button
                        onClick={handleCheckout}
                        className="bg-[#6d4c41] hover:bg-[#5d4037] text-white px-4 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                        disabled={items.length === 0}
                    >
                        <FaShoppingCart className="w-5 h-5" /> Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
