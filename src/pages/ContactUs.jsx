import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const ContactUs = () => {
    const navigate=useNavigate()
    useEffect(() => {
    if(!localStorage.getItem('user')){
      navigate('/login')
    }
  }, []);
    return (
        <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-6 mx-auto">
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-[#4b2e2e]">
                    ☕ Contact Us
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Have questions about our coffee or services? Send us a message!
                </p>

                <form className="space-y-6">
                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Your Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] border-[#d1c4b2]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] border-[#d1c4b2]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Message</label>
                        <textarea
                            rows="4"
                            placeholder="Write your message..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] border-[#d1c4b2]"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#6f4e37] hover:bg-[#5a3f2d] text-white py-2 rounded-lg transition"
                    >
                        Send Message
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    📍 Visit us at: Coffee Street, Dhaka, Bangladesh
                </p>
            </div>
        </div>
    );
};

export default ContactUs;
