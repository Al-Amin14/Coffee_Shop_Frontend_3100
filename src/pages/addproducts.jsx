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
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    // 🔴 Validation
    const validateField = (name, value) => {
        let error = "";

        if (name !== "is_available" && !value) {
            error = "This field is required";
        }

        if (["product_name", "description", "category", "unit"].includes(name)) {
            if (/\d/.test(value)) error = "No numbers allowed";
        }

        if (["price", "stock_quantity", "discount"].includes(name)) {
            if (value && isNaN(value)) error = "Only numbers allowed";
        }

        if (name === "price" && value) {
            if (parseFloat(value) <= 65) {
                error = "Price must be greater than 65";
            }
        }

        if (name === "image_path" && value) {
            if (!value.type.startsWith("image/")) {
                error = "Only image files allowed";
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        const newValue =
            type === "checkbox"
                ? checked
                : type === "file"
                    ? files[0]
                    : value;

        setFormData({ ...formData, [name]: newValue });

        const error = validateField(name, newValue);
        setErrors({ ...errors, [name]: error });

        // Image preview
        if (name === "image_path" && files[0]) {
            setPreview(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const imageData = new FormData();
            imageData.append("file", formData.image_path);
            imageData.append("upload_preset", "insta_clone");

            const resImg = await fetch(
                "https://api.cloudinary.com/v1_1/clouding1/image/upload",
                { method: "POST", body: imageData }
            );

            const imgData = await resImg.json();

            const res = await http.post("/addproduct", {
                ...formData,
                image_path: imgData.url,
            });

            if (res.data.success) {
                alert("✅ Product Added Successfully!");
            }
        } catch (err) {
            alert("❌ Error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    // 🎨 Dynamic style
    const inputStyle = (name) =>
        `w-full p-3 rounded-xl border transition-all duration-200 focus:outline-none 
        ${errors[name]
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : formData[name]
                ? "border-green-500 focus:ring-2 focus:ring-green-300"
                : "border-gray-300 focus:ring-2 focus:ring-blue-300"
        }`;

    return (
        <div className="min-h-screen bg-gradient-to-br mx-auto from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    🛍️ Add New Product
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {/* Product Name */}
                    <div>
                        <input
                            name="product_name"
                            placeholder="Product Name"
                            value={formData.product_name}
                            onChange={handleChange}
                            className={inputStyle("product_name")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.product_name}
                        </p>
                    </div>

                    {/* Category */}
                    <div>
                        <input
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputStyle("category")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.category}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            className={inputStyle("description")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </p>
                    </div>

                    {/* Price */}
                    <div>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price ($)"
                            value={formData.price}
                            onChange={handleChange}
                            className={inputStyle("price")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.price}
                        </p>
                    </div>

                    {/* Discount */}
                    <div>
                        <input
                            type="number"
                            name="discount"
                            placeholder="Discount (%)"
                            value={formData.discount}
                            onChange={handleChange}
                            className={inputStyle("discount")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.discount}
                        </p>
                    </div>

                    {/* Stock */}
                    <div>
                        <input
                            type="number"
                            name="stock_quantity"
                            placeholder="Stock Quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className={inputStyle("stock_quantity")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.stock_quantity}
                        </p>
                    </div>

                    {/* Unit */}
                    <div>
                        <input
                            name="unit"
                            placeholder="Unit (kg, pcs...)"
                            value={formData.unit}
                            onChange={handleChange}
                            className={inputStyle("unit")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.unit}
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium text-gray-600">
                            Upload Product Image
                        </label>
                        <input
                            type="file"
                            name="image_path"
                            onChange={handleChange}
                            className={inputStyle("image_path")}
                        />
                        <p className="text-red-500 text-sm mt-1">
                            {errors.image_path}
                        </p>

                        {/* Preview */}
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="mt-3 w-32 h-32 object-cover rounded-xl shadow"
                            />
                        )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-3 md:col-span-2">
                        <input
                            type="checkbox"
                            name="is_available"
                            checked={formData.is_available}
                            onChange={handleChange}
                            className="w-5 h-5"
                        />
                        <label className="text-gray-700 font-medium">
                            Available
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex justify-center items-center"
                    >
                        {loading ? "Saving..." : "✨ Save Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}