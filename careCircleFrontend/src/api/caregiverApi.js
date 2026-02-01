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

export const addCapability = async (data) => {
  const res = await fetch(`${API_BASE_URL}/caregiver/capabilities`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add capability");
  return res.json();
};

export const getCapabilities = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/capabilities`, {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to fetch capabilities");
  return res.json();
};

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
export const deleteCaregiverProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/caregiver/profile`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete caregiver profile");
  return true;
};
