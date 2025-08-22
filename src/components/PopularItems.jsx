import React from 'react'
import { FaCoffee } from "react-icons/fa";

const PopularItems = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                <FaCoffee size={24} />
            </div>
            <div>
                <p className="text-gray-600">Popular Item</p>
                <h2 className="text-xl font-bold">Cappuccino</h2>
            </div>
        </div>

    )
}

export default PopularItems
