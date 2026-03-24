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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Name validation (only letters & spaces)
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
    }
  };

  // Contact number validation (only digits, max 11)
  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setContactNumber(value);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required fields
    if (!name || !email || !contactNumber || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Contact number must be exactly 11 digits
    if (contactNumber.length !== 11) {
      setError("Contact number must be exactly 11 digits.");
      return;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number."
      );
      return;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const requestData = {
      name,
      email,
      contact_number: contactNumber,
      password,
      role,
    };

    try {
      const response = await http.post("/register", requestData);
      console.log("Registration successful:", response.data);

      setSuccess("Registration Successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
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
    } finally {
      setLoading(false);
    }
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

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">
            {success}
          </p>
        )}

        <form onSubmit={submitForm} className="space-y-4">

          {/* Name */}
          <div>
            <label className="font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter name"
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
            <small className="text-gray-400 text-xs">
              Only letters allowed
            </small>
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="font-medium">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={handleContactNumberChange}
              maxLength={11}
              placeholder="11 digit number"
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div>
            <label className="font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg font-bold ${loading
              ? "bg-gray-400"
              : "bg-[#d87c28] hover:bg-[#b96220]"
              }`}
          >
            {loading ? "Signing Up..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-[#d87c28] cursor-pointer font-bold"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}