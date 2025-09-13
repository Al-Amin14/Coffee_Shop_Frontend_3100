import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const { totalAmount, cartItems } = location.state || { totalAmount: 0, cartItems: [] };

  const handleCheckout = (e) => {
    e.preventDefault();
    // ✅ Redirect to your Laravel Blade view (example2)
    window.location.href = 'http://localhost:8000/example2';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">
              Secure Hosted Payment
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
              This is a sample hosted payment form, designed to show how a simple checkout process can be integrated.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row-reverse md:gap-x-12">

            {/* Order Summary */}
            <div className="md:w-1/3 mb-8 md:mb-0">
              <h4 className="flex items-center justify-between text-xl font-bold text-gray-700 mb-4">
                Your Order
                <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                  {cartItems.length}
                </span>
              </h4>
              <ul className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <li key={item.id} className="p-4 flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h6 className="font-medium text-gray-900">{item.product?.product_name}</h6>
                        <small className="text-gray-500">
                          {item.quantity} x ${item.unit_price}
                        </small>
                      </div>
                      <span className="font-semibold text-gray-700">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-gray-500">No items in cart.</li>
                )}
                <li className="p-4 flex justify-between items-center font-bold text-gray-800 bg-white">
                  <span>Total (BDT)</span>
                  <strong>${totalAmount.toFixed(2)} TK</strong>
                </li>
              </ul>
            </div>

            {/* Billing Info (simplified, only for display) */}
            <div className="md:w-2/3">
              <h4 className="text-xl font-bold text-gray-700 mb-4">Billing Information</h4>

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    id="mobile"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    placeholder="017xxxxxxxx"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Checkout Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Continue to Checkout
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
