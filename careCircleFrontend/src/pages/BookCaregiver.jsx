import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi"; // Ensure this import is correct
import { getParentProfile, getChildren } from "../api/parentApi";

export default function BookCaregiver() {
    const location = useLocation();
    const navigate = useNavigate();
    const { caregiver, date, startTime, endTime, childId, serviceId } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [parentProfile, setParentProfile] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null); // Full child object

    useEffect(() => {
        if (!caregiver || !date) {
            navigate("/search-caregivers");
            return;
        }

        const loadData = async () => {
            try {
                // 1. Fetch Profile
                const p = await getParentProfile();
                setParentProfile(p);

                // 2. Fetch Child Details if childId is present
                if (childId) {
                    const allChildren = await getChildren();
                    const found = allChildren.find(c => c.id === childId);
                    setSelectedChild(found);
                }
            } catch (err) {
                console.error("Error loading booking data", err);
            }
        };
        loadData();
    }, [caregiver, date, navigate, childId]);

    const handleConfirmBooking = async () => {
        if (!parentProfile) {
            alert("Could not identify parent account. Please relogin.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Construct payload matching Backend CreateBookingRequest
            const bookingPayload = {
                caregiverId: caregiver.caregiverId,
                serviceId: serviceId,
                startTime: startTime,
                endTime: endTime,
                startDate: date,
                endDate: date,
                bookingType: "HOURLY",
                // Send full child objects
                children: selectedChild ? [{
                    childId: selectedChild.id,
                    childName: selectedChild.name,
                    age: selectedChild.age,
                    specialNeeds: selectedChild.specialNeeds || "None"
                }] : []
            };

            await createBooking(bookingPayload);
            alert("Booking request sent successfully!");
            navigate("/parent-dashboard");
        } catch (err) {
            setError(err.message || "Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    if (!caregiver) return null;

    return (
        <div className="min-h-screen pt-[100px] pb-12 px-6 bg-[#f5f5f7] flex justify-center items-center">
            <div className="bg-white p-8 rounded-2xl shadow-apple-soft max-w-md w-full border border-[#d2d2d7]">
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 text-center">Confirm Booking</h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-[#86868b] font-medium">Caregiver</span>
                        <span className="text-[#1d1d1f] font-bold">{caregiver.caregiverName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-[#86868b] font-medium">Date</span>
                        <span className="text-[#1d1d1f] font-bold">{date}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-[#86868b] font-medium">Time</span>
                        <span className="text-[#1d1d1f] font-bold">{startTime?.substring(0, 5)} - {endTime?.substring(0, 5)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-[#86868b] font-medium">Rate</span>
                        <span className="text-[#1d1d1f] font-bold">+${caregiver.extraPrice}/hr</span>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3 rounded-xl border border-[#d2d2d7] text-[#1d1d1f] font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-[#0071e3] text-white font-bold hover:bg-[#0077ED] transition-colors disabled:opacity-50"
                    >
                        {loading ? "Booking..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
