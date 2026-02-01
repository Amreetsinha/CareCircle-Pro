import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminProfile, getAdminProfile, updateAdminProfile } from "../api/adminApi";
import { getActiveCities } from "../api/cityApi";

export default function AdminProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        city: "",
        adminLevel: "ADMIN",
    });

    const [cities, setCities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cities
                const cityData = await getActiveCities();
                setCities(cityData || []);

                // Fetch existing profile
                const data = await getAdminProfile();
                if (data && data.fullName) {
                    setIsEditing(true);
                    setFormData({
                        fullName: data.fullName || "",
                        phoneNumber: data.phoneNumber || "",
                        address: data.address || "",
                        city: data.city || "",
                        adminLevel: data.adminLevel || "ADMIN",
                    });
                }
            } catch (err) {
                console.log("No existing admin profile found or fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isEditing) {
                await updateAdminProfile(formData);
                setMessage("✅ Admin profile updated successfully!");
            } else {
                await createAdminProfile(formData);
                setMessage("✅ Admin profile created successfully!");
            }

            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 1500);
        } catch (error) {
            console.error("Profile Save Error:", error);
            setMessage("❌ " + (error.message || "Failed to save profile"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[15%] w-[35%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-[10%] left-[15%] w-[35%] h-[40%] bg-rose-200/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-[600px] animate-fade-in-up">
                <div className="card-apple p-10 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-[#1d1d1f] mb-2">
                            {isEditing ? "Edit Admin Profile" : "🛡️ Admin Profile Setup"}
                        </h2>
                        <p className="text-[#86868b] font-medium tracking-tight">
                            {isEditing ? "Update your administrative details" : "Complete your profile to access the dashboard"}
                        </p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.includes("✅") ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"}`}>
                            <span className="text-lg">{message.includes("✅") ? "✅" : "⚠️"}</span>
                            <p className="text-sm font-bold">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="e.g. System Admin"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="input-apple"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="e.g. +91 9000000000"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="input-apple"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Address</label>
                            <textarea
                                name="address"
                                placeholder="Your full address..."
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="input-apple min-h-[80px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700 ml-1">City</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="input-apple appearance-none bg-white/60"
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Admin Level</label>
                                <select
                                    name="adminLevel"
                                    value={formData.adminLevel}
                                    onChange={handleChange}
                                    required
                                    className="input-apple appearance-none bg-white/60"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-apple-primary w-full py-4 text-lg font-bold shadow-lg"
                            >
                                {loading ? "Saving..." : (isEditing ? "Update Profile" : "Create Profile")}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/admin-dashboard")}
                                className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm"
                            >
                                {isEditing ? "Cancel" : "Back to Dashboard"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
