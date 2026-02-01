import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCaregiverProfile, getCapabilities, getCertifications } from "../api/caregiverApi";

export default function CaregiverDashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
    const [profile, setProfile] = useState(null);
    const [capsCount, setCapsCount] = useState(0);
    const [certsCount, setCertsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const p = await getCaregiverProfile();
                setProfile(p);

                const caps = await getCapabilities();
                setCapsCount(caps.length);

                const certs = await getCertifications();
                setCertsCount(certs.length);
            } catch (err) {
                console.error("Dashboard check error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userEmail");
        alert("Logged out successfully!");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071e3]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[100px] pb-12 px-6 font-sans">

            {/* Header Section */}
            <div className="max-w-[1200px] mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
                <div>
                    <h1 className="text-[34px] font-bold tracking-tight text-[#1d1d1f]">
                        Welcome, {profile?.fullName?.split(" ")[0] || "Caregiver"}
                    </h1>
                    <p className="text-[#86868b] text-[19px] mt-1">Manage your caregiver profile and services.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors self-start md:self-auto"
                >
                    Logout
                </button>
            </div>

            {/* Grid Section */}
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                {/* Status Card */}
                <div className="card-apple p-8 flex flex-col justify-between min-h-[220px]">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${profile?.verificationStatus === 'VERIFIED' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Verification Status</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#1d1d1f]">{profile?.verificationStatus || "PENDING"}</h3>
                    </div>
                    <p className="text-sm text-[#86868b]">
                        {profile?.verificationStatus === 'VERIFIED'
                            ? "Your profile is visible to parents."
                            : "Complete your profile to get verified."}
                    </p>
                </div>

                {/* Profile Stats Card */}
                <div className="card-apple p-8 flex flex-col justify-between min-h-[220px]">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Experience</span>
                        <h3 className="text-2xl font-bold text-[#1d1d1f]">{profile?.experienceYears || 0} Years</h3>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <div className="text-center">
                            <p className="text-xs text-[#86868b]">Caps</p>
                            <p className="font-bold">{capsCount}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-[#86868b]">Certs</p>
                            <p className="font-bold">{certsCount}</p>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Quick Link */}
                <div
                    onClick={() => navigate("/nanny-profile")}
                    className="card-apple p-8 flex flex-col justify-between min-h-[220px] bg-[#0071e3]/5 border-[#0071e3]/10 cursor-pointer group hover:border-[#0071e3]/30 transition-all shadow-indigo-100/50"
                >
                    <div className="bg-[#0071e3] text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#1d1d1f]">Personal Profile</h3>
                        <p className="text-[#86868b] text-sm mt-1">Update your bio, contact info, and location.</p>
                    </div>
                </div>

            </div>

            {/* Secondary Actions */}
            <div className="max-w-[1200px] mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div
                    onClick={() => navigate("/nanny-profile")}
                    className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl uppercase font-bold text-xs">CAPS</div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f]">Manage Capabilities</h4>
                            <p className="text-xs text-[#86868b]">Add your skills and specialties</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#86868b]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </div>

                <div
                    onClick={() => navigate("/nanny-profile")}
                    className="p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 flex items-center justify-between cursor-pointer hover:bg-white/60 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl uppercase font-bold text-xs">CERT</div>
                        <div>
                            <h4 className="font-bold text-[#1d1d1f]">Certifications</h4>
                            <p className="text-xs text-[#86868b]">Upload and manage your credentials</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#86868b]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
