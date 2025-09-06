import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ContactUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e9dd] via-[#e6d5c3] to-[#d2b48c] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl w-full max-w-3xl p-10"
      >
        <h1 className="text-4xl font-extrabold text-center mb-4 text-[#4b2e2e]">
          ☕ Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Have questions about our coffee or services? Send us a message — we’d love to hear from you!
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-[#4b2e2e] mb-1 font-medium">Your Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#6f4e37] border-[#d1c4b2] bg-white">
              <User className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#4b2e2e] mb-1 font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#6f4e37] border-[#d1c4b2] bg-white">
              <Mail className="text-gray-500 mr-2" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#4b2e2e] mb-1 font-medium">Message</label>
            <div className="flex items-start border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#6f4e37] border-[#d1c4b2] bg-white">
              <MessageSquare className="text-gray-500 mr-2 mt-1" size={20} />
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full focus:outline-none bg-transparent resize-none"
                required
              ></textarea>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-[#6f4e37] to-[#5a3f2d] hover:opacity-90 text-white py-3 rounded-lg font-semibold shadow-lg transition"
          >
            🚀 Send Message
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-8">
          📍 Visit us at: <span className="font-medium text-[#4b2e2e]">Coffee Street, Dhaka, Bangladesh</span>
        </p>
      </motion.div>
    </div>
  );
};

export default ContactUs;
