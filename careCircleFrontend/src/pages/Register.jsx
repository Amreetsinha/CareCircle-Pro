import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidPassword } from "../utils/passwordValidation";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "parent",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: ""
  });

  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "parent", label: "👨‍👩‍👧 Parent", description: "Looking for childcare services" },
    { value: "nanny", label: "👩‍⚕️ Nanny/Caregiver", description: "Offering childcare services" }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 Password validation
    if (!isValidPassword(form.password)) {
      alert(
        "Password must be at least 8 characters long, include 2 numbers and 1 special character."
      );
      return;
    }

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: form.role,
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          city: form.city
        })
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Registration failed");
      }

      const result = await response.json();
      console.log("Registration success:", result);

      // ✅ Redirect based on role
      if (form.role === "parent") {
        navigate("/parent-dashboard");
      } else {
        navigate("/nanny-dashboard");
      }

    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === form.role);

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join our community and get started</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div className="role-selector">
            <label htmlFor="role">Who are you?</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="role-dropdown"
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {selectedRole && (
              <p className="role-description">{selectedRole.description}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              required
              onChange={handleChange}
              className="input-field"
            />
            <p className="password-hint">
              🔐 Minimum 8 characters, 2 numbers & 1 special character
            </p>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              placeholder="Enter your city"
              value={form.city}
              required
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="register-btn">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="divider">already have an account?</div>

        <p className="login-prompt">
          <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
