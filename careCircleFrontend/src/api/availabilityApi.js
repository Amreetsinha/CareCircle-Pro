const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const getMyAvailability = async () => {
    const response = await fetch("/caregiver/availability", {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch availability");
    return response.json();
};

export const addAvailability = async (data) => {
    const response = await fetch("/caregiver/availability", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to add availability");
    return response.json();
};

export const deleteAvailability = async (id) => {
    const response = await fetch(`/caregiver/availability/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("Failed to delete availability");
    return true;
};
