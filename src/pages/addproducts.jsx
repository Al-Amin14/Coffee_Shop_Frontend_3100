import React, { useEffect, useState } from "react";
import AuthUser from "../components/AuthUser";
import { useNavigate } from "react-router-dom";

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
};

export default function ProductForm() {
  const { http } = AuthUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [toast, setToast] = useState(null);

  // input change handler
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      if (formData.image_path) {
        const imgData = new FormData();
        imgData.append("file", formData.image_path);
        imgData.append("upload_preset", "insta_clone");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/clouding1/image/upload",
          { method: "POST", body: imgData }
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Image upload failed");
        imageUrl = data.url;
      }

      const payload = { ...formData, image_path: imageUrl };
      const apiRes = await http.post("/addproduct", payload);

      if (apiRes.data?.success) {
        showToast("Product created successfully!");
        setFormData(initialFormData);
      } else {
        showToast("Failed to create product.", "error");
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add / Update Product
      </h2>

      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white font-semibold ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
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
        <Input
          label="Product Name"
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Price */}
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {/* Discount */}
        <Input
          label="Discount (%)"
          name="discount"
          type="number"
          step="0.01"
          value={formData.discount}
          onChange={handleChange}
        />

        {/* Stock Quantity */}
        <Input
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
        />

        {/* Unit */}
        <Input
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="e.g. pcs, kg, box"
        />

        {/* Availability */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded"
          />
          <label className="text-gray-700 font-medium">Available</label>
        </div>

        {/* Image */}
        <Input
          label="Product Image"
          name="image_path"
          type="file"
          onChange={handleChange}
        />

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}

// small reusable components
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <textarea
      {...props}
      className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
