import API_BASE_URL from "./api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const createAdminProfile = async (data) => {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create admin profile");
    return res.json();
};

export const getAdminProfile = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch admin profile");
    return res.json();
};

export const updateAdminProfile = async (data) => {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update admin profile");
    return res.json();
};

export const verifyCaregiver = async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/admin/caregivers/${id}/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to verify caregiver");
    return true;
};

export const verifyCapability = async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/admin/capabilities/${id}/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to verify capability");
    return res.json();
};

export const verifyCertification = async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/admin/matching/certifications/${id}/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to verify certification");
    return true;
};

export const rejectCertification = async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/admin/matching/certifications/${id}/reject`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to reject certification");
    return true;
};
export const getAdminStatistics = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch admin statistics");
    return res.json();
};
export const deleteAdminProfile = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete admin profile");
    return true;
};

export const getAllCaregivers = async (city = "", statuses = [], page = 0, size = 5) => {
    let url = `${API_BASE_URL}/admin/caregivers?city=${city}&page=${page}&size=${size}`;
    if (statuses && statuses.length > 0) {
        url += `&status=${statuses.join(",")}`;
    }
    const res = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch caregivers");
    return res.json();
};

export const getAllCertifications = async (statuses = [], page = 0, size = 5) => {
    let url = `${API_BASE_URL}/admin/matching/certifications?page=${page}&size=${size}`;
    if (statuses && statuses.length > 0) {
        url += `&status=${statuses.join(",")}`;
    }
    const res = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch certifications");
    return res.json();
};

export const getPendingCertifications = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/matching/certifications/pending`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch pending certifications");
    return res.json();
};

export const rejectCaregiver = async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/admin/caregivers/${id}/reject`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to reject caregiver");
    return true;
};

export const getAllParents = async (city = "", page = 0, size = 10) => {
    let url = `${API_BASE_URL}/admin/parents?page=${page}&size=${size}`;
    if (city) {
        url += `&city=${city}`;
    }
    const res = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch parents");
    return res.json();
};

export const getChildrenForParent = async (parentId) => {
    const res = await fetch(`${API_BASE_URL}/admin/parents/${parentId}/children`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch children for parent");
    return res.json();
};

export const getBookings = async (type = "active", page = 0, limit = 5) => {
    let statusParams = "";
    if (type === "active") statusParams = "status=REQUESTED&status=ACCEPTED";
    else if (type === "completed") statusParams = "status=COMPLETED";
    else if (type === "cancelled") statusParams = "status=CANCELLED&status=REJECTED";

    // Note: page/limit ignored for now in backend simple implementation, but we keep signature
    const res = await fetch(`${API_BASE_URL}/bookings?${statusParams}`, {
        method: "GET",
        headers: getHeaders(),
    });
    // Wrap in standard page response structure for frontend compatibility
    if (!res.ok) throw new Error(`Failed to fetch ${type} bookings`);
    const data = await res.json();
    return {
        content: data,
        last: true // Simple list for now
    };
};

export const getServices = async () => {
    const res = await fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch services");
    return res.json();
};

export const createService = async (data) => {
    const res = await fetch(`${API_BASE_URL}/admin/services`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let msg = "Failed to create service";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return res.json();
};

export const updateService = async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let msg = "Failed to update service";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return res.json();
};

export const deleteService = async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    if (!res.ok) {
        let msg = "Failed to delete service";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return true;
};

export const createCity = async (data) => {
    const res = await fetch(`${API_BASE_URL}/admin/cities`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let msg = "Failed to create city";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return res.json();
};

export const updateCity = async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/admin/cities/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        let msg = "Failed to update city";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return res.json();
};

export const deleteCity = async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/cities/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    if (!res.ok) {
        let msg = "Failed to delete city";
        try {
            const err = await res.json();
            msg = err.message || msg;
        } catch (e) { }
        throw new Error(msg);
    }
    return true;
};
