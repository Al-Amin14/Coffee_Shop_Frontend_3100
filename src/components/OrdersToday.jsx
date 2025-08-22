import React from 'react'
import { FaShoppingCart } from "react-icons/fa";

const OrdersToday = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <FaShoppingCart size={24} />
            </div>
            <div>
                <p className="text-gray-600">Orders Today</p>
                <h2 className="text-xl font-bold">56</h2>
            </div>
        </div>  
    )
}

export default OrdersToday
