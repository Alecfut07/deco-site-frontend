import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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
  },
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
  },
);

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

// =============== Plain API functions (axios) ==================
export const fetchPortfolioItems = (page = 1, pageSize = 12) =>
  api
    .get(`/api/portfolio-items/?page=${page}&page_size=${pageSize}`)
    .then((r) => r.data);

export const fetchPortfolioItem = (id) =>
  api.get(`/api/portfolio-items/${id}/`).then((r) => r.data);

export const fetchSearchAndFilter = (
  query,
  category,
  service,
  page = 1,
  pageSize = 12,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  if (query) params.append("q", query);
  if (category) params.append("category", category);
  if (service) params.append("service", service);
  return api
    .get(`/api/portfolio-items/combined/?${params}`)
    .then((r) => r.data);
};

export const fetchCategories = () =>
  api.get("/api/categories/").then((r) => r.data);

export const fetchServices = () =>
  api.get("/api/services/").then((r) => r.data);

export const fetchBusinessInfo = () =>
  api.get("/api/business-info/").then((r) => r.data);

// =============== Custom Hooks (useState + useEffect) ==================

const useFetch = (fetcher, deps = [], options = {}) => {
  const [data, setData] = useState(options.initialData ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (options.enabled === false) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, isLoading, error, refetch };
};

// Portfolio Items API with TanStack Query
export const usePortfolioItems = (page = 1, pageSize = 12, opts = {}) => {
  const fetcher = useCallback(
    () => fetchPortfolioItems(page, pageSize),
    [page, pageSize],
  );
  return useFetch(fetcher, [page, pageSize], {
    ...opts,
    initialData: opts.enabled === false ? [] : null,
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
          query,
        )}&page=${page}&page_size=${pageSize}`,
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
  pageSize = 12,
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
        `/api/portfolio-items/filter/?${params.toString()}`,
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
  pageSize = 12,
) => {
  const enabled = !!query || !!category || !!service;
  const fetcher = useCallback(
    () => fetchSearchAndFilter(query, category, service, page, pageSize),
    [query, category, service, page, pageSize],
  );
  return useFetch(fetcher, [query, category, service, page, pageSize], {
    enabled,
    initialData: enabled
      ? null
      : { results: [], portfolio_items: [], pagination: {} },
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
