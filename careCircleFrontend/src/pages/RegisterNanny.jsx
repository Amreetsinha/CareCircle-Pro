import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterNanny.css";

export default function RegisterNanny() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          role: "ROLE_CARETAKER",
        }),
      });

      const data = await response.json().catch(() => null);

      // ✅ EMAIL EXISTS HANDLING (REAL FIX)
      if (!response.ok) {
        if (data?.message?.toLowerCase().includes("exist")) {
          setSuccessMessage("Email already exists. Please login.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        setSuccessMessage("Registration failed. Please try again.");
        return;
      }

      // ✅ SUCCESS
      setSuccessMessage("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setSuccessMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-nanny-container">
      <div className="register-nanny-card">
        <h2>Register as Caregiver</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
