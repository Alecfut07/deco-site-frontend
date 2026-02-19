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
  const { enabled = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (enabled === false) {
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
  }, [enabled, fetcher]);

  useEffect(() => {
    if (enabled === false) {
      setData(initialData);
      setIsLoading(false);
      return;
    }
    refetch();
  }, [enabled, refetch]);

  return { data, isLoading, error, refetch };
};

export const usePortfolioItems = (page = 1, pageSize = 12, opts = {}) => {
  const fetcher = useCallback(
    () => fetchPortfolioItems(page, pageSize),
    [page, pageSize],
  );
  return useFetch(fetcher, [page, pageSize], opts);
};

export const usePortfolioItem = (id) => {
  const fetcher = useCallback(() => fetchPortfolioItem(id), [id]);
  return useFetch(fetcher, [id], { enabled: !!id });
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
  });
};

// Categories API
export const useCategories = () => {
  useFetch(useCallback(fetchCategories, []), []);
};

// Services API
export const useServices = () => {
  useFetch(useCallback(fetchServices, []), []);
};

// Business Info API
export const useBusinessInfo = () => {
  useFetch(useCallback(fetchBusinessInfo, []), []);
};

export default api;
export { api };
