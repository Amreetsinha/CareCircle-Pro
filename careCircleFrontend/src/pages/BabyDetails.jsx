import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addChild, getChildren, updateChild, deleteChild } from "../api/parentApi";
import logo from "../assets/logo.png";

export default function BabyDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    specialNeeds: "",
  });

  const [children, setChildren] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch children on mount
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(data || []);
    } catch (error) {
      console.error("Failed to fetch children", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (child) => {
    setEditingId(child.id);
    setForm({
      name: child.name,
      age: child.age,
      gender: child.gender,
      specialNeeds: child.specialNeeds || "",
    });
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", age: "", gender: "", specialNeeds: "" });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      await deleteChild(id);
      fetchChildren();
    } catch (error) {
      console.error("Delete error:", error);
    }
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

      if (editingId) {
        await updateChild(editingId, payload);
        setMessage("Child updated successfully!");
        setEditingId(null);
      } else {
        await addChild(payload);
        setMessage("Child added successfully!");
      }

      setForm({ name: "", age: "", gender: "", specialNeeds: "" });
      fetchChildren();

    } catch (error) {
      console.error("SAVE ERROR:", error);
      setMessage("Failed to save: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-6 font-sans">

      {/* Header */}
      <div className="mb-8 text-center animate-fade-in-up">
        <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">My Family</h1>
        <p className="text-[#86868b] mt-1 text-[17px]">Manage your children's profiles.</p>
      </div>

      <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column: List of Children */}
        <div className="space-y-4 animate-fade-in-up md:order-2">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Registered Children</h2>
          {children.length === 0 ? (
            <div className="p-6 bg-white/50 rounded-2xl text-center border border-dashed border-gray-300">
              <p className="text-gray-500">No children registered yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <div key={child.id} className={`card-apple p-5 flex justify-between items-start transition-all ${editingId === child.id ? 'ring-2 ring-[#0071e3]' : ''}`}>
                  <div>
                    <h3 className="font-bold text-[#1d1d1f] text-lg">{child.name}</h3>
                    <p className="text-sm text-[#86868b] mt-1">{child.gender} • {child.age} years</p>
                    {child.specialNeeds && <p className="text-xs text-orange-500 mt-1">Needs: {child.specialNeeds}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(child)}
                      className="p-2 text-[#0071e3] bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Add/Edit Child Form */}
        <div className="md:order-1">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">
            {editingId ? "Edit Child Profile" : "Add New Child"}
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded-xl border text-sm font-medium text-center ${message.includes("Failed")
              ? "bg-[#fff2f2] border-[#ff3b30]/20 text-[#ff3b30]"
              : "bg-[#f2fff4] border-[#34c759]/20 text-[#34c759]"
              }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 card-apple shadow-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Child Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="input-apple"
                placeholder="Enter name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Age</label>
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
                <label htmlFor="gender" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input-apple appearance-none bg-white/60"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="specialNeeds" className="block text-sm font-medium text-[#1d1d1f] mb-1.5">Special Needs <span className="text-[#86868b] font-normal">(Opt)</span></label>
              <textarea
                id="specialNeeds"
                name="specialNeeds"
                rows="2"
                value={form.specialNeeds}
                onChange={handleChange}
                className="input-apple resize-none"
                placeholder="Details..."
              />
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-apple-primary w-full py-3 text-[15px] font-semibold"
              >
                {loading ? "Saving..." : (editingId ? "Update Profile" : "Add Child")}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full py-2 text-[#ff3b30] text-sm font-medium hover:underline"
                >
                  Cancel Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/parent-dashboard")}
                  className="w-full text-center text-[#86868b] text-sm hover:underline"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
