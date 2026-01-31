import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import { register } from "../api/authApi";
import logo from "../assets/logo.png";

export default function RegisterParent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    try {
      await register(email, password, "ROLE_PARENT");
      setSuccessMessage("Account created successfully!");
      setTimeout(() => navigate("/verify-account", { state: { email, role: "ROLE_PARENT" } }), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.message ? error.message.toLowerCase() : "unknown error";
      if (/exist|already|taken|conflict/i.test(msg)) {
        setError("This email is already linked to an Apple ID style account.");
        setTimeout(() => navigate("/login", { state: { role: "ROLE_PARENT" } }), 2000);
      } else {
        setError(error.message || "Could not create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-[#f5f5f7] px-6">

      <div className="mb-8 text-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h1 className="text-[28px] font-semibold text-[#1d1d1f]">Create your CareCircle ID</h1>
        <p className="text-[#86868b] mt-2 text-[17px]">One account for all your family care needs.</p>
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
                className="w-full p-4 text-[17px] outline-none placeholder-[#86868b]"
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

          <div className="flex gap-3 items-start">
            <input type="checkbox" id="news" className="mt-1" />
            <label htmlFor="news" className="text-sm text-[#1d1d1f] leading-snug">
              Announcements
              <span className="block text-[#86868b] text-xs">Receive emails about CareCircle products, news, and events.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-apple-primary w-full py-3 text-[17px]"
          >
            {loading ? "Creating..." : "Continue"}
          </button>

        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/login")} className="text-[#0071e3] hover:underline text-sm">
            Already have an account? Sign In used
          </button>
        </div>
      </div>
    </div>
  );
}
