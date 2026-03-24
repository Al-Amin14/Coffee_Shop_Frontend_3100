import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Printer, Loader2, Home, AlertCircle } from "lucide-react";
import axios from "axios";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchReceipt = async () => {
      // 1. Check for Session ID
      if (!sessionId) {
        console.error("No Session ID found in URL");
        setLoading(false);
        return;
      }

      try {
        // 2. Safe Token Retrieval
        const rawToken = localStorage.getItem("token");
        let cleanToken = "";
        if (rawToken) {
          try {
            cleanToken = rawToken.startsWith('"') ? JSON.parse(rawToken) : rawToken;
          } catch (e) {
            cleanToken = rawToken;
          }
        }

        // 3. API Call
        const res = await axios.get(`http://localhost:8000/api/checkout-success/${sessionId}`, {
          headers: { Authorization: `Bearer ${cleanToken}` }
        });

        if (res.data.success) {
          setOrder(res.data.order);
          setTimeout(() => setIsVisible(true), 500);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Could not verify payment. Please check your internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [sessionId]);

  // If loading, show a simple spinner (prevents white screen)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-amber-800">
        <Loader2 className="animate-spin mb-2" size={40} />
        <p className="font-bold">Verifying Order...</p>
      </div>
    );
  }

  // If no session ID or error, show a clear message
  if (!sessionId || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-800">{error || "No Order Found"}</h2>
        <Link to="/" className="mt-6 bg-amber-600 text-white px-8 py-2 rounded-lg font-bold">Back to Store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 flex flex-col items-center p-8">
      <div className="text-center mb-10">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />
        <h1 className="text-4xl font-black text-gray-800">PAID!</h1>
      </div>

      {/* The Receipt Slip */}
      <div className={`w-full max-w-sm bg-white shadow-2xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="p-8 border-t-8 border-amber-600">
          <div className="text-center border-b-2 border-dashed border-gray-200 pb-4 mb-4 font-mono">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800">Coffee Receipt</h2>
            <p className="text-[10px] text-gray-400">Order ID: {order?.order_number}</p>
          </div>

          <div className="space-y-3 mb-6 font-mono text-sm">
            {order?.items?.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="uppercase">{item.product_name} x{item.quantity}</span>
                <span>৳{(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between font-black text-2xl font-mono">
            <span>TOTAL</span>
            <span>৳{Number(order?.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Zig-Zag Edge */}
        <div className="h-4 bg-white" style={{ clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)" }}></div>
      </div>

      <div className="mt-12 flex item-center justify-center gap-4 no-print w-full">
        <button onClick={() => window.print()} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-black transition-colors">
          <Printer size={18} className="mr-2" /> Print Slip
        </button>
        <Link to="/" className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-amber-700 transition-colors">
          <Home size={18} className="mr-2" /> Finish
        </Link>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;