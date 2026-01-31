import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  // Scroll state for extra glass effect on scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUserRole(localStorage.getItem("role"));
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("adminProfileCreated");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ease-in-out px-4 md:px-6 py-4
      ${scrolled ? "py-2" : "py-4"}`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-[24px] flex justify-between items-center transition-all duration-500 px-6 py-3
        ${scrolled ? "glass-panel shadow-md bg-white/80" : "bg-transparent"}`}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="CareCircle"
            className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
            CareCircle
          </span>
        </div>

        {/* Desktop Nav */}

        <div className="flex gap-2 items-center ml-auto">
          {!isLoggedIn ? (
            <>
              {/* Log in Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("login")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="px-5 py-2 text-[15px] font-medium text-[#1D1D1F]/80 hover:text-black transition-colors"
                >
                  Log in
                </button>

                <div
                  className={`absolute top-full right-0 pt-2 w-[220px] transition-all duration-300 origin-top-right
                  ${activeDropdown === "login" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                >
                  <div className="glass-panel p-2 rounded-2xl shadow-xl">
                    <button
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F7] text-sm font-medium transition-colors"
                      onClick={() => { navigate("/login", { state: { role: "ROLE_PARENT" } }); setActiveDropdown(null); }}
                    >
                      Parent Portal
                    </button>
                    <button
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F7] text-sm font-medium transition-colors"
                      onClick={() => { navigate("/login", { state: { role: "ROLE_CARETAKER" } }); setActiveDropdown(null); }}
                    >
                      Caregiver Hub
                    </button>
                    <div className="h-px bg-[#d2d2d7]/30 my-1 mx-2"></div>
                    <button
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F7] text-sm font-medium text-amber-600 transition-colors"
                      onClick={() => { navigate("/admin-login"); setActiveDropdown(null); }}
                    >
                      Administrator
                    </button>
                  </div>
                </div>
              </div>

              {/* Get Started Button */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("signup")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => toggleDropdown("signup")}
                  className="btn-primary py-2 px-6 text-[15px] shadow-none hover:shadow-lg"
                >
                  Get Started
                </button>

                <div
                  className={`absolute top-full right-0 pt-2 w-[260px] transition-all duration-300 origin-top-right
                  ${activeDropdown === "signup" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
                >
                  <div className="glass-panel p-2 rounded-2xl shadow-xl">
                    <button
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F7] group transition-colors"
                      onClick={() => { navigate("/register-parent"); setActiveDropdown(null); }}
                    >
                      <div className="font-semibold text-[#1D1D1F]">I'm a Parent</div>
                      <div className="text-xs text-[#86868b]">Find trusted care for your family</div>
                    </button>
                    <button
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F7] group transition-colors mt-1"
                      onClick={() => { navigate("/register-nanny"); setActiveDropdown(null); }}
                    >
                      <div className="font-semibold text-[#1D1D1F]">I'm a Nanny</div>
                      <div className="text-xs text-[#86868b]">Find jobs and build your profile</div>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {userEmail && (
                  <span className="hidden md:inline-block text-xs font-medium text-[#86868b] px-3 py-1 bg-[#F5F5F7] rounded-full">
                    {userEmail}
                  </span>
                )}
                <button
                  onClick={() => {
                    if (userRole === "ROLE_PARENT") navigate("/parent-dashboard");
                    else if (userRole === "ROLE_CARETAKER") navigate("/nanny-profile");
                    else if (userRole === "ROLE_ADMIN") navigate("/admin-dashboard");
                  }}
                  className="text-sm font-medium text-[#1D1D1F] hover:text-[#0071e3] transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#F5F5F7] text-red-500 text-sm font-medium rounded-full hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

