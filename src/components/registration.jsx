import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import "./Register.css";

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
      role
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
        console.error("Error response:", err.response?.data);
        
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
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Create Your Account</h1>
        <p className="register-subtitle">It only takes a minute.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={submitForm}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              placeholder="Enter 11-digit contact number"
              value={contactNumber}
              onChange={handleContactNumberChange}
              maxLength="11"
            />
            {contactNumber.length > 0 && contactNumber.length !== 11 && (
              <small className="validation-hint">
                Contact number must be exactly 11 digits ({contactNumber.length}/11)
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Your Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}