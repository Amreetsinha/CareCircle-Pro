import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchCaregivers, getActiveServices } from "../api/matchingApi";
import { getActiveCities } from "../api/cityApi";
import { getChildren } from "../api/parentApi";
import { createBooking } from "../api/matchingApi"; // We'll need this later or move to dedicated page

export default function SearchCaregivers() {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [services, setServices] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search State
    const [city, setCity] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedChildId, setSelectedChildId] = useState("");

    // Results
    const [caregivers, setCaregivers] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const fetchRefData = async () => {
            try {
                const [citiesData, servicesData, childrenData] = await Promise.all([
                    getActiveCities(),
                    getActiveServices(),
                    getChildren()
                ]);
                setCities(citiesData || []);
                setServices(servicesData || []);
                setChildren(childrenData || []);
            } catch (err) {
                console.error("Failed to load search options", err);
            }
        };
        fetchRefData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        // VALIDATION: Ensure all fields are selected
        if (!city || !serviceId || !date || !startTime || !endTime || !selectedChildId) {
            alert("Please select all required fields: City, Service, Child, Date, and Time.");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            // Derive child age if child selected
            let childAge = "";
            if (selectedChildId) {
                const child = children.find(c => c.id === selectedChildId);
                if (child && child.age) {
                    childAge = child.age;
                }
            }

            const results = await searchCaregivers(city, serviceId, date, startTime, endTime, childAge);
            setCaregivers(results.content || []);
        } catch (err) {
            console.error("Search failed", err);
            alert("Search failed. Please ensure the backend services are running.");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = (caregiver) => {
        // Double Check Validation before navigation
        if (!city || !serviceId || !date || !startTime || !endTime || !selectedChildId) {
            alert("Missing booking details. Please ensure all filters are selected.");
            return;
        }

        // Navigate to booking confirmation with prepopulated data
        navigate("/book-caregiver", {
            state: {
                caregiver,
                date,
                startTime,
                endTime,
                childId: selectedChildId,
                serviceId
            }
        });
    };

    // Helper: Check if form is valid
    const isFormValid = city && serviceId && selectedChildId && date && startTime && endTime;

    return (
        <div className="min-h-screen pt-[80px] pb-12 px-6 bg-[#f5f5f7]">
            <div className="max-w-[1024px] mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#1d1d1f]">Find Caregivers</h1>
                    <p className="text-[#86868b]">Search by city, service, child, and availability.</p>
                </div>

                {/* Search Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2d2d7] mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* City */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">City <span className="text-red-500">*</span></label>
                            <select
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="input-apple"
                                required
                            >
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Service */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">Service Type <span className="text-red-500">*</span></label>
                            <select
                                value={serviceId}
                                onChange={e => setServiceId(e.target.value)}
                                className="input-apple"
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.serviceName}</option>)}
                            </select>
                        </div>

                        {/* Child Selection */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">For Child <span className="text-red-500">*</span></label>
                            <select
                                value={selectedChildId}
                                onChange={e => setSelectedChildId(e.target.value)}
                                className="input-apple"
                                required
                            >
                                <option value="">Select Child</option>
                                {children.map(c => <option key={c.id} value={c.id}>{c.name} ({c.age} yo)</option>)}
                            </select>
                        </div>

                        {/* Date */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="input-apple"
                                required
                            />
                        </div>

                        {/* Start Time */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">Start Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value + ":00")} // Append seconds for LocalTime
                                className="input-apple"
                                required
                            />
                        </div>

                        {/* End Time */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-[#86868b] mb-1">End Time <span className="text-red-500">*</span></label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value + ":00")}
                                className="input-apple"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3 mt-2">
                            <button
                                type="submit"
                                disabled={loading || !isFormValid}
                                className={`w-full md:w-auto px-8 py-3 rounded-full font-bold transition-all ${isFormValid ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {loading ? "Searching..." : "Search Availability"}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">
                            {caregivers.length > 0 ? `Found ${caregivers.length} Caregivers` : "No caregivers found for your criteria."}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {caregivers.map(cg => (
                                <div key={cg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#d2d2d7] flex flex-col justify-between hover:shadow-apple-hover transition-all">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-[#1d1d1f]">{cg.caregiverName}</h3>
                                            <span className="text-[#0071e3] font-medium bg-[#0071e3]/10 px-3 py-1 rounded-full text-xs">
                                                Verified
                                            </span>
                                        </div>
                                        <p className="text-[#86868b] text-sm mb-4">{cg.city}</p>

                                        <div className="space-y-2 text-sm text-[#1d1d1f]">
                                            <div className="flex justify-between border-b border-[#f5f5f7] pb-1">
                                                <span className="text-[#86868b]">Rate</span>
                                                <span className="font-medium">+${cg.extraPrice}/hr</span>
                                            </div>
                                            <div className="flex justify-between border-b border-[#f5f5f7] pb-1">
                                                <span className="text-[#86868b]">Ages Accepted</span>
                                                <span>{cg.minChildAge} - {cg.maxChildAge} years</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-xs text-[#86868b] line-clamp-2">{cg.description}</p>
                                    </div>

                                    <button
                                        onClick={() => handleBooking(cg)}
                                        className="mt-6 w-full py-2 rounded-lg bg-[#f5f5f7] text-[#0071e3] font-medium hover:bg-[#0071e3] hover:text-white transition-colors"
                                    >
                                        Book This Caregiver
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
