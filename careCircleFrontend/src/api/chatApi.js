import API_BASE_URL from "./api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-User-Role": role, // Critical for Admin Chat
        "X-User-Id": userId,
        "X-User-Email": email
    };
};

// Create or Get capabilities
export const initiateChat = async (bookingId, partnerId) => {
    const res = await fetch(`${API_BASE_URL}/communication-service/chats/rooms`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ bookingId, partnerId })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to initiate chat");
    }
    return res.json();
};

export const getMyChatRooms = async () => {
    const res = await fetch(`${API_BASE_URL}/communication-service/chats/my`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch chat rooms");
    return res.json();
};

export const getMessages = async (roomId, page = 0) => {
    const res = await fetch(`${API_BASE_URL}/communication-service/chats/rooms/${roomId}/messages?page=${page}&size=50`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json(); // Returns Page<ChatMessageResponse>
};

export const sendMessage = async (roomId, message) => {
    const res = await fetch(`${API_BASE_URL}/communication-service/chats/rooms/${roomId}/messages`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error("Failed to send message");
    return true;
};

export const markAsRead = async (roomId) => {
    await fetch(`${API_BASE_URL}/communication-service/chats/rooms/${roomId}/read`, {
        method: "PUT",
        headers: getHeaders(),
    }).catch(e => console.error(e));
};
