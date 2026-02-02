import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAvailability, addAvailability, deleteAvailability } from "../api/availabilityApi";

export default function CaregiverAvailability() {
    const navigate = useNavigate();
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        availableDate: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "17:00"
    });

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const data = await getMyAvailability();
            // Data is already filtered by backend to be >= today
            setAvailability(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addAvailability(form);
            setMessage("✅ Availability added!");
            fetchAvailability();
        } catch (err) {
            setMessage("❌ Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this slot?")) return;
        setLoading(true);
        try {
            await deleteAvailability(id);
            fetchAvailability();
        } catch (err) {
            alert("Delete failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper to group by date
    const grouped = availability.reduce((acc, slot) => {
        const date = slot.availableDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort();

    return (
        <div className="min-h-screen pt-24 px-6 pb-20 font-sans bg-[#f5f5f7]">
            <div className="max-w-[1000px] mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">Manage Availability</h1>
                        <p className="text-[#86868b] mt-1 text-[19px]">Add specific dates and times when you can work.</p>
                    </div>
                    <button onClick={() => navigate("/caregiver-dashboard")} className="text-[#0071e3] font-medium hover:underline text-[17px]">
                        Back to Dashboard
                    </button>
                </div>

                {message && (
                    <div className="mb-6 p-4 rounded-2xl bg-white shadow-apple-soft text-center animate-fade-in text-[15px] font-medium">
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Card */}
                    <div className="lg:col-span-1">
                        <div className="card-apple p-8 shadow-apple-soft bg-white glass-morphism sticky top-28">
                            <h2 className="text-xl font-bold mb-6 text-[#1d1d1f]">Add Time Slot</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="label-apple text-[13px] uppercase tracking-wider mb-2 block opactiy-60">Available Date</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split("T")[0]}
                                        className="input-apple w-full"
                                        value={form.availableDate}
                                        onChange={(e) => setForm({ ...form, availableDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-apple text-[13px] uppercase tracking-wider mb-2 block opactiy-60">Start Time</label>
                                        <input
                                            type="time"
                                            className="input-apple w-full"
                                            value={form.startTime}
                                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label-apple text-[13px] uppercase tracking-wider mb-2 block opactiy-60">End Time</label>
                                        <input
                                            type="time"
                                            className="input-apple w-full"
                                            value={form.endTime}
                                            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-apple-primary w-full mt-4 bg-[#0071e3] py-4 rounded-2xl font-semibold shadow-blue-500/20 shadow-lg hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
                                >
                                    {loading ? "Saving..." : "Add to Schedule"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Slots List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-[#1d1d1f]">Upcoming Slots</h3>
                            <span className="text-[13px] text-[#86868b] bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                {availability.length} Total
                            </span>
                        </div>

                        {availability.length === 0 ? (
                            <div className="card-apple p-16 text-center bg-white/50 border-2 border-dashed border-gray-200">
                                <div className="text-4xl mb-4">🗓️</div>
                                <p className="text-[#86868b] text-[17px]">No upcoming availability.</p>
                                <p className="text-[#86868b] text-[15px] mt-1">Add slots on the left to start receiving bookings.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {sortedDates.map(date => (
                                    <div key={date} className="space-y-2">
                                        <h4 className="text-[14px] font-bold text-[#86868b] px-2 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </h4>
                                        <div className="space-y-2">
                                            {grouped[date].map(slot => (
                                                <div key={slot.id} className="card-apple p-5 bg-white flex justify-between items-center group hover:border-[#0071e3]/30 transition-all shadow-apple-soft">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs uppercase">
                                                            Time
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#1d1d1f] text-[17px]">
                                                                {slot.startTime.substring(0, 5)} — {slot.endTime.substring(0, 5)}
                                                            </p>
                                                            <p className="text-[13px] text-green-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Available for booking</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(slot.id)}
                                                        className="p-3 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-2xl transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
