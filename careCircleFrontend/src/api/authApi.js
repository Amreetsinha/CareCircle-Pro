import API_BASE_URL from "./api";

export async function login(email, password, role) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Login failed");
    }

    const data = await response.json();
    return data;
}
