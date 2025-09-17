import React from "react";
import { CheckCircle2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex mx-auto w-[60%] items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Payment Successful 🎉
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase! Your order has been confirmed and will be
                    processed shortly.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        <Home className="h-5 w-5" />
                        Back to Home
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        className="w-full border border-green-400 text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-green-50 transition-all duration-200"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
