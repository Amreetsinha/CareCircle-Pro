import { useState, useEffect } from "react";
import {
  createCaregiverProfile,
  addCertification,
  addCapability,
  getCaregiverProfile
} from "../api/caregiverApi";
import "./NannyProfile.css";

export default function NannyProfile() {
  const [message, setMessage] = useState("");

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
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
    fetchProfile();
  }, []);

  /* ================= CERTIFICATION (TEXT ONLY) ================= */
  const [certification, setCertification] = useState({
    certificationName: "",
    issuedBy: "",
    validTill: "",
  });

  /* ================= CAPABILITY ================= */
  const [capability, setCapability] = useState({
    serviceType: "INFANT_CARE", // Matching enum from guide example usually, or keep simple
    description: "",
    minChildAge: 0,
    maxChildAge: 10,
    requiresCertification: true,
  });

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
        addressLine1: profile.addressLine1.trim(),
        addressLine2: profile.addressLine2.trim(),
        city: profile.city.trim(),
        state: profile.state.trim(),
        pincode: profile.pincode.trim(),
        country: profile.country.trim(),
        bio: profile.bio.trim(),
        experienceYears: Number(profile.experienceYears || 0),
      };

      await createCaregiverProfile(payload);
      setMessage("✅ Profile saved successfully! You can now add certifications and capabilities below.");
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to save profile"));
    }
  };

  /* ================= CERTIFICATION SUBMIT ================= */
  const submitCertification = async () => {
    if (!certification.certificationName || !certification.issuedBy) {
      setMessage("❌ Please complete certification details");
      return;
    }

    try {
      const payload = {
        certificationName: certification.certificationName.trim(),
        issuedBy: certification.issuedBy.trim(),
        validTill: certification.validTill,
      };

      await addCertification(payload);
      setMessage("✅ Certification added successfully");

      // Reset
      setCertification({
        certificationName: "",
        issuedBy: "",
        validTill: "",
      });
    } catch (error) {
      console.error("CERTIFICATION ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to add certification"));
    }
  };

  /* ================= CAPABILITY SUBMIT ================= */
  const submitCapability = async () => {
    try {
      await addCapability(capability);
      setMessage("✅ Capability added successfully");
    } catch (error) {
      console.error("CAPABILITY ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to add capability"));
    }
  };

  /* ================= UI ================= */
  return (
    <div className="nanny-container">
      <h2>Nanny / Caregiver Onboarding</h2>

      {message && <p className="status">{message}</p>}

      {/* ================= PROFILE ================= */}
      <h3>Profile Details</h3>

      <input name="fullName" placeholder="Full Name *" value={profile.fullName}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="phoneNumber" placeholder="Phone Number *" value={profile.phoneNumber}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input type="number" name="age" placeholder="Age *" value={profile.age}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <select name="gender" value={profile.gender}
        onChange={(e) => handleChange(e, setProfile, profile)}>
        <option value="">Select Gender *</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input name="addressLine1" placeholder="Address Line 1 *" value={profile.addressLine1}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="addressLine2" placeholder="Address Line 2" value={profile.addressLine2}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="city" placeholder="City *" value={profile.city}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="state" placeholder="State *" value={profile.state}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="pincode" placeholder="Pincode *" value={profile.pincode}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input name="country" value={profile.country}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <input type="number" name="experienceYears" value={profile.experienceYears}
        placeholder="Experience (years)"
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <textarea name="bio" placeholder="Short Bio" value={profile.bio}
        onChange={(e) => handleChange(e, setProfile, profile)} />

      <button onClick={submitProfile}>Save Profile</button>

      {/* ================= CERTIFICATION ================= */}
      <h3>Certifications</h3>

      <input
        name="certificationName"
        placeholder="Certification Name *"
        value={certification.certificationName}
        onChange={(e) => handleChange(e, setCertification, certification)}
      />

      <input
        name="issuedBy"
        placeholder="Issued By *"
        value={certification.issuedBy}
        onChange={(e) => handleChange(e, setCertification, certification)}
      />

      <input
        type="date"
        name="validTill"
        value={certification.validTill}
        onChange={(e) => handleChange(e, setCertification, certification)}
      />

      <button onClick={submitCertification}>Add Certification</button>

      {/* ================= CAPABILITY ================= */}
      <h3>Capabilities</h3>

      <textarea
        name="description"
        placeholder="Describe your caregiving service"
        value={capability.description}
        onChange={(e) => handleChange(e, setCapability, capability)}
      />

      <button onClick={submitCapability}>Add Capability</button>
    </div>
  );
}
