import { api as axiosApi } from "@/services/api";

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    return Promise.reject(error);
  }
  throw new ApiError(
    error.response?.status || 500,
    error.response?.data?.detail || "Request failed",
    error.response?.data,
  );
};

export const api = {
  getPortfolioItems: (params) =>
    axiosApi
      .get(`/api/admin/portfolio-items/${params ? `?${params}` : ""}`)
      .then(handleResponse)
      .catch(handleError),

  getPortfolioItem: (id) =>
    axiosApi
      .get(`/api/admin/portfolio-items/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  createPortfolioItem: (formData) =>
    axiosApi
      .post("/api/admin/portfolio-items/", formData, {
        headers: { "Content-Type": undefined },
      })
      .then(handleResponse)
      .catch(handleError),

  updatePortfolioItem: (id, formData) =>
    axiosApi
      .patch(`/api/admin/portfolio-items/${id}/`, formData, {
        headers: { "Content-Type": undefined },
      })
      .then(handleResponse)
      .catch(handleError),

  deletePortfolioItem: (id) =>
    axiosApi
      .delete(`/api/admin/portfolio-items/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  createPortfolioImage: (formData) =>
    axiosApi
      .post("/api/admin/portfolio-images/", formData)
      .then(handleResponse)
      .catch(handleError),

  updatePortfolioImage: (id, formData) =>
    axiosApi
      .patch(`/api/admin/portfolio-images/${id}/`, formData)
      .then(handleResponse)
      .catch(handleError),

  deletePortfolioImage: (id) =>
    axiosApi
      .delete(`/api/admin/portfolio-images/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  createPortfolioVideo: (formData) =>
    axiosApi
      .post("/api/admin/portfolio-videos/", formData)
      .then(handleResponse)
      .catch(handleError),

  updatePortfolioVideo: (id, formData) =>
    axiosApi
      .patch(`/api/admin/portfolio-videos/${id}/`, formData)
      .then(handleResponse)
      .catch(handleError),

  deletePortfolioVideo: (id) =>
    axiosApi
      .delete(`/api/admin/portfolio-videos/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  getCategories: () =>
    axiosApi.get("/api/categories/").then(handleResponse).catch(handleError),

  getAdminCategories: (params) =>
    axiosApi
      .get(`/api/admin/categories/${params ? `?${params}` : ""}`)
      .then(handleResponse)
      .catch(handleError),

  createCategory: (data) =>
    axiosApi
      .post("/api/admin/categories/", data)
      .then(handleResponse)
      .catch(handleError),

  updateCategory: (id, data) =>
    axiosApi
      .patch(`/api/admin/categories/${id}/`, data)
      .then(handleResponse)
      .catch(handleError),

  deleteCategory: (id) =>
    axiosApi
      .delete(`/api/admin/categories/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  getServices: () =>
    axiosApi.get("/api/services/").then(handleResponse).catch(handleError),

  getAdminServices: (params) =>
    axiosApi
      .get(`/api/admin/services/${params ? `?${params}` : ""}`)
      .then(handleResponse)
      .catch(handleError),

  createService: (data) =>
    axiosApi
      .post("/api/admin/services/", data)
      .then(handleResponse)
      .catch(handleError),

  updateService: (id, data) =>
    axiosApi
      .patch(`/api/admin/services/${id}/`, data)
      .then(handleResponse)
      .catch(handleError),

  deleteService: (id) =>
    axiosApi
      .delete(`/api/admin/services/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  getBusinessInfo: () =>
    axiosApi.get("/api/business-info/").then(handleResponse).catch(handleError),

  getAdminBusinessInfo: async () => {
    const data = await axiosApi
      .get("/api/admin/business-info/")
      .then(handleResponse)
      .catch(handleError);
    // Handle array response - return first item if array, otherwise return data as-is
    return Array.isArray(data) && data.length > 0 ? data[0] : data;
  },

  updateBusinessInfo: (data) =>
    axiosApi
      .patch("/api/admin/business-info/", data)
      .then(handleResponse)
      .catch(handleError),
};
