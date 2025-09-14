import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TotalSales from "../components/TotalSales";
import OrdersToday from "../components/OrdersToday";
import PopularItems from "../components/PopularItems";
import Customer from "../components/Customer";

const InputField = ({ label, type = "text", value, onChange, ...props }) => (
  <div>
    <label className="block text-gray-700 mb-1 font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      {...props}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("file", file);
    console.log("Product Name:", productName);
    console.log("File:", file);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalSales />
        <OrdersToday />
        <PopularItems />
        <Customer />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Product Name"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Choose File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
          {preview && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2 font-medium">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl border shadow-sm"
              />

            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold tracking-wide transition transform hover:scale-[1.02]"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
