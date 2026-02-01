import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCaregiverProfile,
  getCaregiverProfile,
  updateCaregiverProfile,
  deleteCaregiverProfile
} from "../api/caregiverApi";
import { getActiveCities } from "../api/cityApi";

export default function NannyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    bio: "",
    experienceYears: "",
  });

  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCaregiverProfile();
        if (data && data.fullName) {
          setIsEditing(true);
          setProfile({
            ...data,
            age: data.age || "",
            experienceYears: data.experienceYears || ""
          });
        }
      } catch (err) {
        console.log("No existing profile or fetch error (likely new):", err);
      }
    };

    const fetchCities = async () => {
      try {
        const cityData = await getActiveCities();
        setCities(cityData || []);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      }
    };

    fetchProfile();
    fetchCities();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete your profile? This action cannot be undone.")) {
      setLoading(true);
      try {
        await deleteCaregiverProfile();
        alert("Profile deleted successfully.");
        navigate("/caregiver-dashboard");
      } catch (error) {
        setMessage("❌ Failed to delete profile");
      } finally {
        setLoading(false);
      }
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        fullName: profile.fullName.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        age: Number(profile.age),
        gender: profile.gender.toUpperCase(),
        address: profile.address.trim(),
        city: profile.city.trim(),
        bio: (profile.bio || "").trim(),
        experienceYears: Number(profile.experienceYears || 0),
      };

      if (isEditing) {
        await updateCaregiverProfile(payload);
        setMessage("✅ Profile updated successfully!");
      } else {
        await createCaregiverProfile(payload);
        setMessage("✅ Profile created successfully!");
      }

      setTimeout(() => {
        navigate("/caregiver-dashboard");
      }, 1500);

    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to save profile"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[35%] bg-blue-200/20 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[35%] bg-indigo-200/20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[700px] animate-fade-in-up">
        <div className="card-apple p-10 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1d1d1f] mb-2">
              {isEditing ? "Edit Your Profile" : "Caregiver Onboarding"}
            </h2>
            <p className="text-[#86868b] font-medium tracking-tight">
              {isEditing ? "Keep your clinical details up to date" : "Tell us about your caregiver experience"}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.includes("✅") ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"}`}>
              <span className="text-lg">{message.includes("✅") ? "✅" : "⚠️"}</span>
              <p className="text-sm font-bold">{message}</p>
            </div>
          )}

          <form onSubmit={submitProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <input name="fullName" placeholder="Full Name" value={profile.fullName}
                  onChange={handleChange} required className="input-apple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <input name="phoneNumber" placeholder="Phone Number" value={profile.phoneNumber}
                  onChange={handleChange} required className="input-apple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">Age</label>
                <input type="number" name="age" placeholder="Age" value={profile.age}
                  onChange={handleChange} required className="input-apple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">Gender</label>
                <select name="gender" value={profile.gender}
                  onChange={handleChange} required className="input-apple bg-white/60"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 ml-1">Address</label>
              <textarea name="address" placeholder="Residential Address" value={profile.address}
                onChange={handleChange} required className="input-apple min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">City</label>
                <select name="city" value={profile.city}
                  onChange={handleChange} required className="input-apple bg-white/60"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700 ml-1">Years of Experience</label>
                <input type="number" name="experienceYears" value={profile.experienceYears}
                  placeholder="Experience (years)" onChange={handleChange} className="input-apple"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 ml-1">Short Bio</label>
              <textarea name="bio" placeholder="Tell us about yourself..." value={profile.bio}
                onChange={handleChange} className="input-apple min-h-[90px]"
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-apple-primary w-full py-4 text-lg font-bold shadow-lg"
              >
                {loading ? "Processing..." : (isEditing ? "Update Profile" : "Save Profile")}
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/caregiver-dashboard")}
                  className="flex-1 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors text-sm border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  {isEditing ? "Cancel" : "Skip for now"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-3 text-red-500 hover:text-red-700 font-bold transition-colors text-sm border border-red-100 rounded-xl hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
