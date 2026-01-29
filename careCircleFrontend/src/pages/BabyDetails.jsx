import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addChild } from "../api/parentApi";
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

    try {
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        specialNeeds: form.specialNeeds.trim(),
      };

      await addChild(payload);

      setMessage("✅ Child saved successfully!");

      // Reset form
      setForm({
        name: "",
        age: "",
        gender: "",
        specialNeeds: "",
      });

      // Redirect after success
      setTimeout(() => navigate("/parent-dashboard"), 1200);

    } catch (error) {
      console.error("SAVE ERROR:", error);
      setMessage("❌ " + (error.message || "Failed to save child"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex items-center justify-center bg-gradient-to-br from-[#a8edea] to-[#fed6e3] p-5 font-sans">
      <form className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-10 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-500" onSubmit={handleSubmit}>
        <div className="text-center mb-[30px]">
          <div className="w-20 h-20 bg-gradient-to-br from-[#a8edea] to-[#fed6e3] rounded-full flex items-center justify-center mx-auto mb-5 text-[40px] shadow-sm">👶</div>
          <h2 className="text-[28px] font-bold text-[#2d3748] m-0 mb-2">Add Child</h2>
          <p className="text-sm text-[#718096] m-0">Enter your child's information</p>
        </div>

        {message && <p className={`mb-5 text-center font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-[#4a5568]">Child Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter child's name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3.5 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-[#a8edea] focus:ring-4 focus:ring-[#a8edea]/20 placeholder-gray-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="age" className="text-sm font-semibold text-[#4a5568]">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                min="0"
                className="w-full p-3.5 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-[#a8edea] focus:ring-4 focus:ring-[#a8edea]/20 placeholder-gray-300"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className="text-sm font-semibold text-[#4a5568]">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full p-3.5 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-[#a8edea] focus:ring-4 focus:ring-[#a8edea]/20 bg-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="specialNeeds" className="text-sm font-semibold text-[#4a5568]">Special Needs (Optional)</label>
            <textarea
              id="specialNeeds"
              name="specialNeeds"
              placeholder="Any special needs or requirements..."
              value={form.specialNeeds}
              onChange={handleChange}
              className="w-full p-3.5 text-sm border-2 border-gray-100 rounded-xl transition-all duration-300 focus:outline-none focus:border-[#a8edea] focus:ring-4 focus:ring-[#a8edea]/20 placeholder-gray-300 resize-y min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3.5 text-base font-bold text-white bg-gradient-to-br from-[#a8edea] to-[#fed6e3] border-none rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(168,237,234,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Child"}
          </button>
        </div>
      </form>
    </div>
  );
}
