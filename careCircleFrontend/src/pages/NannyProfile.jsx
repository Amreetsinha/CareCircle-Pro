import { useState, useEffect } from "react";
import {
  createCaregiverProfile,
  getCaregiverProfile
} from "../api/caregiverApi";
import { getActiveCities } from "../api/cityApi";

export default function NannyProfile() {
  const [message, setMessage] = useState("");
  const [cities, setCities] = useState([]);

  /* ================= PROFILE ================= */
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCaregiverProfile();
        if (data) {
          setProfile({
            ...data,
            age: data.age || "", // Ensure controlled component
            experienceYears: data.experienceYears || ""
          });
          console.log("Profile loaded");
        }
      } catch (err) {
        // Ignore error if profile doesn't exist yet
        console.log("No existing profile found or fetch error:", err);
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



  /* ================= HELPERS ================= */
  const handleChange = (e, setter, state) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };

  /* ================= PROFILE SUBMIT ================= */
  const submitProfile = async () => {
    try {
      const payload = {
        fullName: profile.fullName.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        age: Number(profile.age),
        gender: profile.gender.toUpperCase(),
        address: profile.address.trim(),
        city: profile.city.trim(),
        bio: profile.bio.trim(),
        experienceYears: Number(profile.experienceYears || 0),
      };

      await createCaregiverProfile(payload);
      setMessage("✅ Profile saved successfully!");
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to save profile"));
    }
  };



  /* ================= UI ================= */
  return (
    <div className="max-w-[700px] mx-auto mt-32 mb-10 p-8 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] font-sans">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Nanny / Caregiver Onboarding</h2>

      {message && <p className={`mb-5 text-center font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}

      {/* ================= PROFILE ================= */}
      <h3 className="mt-8 mb-3 text-lg font-bold text-gray-700 border-b-2 border-gray-100 pb-1.5">Profile Details</h3>

      <div className="flex flex-col gap-3.5">
        <input name="fullName" placeholder="Full Name *" value={profile.fullName}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300"
        />

        <input name="phoneNumber" placeholder="Phone Number *" value={profile.phoneNumber}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300"
        />

        <input type="number" name="age" placeholder="Age *" value={profile.age}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300"
        />

        <select name="gender" value={profile.gender}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white"
        >
          <option value="">Select Gender *</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea name="address" placeholder="Address *" value={profile.address}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300 resize-y min-h-[80px]"
        />

        <select name="city" value={profile.city}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white"
        >
          <option value="">Select City *</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>{city.name}</option>
          ))}
        </select>

        <input type="number" name="experienceYears" value={profile.experienceYears}
          placeholder="Experience (years)"
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300"
        />

        <textarea name="bio" placeholder="Short Bio" value={profile.bio}
          onChange={(e) => handleChange(e, setProfile, profile)}
          className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-gray-300 resize-y min-h-[90px]"
        />

        <button onClick={submitProfile} className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(49,130,206,0.35)] active:translate-y-0">
          Save Profile
        </button>
      </div>


    </div>
  );
}
