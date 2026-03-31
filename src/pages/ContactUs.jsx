import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ContactUs = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token) {
            navigate("/login");
        }

        // ✅ Set name & email from localStorage
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/contact-us",
                {
                    name,
                    email,
                    message,
                    user_id: JSON.parse(token)?.user_id || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Message sent successfully!");
                setMessage(""); // ✅ only message resets
            } else {
                toast.error("Failed to send message");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-6 mx-auto">
            <Toaster />
            <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-[#4b2e2e]">
                    ☕ Contact Us
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Have questions about our coffee or services? Send us a message!
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed border-[#d1c4b2]"
                        />
                    </div>

                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed border-[#d1c4b2]"
                        />
                    </div>

                    <div>
                        <label className="block text-[#4b2e2e] mb-1">Message</label>
                        <textarea
                            rows="4"
                            placeholder="Write your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6f4e37] border-[#d1c4b2]"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6f4e37] hover:bg-[#5a3f2d] text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Message"}
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