import API_BASE_URL from "./api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createCaregiverProfile = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/profile`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create caregiver profile");
  return res.json();
};

export const getCaregiverProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/profile`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to fetch caregiver profile");
  return res.json();
};

export const updateCaregiverProfile = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update caregiver profile");
  return res.json();
};

// Services (Capabilities)
export const addService = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/services`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add service");
  return res.json();
};

export const getServices = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/services`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export const updateService = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/services`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/services/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return true;
};

// Certifications
export const addCertification = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/certifications`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add certification");
  return res.json();
};

export const getCertifications = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/certifications`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to fetch certifications");
  return res.json();
};

export const updateCertification = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/certifications/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update certification");
  return res.json();
};

export const deleteCertification = async (id) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/certifications/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete certification");
  return true;
};

export const deleteCaregiverProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/profile`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete caregiver profile");
  return true;
};
