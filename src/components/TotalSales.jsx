import React from 'react'
import { FaDollarSign} from "react-icons/fa";

const TotalSales = ({stats}) => {
    return (

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <FaDollarSign size={24} />
            </div>
            <div>
                <p className="text-gray-600">Total Sales</p>
                <h2 className="text-xl font-bold">BDT: {stats ? stats.total_sales : 0}</h2>
            </div>
        </div>

    )
}

export default TotalSales
