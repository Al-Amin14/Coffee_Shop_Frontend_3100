import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import { useNavigate } from "react-router-dom";

// ✅ Initial Form State
const initialFormData = {
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
};

export default function ProductForm() {
  const { http } = AuthUser();
  const [formData, setFormData] = useState(initialFormData);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // ✅ Unified Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // ✅ Toast Function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (formData.image_path) {
        const imageData = new FormData();
        imageData.append("file", formData.image_path);
        imageData.append("upload_preset", "insta_clone");
        imageData.append("cloud_name", "clouding1");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/clouding1/image/upload",
          { method: "POST", body: imageData }
        );

        if (!res.ok) throw new Error("Image upload failed");
        const cloudData = await res.json();
        imageUrl = cloudData.url;
      }

      const payload = { ...formData, image_path: imageUrl };
      const response = await http.post("/addproduct", payload);

      if (response.data.success) {
        showToast("✅ Product created successfully!", "success");
        setFormData(initialFormData);
      } else {
        showToast("❌ Failed to create product.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message, "error");
    }
  };

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  // ✅ Config-Driven Fields
  const fields = [
    { label: "Product Name", name: "product_name", required: true },
    { label: "Category", name: "category", required: true },
    {
      label: "Price ($)",
      name: "price",
      type: "number",
      step: "0.01",
      placeholder: "0.00",
      required: true,
    },
    {
      label: "Discount (%)",
      name: "discount",
      type: "number",
      step: "0.01",
      placeholder: "0.00",
    },
    {
      label: "Stock Quantity",
      name: "stock_quantity",
      type: "number",
      placeholder: "0",
      required: true,
    },
    { label: "Unit", name: "unit", placeholder: "e.g. pcs, kg, box" },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-white via-slate-100 to-gray-200 shadow-2xl rounded-3xl relative">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
        🛒 Add / Update Product
      </h2>

      {/* ✅ Toast */}
      {toast && <Toast {...toast} />}

      {/* ✅ Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {fields.map((field, idx) => (
          <InputField
            key={idx}
            {...field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}

        {/* Description */}
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Availability */}
        <Checkbox
          label="Available"
          name="is_available"
          checked={formData.is_available}
          onChange={handleChange}
        />

        {/* Image Upload */}
        <FileInput
          label="Product Image"
          name="image_path"
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold tracking-wide transition-transform duration-300 hover:scale-105"
          >
            💾 Save Product
          </button>
        </div>
      </form>
    </div>
  );
}

// 🧩 Reusable Components
function InputField({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-800 font-semibold mb-2">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-gray-800 font-semibold mb-2">{label}</label>
      <textarea
        {...props}
        placeholder="Enter product description"
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
      ></textarea>
    </div>
  );
}

function Checkbox({ label, ...props }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <input
        type="checkbox"
        {...props}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="text-gray-800 font-medium">{label}</label>
    </div>
  );
}

function FileInput({ label, ...props }) {
  return (
    <div className="md:col-span-2 mt-3">
      <label className="block text-gray-800 font-semibold mb-2">{label}</label>
      <input
        type="file"
        {...props}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Toast({ message, type }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transform transition-all duration-300
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}
