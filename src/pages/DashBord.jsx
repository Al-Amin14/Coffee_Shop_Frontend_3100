import React, { useEffect, useState } from "react";
import TotalSales from "../components/TotalSales";
import OrdersToday from "../components/OrdersToday";
import PopularItems from "../components/PopularItems";
import Customer from "../components/Customer";
import ProductAdd from "../components/ProductAdd";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {


    const [productName, setProductName] = useState("");
    const [file, setFile] = useState(null);

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", productName);
        formData.append("file", file);

        console.log("Product Name:", productName);
        console.log("File:", file);


    };
    
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/login')
        }
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TotalSales />
                <OrdersToday />

                <PopularItems />

                <Customer />

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Choose File</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {preview && (
                        <div className="mt-4">
                            <p className="text-gray-700 mb-2">Image Preview:</p>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-40 h-40 object-cover rounded-lg border"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
