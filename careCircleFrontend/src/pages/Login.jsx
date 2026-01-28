import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login } from "../api/authApi";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Initialize role from navigation state if available, else default
  const [role, setRole] = useState(location.state?.role || "ROLE_PARENT");
  const [loading, setLoading] = useState(false);

  // Update role if user navigates via dropdown while already on the page
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const roles = [
    { value: "ROLE_PARENT", label: "👨‍👩‍👧 Parent", description: "I'm looking for caregivers" },
    { value: "ROLE_CARETAKER", label: "👩‍⚕️ Caregiver", description: "I provide childcare services" },
    { value: "ROLE_ADMIN", label: "🛡️ Admin", description: "System administrator" }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password, role);
      const token = data.accessToken;

      if (!token) {
        alert("Token not received. Contact admin.");
        return;
      }

      // ✅ Decode JWT to verify (optional, mostly for debugging or extra checks)
      const decoded = jwtDecode(token);

      // ✅ Save in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      // Note: Backend might allow role mismatch in token vs requested, but usually they match.
      // We store the requested role or the one from token. Token is safer.
      const tokenRole = decoded.role || role;
      localStorage.setItem("role", tokenRole);
      localStorage.setItem("userEmail", decoded.sub || email);

      // ✅ Redirect based on role
      if (tokenRole === "ROLE_PARENT") {
        // Redirect to profile page first, then profile page will redirect to dashboard after completion
        navigate("/parent-profile");
      }
      else if (tokenRole === "ROLE_CARETAKER" || tokenRole === "ROLE_CAREGIVER") {
        navigate("/nanny-profile");
      }
      else if (tokenRole === "ROLE_ADMIN") {
        navigate("/admin-dashboard");
      }
      else {
        alert("Unknown role: " + tokenRole);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Select your role to continue</p>

        <form onSubmit={handleLogin}>
          <div className="role-selector">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </p>
        </form>

        <div className="divider">or</div>

        <p className="signup-prompt">
          Don't have an account? <a href="/register">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
