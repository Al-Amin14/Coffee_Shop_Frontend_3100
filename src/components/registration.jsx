import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

export default function Register() {
  const navigate = useNavigate();
  const { http } = AuthUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Manager");
  const [error, setError] = useState("");

  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setContactNumber(value);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!name || !email || !contactNumber || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (contactNumber.length !== 11) {
      setError("Contact number must be exactly 11 digits.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    const requestData = {
      name,
      email,
      contact_number: contactNumber,
      password,
      role,
    };

    console.log("Sending data:", requestData);

    http
      .post("/register", requestData)
      .then((response) => {
        console.log("Registration successful:", response.data);
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        if (err.response?.data?.errors) {
          const validationErrors = err.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError(
            err.response?.data?.message ||
            "Something went wrong. Please try again."
          );
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f0] p-4 w-full mx-auto">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#5a2d0c] text-center mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          It only takes a minute.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={submitForm} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            />
          </div>

          {/* Contact Number */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Contact Number
            </label>
            <input
              type="text"
              placeholder="Enter 11-digit contact number"
              value={contactNumber}
              onChange={handleContactNumberChange}
              maxLength={11}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            />
            {contactNumber.length > 0 && contactNumber.length !== 11 && (
              <small className="text-red-500 text-xs mt-1">
                Contact number must be exactly 11 digits ({contactNumber.length}/11)
              </small>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87c28]"
            >
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#d87c28] text-white font-bold rounded-lg hover:bg-[#b96220] transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-[#d87c28] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
