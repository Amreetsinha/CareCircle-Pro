import API_BASE_URL from "./api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const searchCaregivers = async (city = "", serviceId = "", date = "", startTime = "", endTime = "", childAge = "", page = 0, limit = 10) => {

    // Construct request body
    const body = {
        city: city || null,
        serviceId: serviceId || null,
        date: date || null,
        startTime: startTime || null,
        endTime: endTime || null,
        childAge: childAge || null,
        page,
        limit
    };

    const res = await fetch(`${API_BASE_URL}/matching/search`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Failed to search caregivers");
    return res.json();
};

export const getActiveServices = async () => {
    const res = await fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    return res.json();
};

export const createBooking = async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
};
