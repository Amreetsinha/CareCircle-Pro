import API_BASE_URL from "./api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const createBooking = async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create booking");
    }
    return res.json();
};

export const getBookings = async (caregiverId = null, parentId = null, status = null) => {
    let url = `${API_BASE_URL}/bookings?`;
    if (caregiverId) url += `caregiverId=${caregiverId}&`;
    if (parentId) url += `parentId=${parentId}&`;
    if (status) url += `status=${status}&`;

    const res = await fetch(url, {
        method: "GET",
        headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
};

export const updateBookingStatus = async (bookingId, status) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update booking status");
    return res.json();
};
