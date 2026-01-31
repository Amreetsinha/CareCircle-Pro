import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addChild } from "../api/parentApi";
import logo from "../assets/logo.png";

export default function BabyDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    specialNeeds: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        specialNeeds: form.specialNeeds.trim(),
      };

      await addChild(payload);
      setMessage("Child saved successfully!");

      setForm({
        name: "",
        age: "",
        gender: "",
        specialNeeds: "",
      });

      // Redirect after success
      setTimeout(() => navigate("/parent-dashboard"), 1000);

    } catch (error) {
      console.error("SAVE ERROR:", error);
      setMessage("Failed to save child: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-[#f5f5f7] px-6">

      {/* Header */}
      <div className="mb-8 text-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h1 className="text-[28px] font-semibold text-[#1d1d1f]">Add Child</h1>
        <p className="text-[#86868b] mt-2 text-[17px]">Manage your family profile.</p>
      </div>

      <div className="w-full max-w-[480px]">

        {message && (
          <div className={`mb-6 p-3 rounded-xl border text-sm font-medium text-center ${message.includes("Failed")
              ? "bg-[#fff2f2] border-[#ff3b30]/20 text-[#ff3b30]"
              : "bg-[#f2fff4] border-[#34c759]/20 text-[#34c759]"
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-white rounded-xl border border-[#d2d2d7] overflow-hidden shadow-sm p-6 space-y-6">

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1d1d1f] mb-2">Child Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="input-apple"
                placeholder="Enter child's name"
                required
              />
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-[#1d1d1f] mb-2">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={handleChange}
                  className="input-apple"
                  placeholder="Age"
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-[#1d1d1f] mb-2">Gender</label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="input-apple appearance-none bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#86868b]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Needs */}
            <div>
              <label htmlFor="specialNeeds" className="block text-sm font-medium text-[#1d1d1f] mb-2">Special Needs <span className="text-[#86868b] font-normal">(Optional)</span></label>
              <textarea
                id="specialNeeds"
                name="specialNeeds"
                rows="3"
                value={form.specialNeeds}
                onChange={handleChange}
                className="input-apple resize-none"
                placeholder="Any requirements..."
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-apple-primary w-full py-3 text-[17px] shadow-sm"
          >
            {loading ? "Saving..." : "Save Child Profile"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/parent-dashboard")}
            className="w-full text-center text-[#0071e3] text-sm hover:underline"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}
