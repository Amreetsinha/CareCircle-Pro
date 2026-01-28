import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        CareCircle
      </div>

      <div className="navbar-links">
        {/* Log in Dropdown */}
        <div className="dropdown">
          <button className="nav-btn dropdown-trigger">
            Log in ▾
          </button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => navigate("/login", { state: { role: "ROLE_PARENT" } })}
            >
              👨‍👩‍👧 Parent Login
            </button>
            <button
              className="dropdown-item"
              onClick={() => navigate("/login", { state: { role: "ROLE_CARETAKER" } })}
            >
              👩‍⚕️ Caregiver Login
            </button>
            <button
              className="dropdown-item"
              onClick={() => navigate("/admin-login")}
            >
              🛡️ Admin Login
            </button>
          </div>
        </div>

        {/* Sign up Dropdown */}
        <div className="dropdown">
          <button className="nav-btn primary-btn dropdown-trigger">
            Sign up
          </button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => navigate("/register-parent")}
            >
              👩‍ Parent
            </button>
            <button
              className="dropdown-item"
              onClick={() => navigate("/register-nanny")}
            >
              👶 Caregiver
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
