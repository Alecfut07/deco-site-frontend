const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Token storage helper
const getToken = () => {
  return localStorage.getItem("family_member_token");
};

// Helper to get auth headers
const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getToken();
  return {
    ...additionalHeaders,
    ...(token && { Authorization: `Token ${token}` }),
  };
};

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const apiRequest = async (endpoint, options = {}) => {
  // Merge auth headers with any provided headers
  const headers = {
    ...getAuthHeaders(options.headers || {}),
    ...(options.headers || {}),
  };

  // Remove Content-Type from headers if body is FormData (browser will set it with boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Clear token on auth failure
    localStorage.removeItem("family_member_token");
    window.location.href = "/login";
    throw new ApiError(response.status, "Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.detail || "Request failed",
      error
    );
  }

  return response.json();
};

export const api = {
  getPortfolioItems: (params) =>
    apiRequest(`/api/admin/portfolio-items/${params ? `?${params}` : ""}`),

  getPortfolioItem: (id) => apiRequest(`/api/admin/portfolio-items/${id}/`),

  createPortfolioItem: (formData) =>
    apiRequest("/api/admin/portfolio-items/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioItem: (id, formData) =>
    apiRequest(`/api/admin/portfolio-items/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioItem: (id) =>
    apiRequest(`/api/admin/portfolio-items/${id}/`, {
      method: "DELETE",
    }),

  createPortfolioImage: (formData) =>
    apiRequest("/api/admin/portfolio-images/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioImage: (id, formData) =>
    apiRequest(`/api/admin/portfolio-images/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioImage: (id) =>
    apiRequest(`/api/admin/portfolio-images/${id}/`, {
      method: "DELETE",
    }),

  createPortfolioVideo: (formData) =>
    apiRequest("/api/admin/portfolio-videos/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioVideo: (id, formData) =>
    apiRequest(`/api/admin/portfolio-videos/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioVideo: (id) =>
    apiRequest(`/api/admin/portfolio-videos/${id}/`, {
      method: "DELETE",
    }),

  getCategories: () => apiRequest("/api/categories/"),

  createCategory: (data) =>
    apiRequest("/api/admin/categories/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteCategory: (id) =>
    apiRequest(`/api/admin/categories/${id}/`, {
      method: "DELETE",
    }),

  getServices: () => apiRequest("/api/services/"),

  createService: (data) =>
    apiRequest("/api/admin/services/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updateService: (id, data) =>
    apiRequest(`/api/admin/services/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteService: (id) =>
    apiRequest(`/api/admin/services/${id}/`, {
      method: "DELETE",
    }),

  getBusinessInfo: () => apiRequest("/api/business-info/"),

  updateBusinessInfo: (data) =>
    apiRequest("/api/admin/business-info/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
