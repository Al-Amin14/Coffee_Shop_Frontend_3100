import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* 🌟 Reusable Input Field */
const InputField = ({ label, type = "text", placeholder, required }) => (
  <div>
    <label className="block text-[#4b2e2e] mb-1 font-medium">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-[#d1c4b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] transition"
    />
  </div>
);

/* 🌟 Reusable Text Area */
const TextArea = ({ label, placeholder, rows = 4, required }) => (
  <div>
    <label className="block text-[#4b2e2e] mb-1 font-medium">{label}</label>
    <textarea
      rows={rows}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-[#d1c4b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] transition"
    />
  </div>
);

const ContactUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-4 text-[#4b2e2e]">
          ☕ Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Have questions about our coffee or services? Send us a message!
        </p>

        {/* Form */}
        <form className="space-y-6">
          <InputField label="Your Name" placeholder="Enter your name" required />
          <InputField
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
          />
          <TextArea
            label="Message"
            placeholder="Write your message..."
            required
          />

          <button
            type="submit"
            className="w-full bg-[#6f4e37] hover:bg-[#5a3f2d] text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] focus:ring-2 focus:ring-[#6f4e37]"
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          📍 Visit us at: <span className="font-medium">Coffee Street, Dhaka, Bangladesh</span>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
