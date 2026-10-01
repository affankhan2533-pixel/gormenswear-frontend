/**
 * Centralized Enterprise API Service Client for GOR Menswear
 */

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost" ? "http://localhost:5000" : "";
  }
  return process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
};

const BASE_URL = getBaseUrl();

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network connection error", 0, null);
  }
}

export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: "DELETE" }),
};
