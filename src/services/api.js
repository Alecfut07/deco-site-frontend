import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Configure base URL - adjust this to match Django backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request intercepto to include token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("family_member_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token on auth failure
      localStorage.removeItem("family_member_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

// Portfolio Items API with TanStack Query
export const usePortfolioItems = (page = 1, pageSize = 12, options = {}) => {
  const enabled = options.enabled ?? true;

  return useQuery({
    queryKey: ["portfolio-items", page, pageSize],
    queryFn: async () => {
      const response = await api.get(
        `/api/portfolio-items/?page=${page}&page_size=${pageSize}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (matches backend cache)
    keepPreviousData: true,
    enabled,
  });
};

export const usePortfolioItem = (id) => {
  return useQuery({
    queryKey: ["portfolio_item", id],
    queryFn: async () => {
      const response = await api.get(`/api/portfolio-items/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Search functionality
export const useSearchPortfolioItems = (query, page = 1, pageSize = 12) => {
  return useQuery({
    queryKey: ["portfolio-search", query, page, pageSize],
    queryFn: async () => {
      const response = await api.get(
        `/api/portfolio-items/search/?q=${encodeURIComponent(
          query
        )}&page=${page}&page_size=${pageSize}`
      );
      return response.data;
    },
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Filter by category
export const useFilterPortfolio = (
  category,
  service,
  page = 1,
  pageSize = 12
) => {
  return useQuery({
    queryKey: ["portfolio-filter", category, service, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (category) params.append("category", category);
      if (service) params.append("service", service);

      const response = await api.get(
        `/api/portfolio-items/filter/?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!category || !!service,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Combined search and filter
export const useSearchAndFilter = (
  query,
  category,
  service,
  page = 1,
  pageSize = 12
) => {
  return useQuery({
    queryKey: ["portfolio-combined", query, category, service, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (query) params.append("q", query);
      if (category) params.append("category", category);
      if (service) params.append("service", service);

      const response = await api.get(
        `/api/portfolio-items/combined/?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!query || !!category || !!service,
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

// Categories API
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/api/categories/");
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Services API
export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/api/services/");
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - services don't change often
  });
};

// Business Info API
export const useBusinessInfo = () => {
  return useQuery({
    queryKey: ["business-info"],
    queryFn: async () => {
      const response = await api.get(`/api/business-info/`);
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export default api;
