const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
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
    apiRequest(`/admin/portfolio-items/${params ? `?${params}` : ""}`),

  getPortfolioItem: (id) => apiRequest(`/admin/portfolio-items/${id}/`),

  createPortfolioItem: (formData) =>
    apiRequest("/admin/portfolio-items/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioItem: (id, formData) =>
    apiRequest(`/admin/portfolio-items/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioItem: (id) =>
    apiRequest(`/admin/portfolio-items/${id}/`, {
      method: "DELETE",
    }),

  createPortfolioImage: (formData) =>
    apiRequest("/admin/portfolio-images/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioImage: (id, formData) =>
    apiRequest(`/admin/portfolio-images/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioImage: (id) =>
    apiRequest(`/admin/portfolio-images/${id}/`, {
      method: "DELETE",
    }),

  createPortfolioVideo: (formData) =>
    apiRequest("/admin/portfolio-videos/", {
      method: "POST",
      body: formData,
    }),

  updatePortfolioVideo: (id, formData) =>
    apiRequest(`/admin/portfolio-videos/${id}/`, {
      method: "PATCH",
      body: formData,
    }),

  deletePortfolioVideo: (id) =>
    apiRequest(`/admin/portfolio-videos/${id}/`, {
      method: "DELETE",
    }),

  getCategories: () => apiRequest("/categories/"),

  createCategory: (data) =>
    apiRequest("/admin/categories/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteCategory: (id) =>
    apiRequest(`/admin/categories/${id}/`, {
      method: "DELETE",
    }),

  getServices: () => apiRequest("/services/"),

  createService: (data) =>
    apiRequest("/admin/services/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updateService: (id, data) =>
    apiRequest(`/admin/services/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteService: (id) =>
    apiRequest(`/admin/services/${id}/`, {
      method: "DELETE",
    }),

  getBusinessInfo: () => apiRequest("/business-info/"),

  updateBusinessInfo: (data) =>
    apiRequest("/admin/business-info/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
