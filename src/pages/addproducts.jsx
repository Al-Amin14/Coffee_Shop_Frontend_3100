import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import { useNavigate } from "react-router-dom";

export default function ProductForm() {
    const { http } = AuthUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        stock_quantity: "",
        unit: "",
        is_available: false,
        image_path: null,
        created_at: "",
        updated_at: "",
    });

    const [toast, setToast] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false); // ✅ Loading state

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files[0]
                        : value,
        });
    };

    // Show toast
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = "";

        try {
            setLoading(true); // ✅ Start loading

            // Upload image to Cloudinary if present
            if (formData.image_path) {
                const imageData = new FormData();
                imageData.append("file", formData.image_path);
                imageData.append("upload_preset", "insta_clone");
                imageData.append("cloud_name", "clouding1");

                const cloudRes = await fetch(
                    "https://api.cloudinary.com/v1_1/clouding1/image/upload",
                    {
                        method: "POST",
                        body: imageData,
                    }
                );

                const cloudData = await cloudRes.json();

                if (!cloudRes.ok) {
                    throw new Error("Failed to upload image");
                }

                imageUrl = cloudData.url;
            }

            // Prepare data
            const dataToSend = { ...formData, image_path: imageUrl };

            // Send to Laravel API
            const res = await http.post("/addproduct", dataToSend);

            if (res.data.success) {
                showToast("Product created successfully!", "success");

                // Reset form
                setFormData({
                    product_name: "",
                    description: "",
                    category: "",
                    price: "",
                    discount: "",
                    stock_quantity: "",
                    unit: "",
                    is_available: false,
                    image_path: null,
                    created_at: "",
                    updated_at: "",
                });
            } else {
                showToast("Failed to create product.", "error");
            }
        } catch (err) {
            console.error("Error:", err);
            const message =
                err.response?.data?.message ||
                err.message ||
                "An error occurred";
            showToast(message, "error");
        } finally {
            setLoading(false); // ✅ Stop loading
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10 relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Add / Update Product
            </h2>

            {/* Toast Notification */}
            {toast.message && (
                <div
                    className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white font-semibold transition-opacity
                    ${toast.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Product Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Category
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    ></textarea>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Discount */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Discount (%)
                    </label>
                    <input
                        type="number"
                        name="discount"
                        step="0.01"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {/* Stock Quantity */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Unit */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Unit
                    </label>
                    <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder="e.g. pcs, kg, box"
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label className="text-gray-700 font-medium">
                        Available
                    </label>
                </div>

                {/* Image */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        Product Image
                    </label>
                    <input
                        type="file"
                        name="image_path"
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg shadow text-white transition flex items-center gap-2
                        ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Save Product"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
