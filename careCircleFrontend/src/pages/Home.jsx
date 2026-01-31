import { useNavigate } from "react-router-dom";
import heroImage from "../assets/happy_nanny_hero.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans selection:bg-[#007AFF] selection:text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#d2d2d7] shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#1D1D1F] tracking-wide uppercase">Verified Pros Available Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-[#1D1D1F] mb-8 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Care. <br className="md:hidden" />
              <span className="text-[#86868b]">Reimagined.</span>
            </h1>

            <p className="max-w-xl text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              The modern way to find trusted childcare professionals. background-checked, interviewed, and ready to help.
            </p>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => navigate("/register-parent")}
                className="btn-primary"
              >
                Find a Nanny
              </button>
              <button
                onClick={() => navigate("/register-nanny")}
                className="btn-secondary"
              >
                Join as a Professional
              </button>
            </div>
          </div>

          <div className="mt-20 relative animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/10 border border-white/50">
              <img
                src={heroImage}
                alt="Happy Nanny"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-[2s] ease-out block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

              <div className="absolute bottom-8 left-8 right-8 md:w-auto md:right-auto">
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#34C759] rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D1D1F] text-lg">100% Verified</p>
                    <p className="text-sm text-[#86868b]">Every pro passes a 7-point check</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70 animate-float"></div>
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70 animate-float" style={{ animationDelay: '-3s' }}></div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1D1D1F] mb-6">Why families trust CareCircle.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Safety First", desc: "Rigorous background checks standard.", icon: "🛡️" },
              { title: "Instant Booking", desc: "Find help in minutes, not days.", icon: "⚡" },
              { title: "Top Rated", desc: "Only 5-star caregivers make the cut.", icon: "⭐️" },
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2rem] bg-[#F5F5F7] hover:bg-white transition-all duration-300 border border-transparent hover:border-[#d2d2d7] hover:shadow-xl">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-3">{feature.title}</h3>
                <p className="text-[#86868b] leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#1D1D1F] text-white px-8 py-20 text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight">Ready to get started?</h2>
              <p className="text-xl text-[#86868b] mb-10 max-w-2xl mx-auto">Join thousands of parents and caregivers building a better community, together.</p>
              <button
                onClick={() => navigate("/register-parent")}
                className="btn-primary bg-white text-black hover:bg-gray-100 hover:text-black border-none"
              >
                Create Free Account
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

