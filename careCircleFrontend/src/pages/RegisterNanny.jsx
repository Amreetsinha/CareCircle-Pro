import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { register } from "../api/authApi";
import logo from "../assets/logo.png";

export default function RegisterNanny() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await register(email, password, "ROLE_CARETAKER");
      setSuccessMessage("OTP Sent to email! Redirecting to verification...");
      setTimeout(() => navigate("/verify-account", { state: { email, role: "ROLE_CARETAKER" } }), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.message.toLowerCase();
      if (/exist|already|taken|conflict/i.test(msg)) {
        setError("Email already exists. Please login.");
        setTimeout(() => navigate("/login", { state: { role: "ROLE_CARETAKER" } }), 2000);
      } else {
        setError(error.message || "Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-[#f5f5f7] px-6">

      {/* Header */}
      <div className="mb-8 text-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h1 className="text-[28px] font-semibold text-[#1d1d1f]">Become a Caregiver</h1>
        <p className="text-[#86868b] mt-2 text-[17px]">Join our network of trusted professionals.</p>
      </div>

      <div className="w-full max-w-[440px]">

        {error && (
          <div className="mb-6 bg-[#fff2f2] p-3 rounded-xl border border-[#ff3b30]/20 text-[#ff3b30] text-sm font-medium text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-[#f2fff4] p-3 rounded-xl border border-[#34c759]/20 text-[#34c759] text-sm font-medium text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">

          <div className="bg-white rounded-xl border border-[#d2d2d7] overflow-hidden shadow-sm">
            <div className="border-b border-[#d2d2d7]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-[17px] outline-none placeholder-[#86868b] bg-white h-[56px]"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                showStrengthMeter={true}
                className="border-none focus-within:ring-0"
              />
            </div>
          </div>

          <p className="text-xs text-[#86868b] text-center leading-relaxed">
            By selecting Continue, I agree to CareCircle's Terms of Service and Privacy Policy.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-apple-primary w-full py-3 text-[17px]"
          >
            {loading ? "Creating Profile..." : "Agree and Continue"}
          </button>

        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/login", { state: { role: "ROLE_CARETAKER" } })} className="text-[#0071e3] hover:underline text-sm">
            Already have an account? Sign In used
          </button>
        </div>
      </div>
    </div>
  );
}
