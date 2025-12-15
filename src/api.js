const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/v1";

export async function apiRequest(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle DELETE / 204 responses safely
  if (res.status === 204) {
    return { success: true };
  }

  //Parse JSON ONLY when body exists
  const data = await res.json();

  //Error handling AFTER parsing
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export default API_URL;
