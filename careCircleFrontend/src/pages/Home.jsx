import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Trusted Babysitting & Caregiving <br />
            <span>For Your Little Ones</span>
          </h1>

          <p>
            CareCircle connects parents with verified, experienced, and loving
            caregivers. Your child’s safety, comfort, and happiness are our top
            priority.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/register-parent")}>
              Find a Caregiver
            </button>
            <button
              className="outline"
              onClick={() => navigate("/register-nanny")}
            >
              Become a Caregiver
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
            alt="Babysitting"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2>Why Choose CareCircle?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>👩‍⚕️ Verified Caregivers</h3>
            <p>
              All caregivers go through verification and profile screening for
              your peace of mind.
            </p>
          </div>

          <div className="feature-card">
            <h3>🕒 Flexible Timings</h3>
            <p>
              Whether it’s part-time, full-time, or emergency care — we’ve got
              you covered.
            </p>
          </div>

          <div className="feature-card">
            <h3>🏠 Safe & Reliable</h3>
            <p>
              Trusted by parents, designed for safety, and built with care.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Get Started Today</h2>
        <p>
          Join thousands of parents and caregivers who trust CareCircle every
          day.
        </p>
        <button onClick={() => navigate("/login")}>Login Now</button>
      </section>
    </div>
  );
}
