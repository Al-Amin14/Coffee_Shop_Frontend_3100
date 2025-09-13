import React from 'react'
import { FaUsers } from "react-icons/fa";

const Customer = ({ stats }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                <FaUsers size={24} />
            </div>
            <div>
                <p className="text-gray-600">Customers</p>
                <h2 className="text-xl font-bold">{stats ? stats.total_customers : 0}</h2>
            </div>
        </div>
    )
}

export default Customer
