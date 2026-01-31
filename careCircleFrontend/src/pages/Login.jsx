import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PasswordInput from "../components/PasswordInput";
import { login } from "../api/authApi";
import { getParentProfile } from "../api/parentApi";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(location.state?.role || "ROLE_PARENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password, role);
      const token = data.accessToken;

      if (!token) throw new Error("Token not received.");

      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      const tokenRole = decoded.role || role;
      localStorage.setItem("role", tokenRole);
      localStorage.setItem("userEmail", decoded.sub || email);

      if (tokenRole === "ROLE_PARENT") {
        try {
          const profile = await getParentProfile();
          navigate(profile && profile.fullName ? "/parent-dashboard" : "/parent-profile");
        } catch {
          navigate("/parent-profile");
        }
      } else if (tokenRole === "ROLE_CARETAKER" || tokenRole === "ROLE_CAREGIVER") {
        navigate("/nanny-profile");
      } else if (tokenRole === "ROLE_ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.message.toLowerCase();
      setError(
        msg.includes("invalid") || msg.includes("credentials") || msg.includes("auth")
          ? "Invalid email or password."
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in">
        <div className="glass-panel p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/5">
          <div className="text-center mb-8">
            <img src={logo} alt="CareCircle Logo" className="w-20 h-20 mx-auto mb-6 drop-shadow-md rounded-2xl" />
            <h2 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">Welcome back</h2>
            <p className="text-[#86868b] text-sm mt-2">Sign in to your account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-[#F5F5F7] rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setRole("ROLE_PARENT")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${role === "ROLE_PARENT" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868b] hover:text-[#1D1D1F]"
                }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => setRole("ROLE_CARETAKER")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${role === "ROLE_CARETAKER" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868b] hover:text-[#1D1D1F]"
                }`}
            >
              Caregiver
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="input-group-dynamic">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dynamic peer"
                required
              />
              <label htmlFor="email" className="label-dynamic">
                Email Address
              </label>
            </div>

            <PasswordInput
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showStrengthMeter={false}
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-semibold text-[#86868b] hover:text-[#0071e3] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl text-center border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#86868b] text-sm">
              New to CareCircle?{" "}
              <button
                onClick={() => navigate(role === "ROLE_PARENT" ? "/register-parent" : "/register-nanny")}
                className="text-[#0071e3] font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

