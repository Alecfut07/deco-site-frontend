import axios from 'axios';
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

// Configure base URL - adjust this to match Django backend
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Portfolio Items API with TanStack Query
export const usePortfolioItems = (page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-items', page, pageSize],
        queryFn: () => api.get(`/portfolio-items/?page=${page}&page_size=${pageSize}`).then(res => res.data),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const usePortfolioItem = (id) => {
    return useQuery({
        queryKey: ['portfolio_item', id],
        queryFn: () => api.get(`/portfolio-items/${id}/`).then (res => res.data),
        enabled: !!id,
    });
};

export const useSearchPortfolioItems = (query, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-search', query, page, pageSize],
        queryFn: () => api.get(`/portfolio-items/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`).then(res => res.data),
        enabled: !!query && query.length > 2,
        staleTime: 5 * 60 * 1000, // 2 minutes for search results
    });
};

export const useFilterPortfolioItems = (filters, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-filter', filters, page, pageSize],
        queryFn: () => {
            const params = new URLSearchParams({ page, page_size: pageSize });
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            return api.get(`/portfolio-items/filter/?${params}`).then(res => res.data);
        },
        enabled: Object.values(filters).some(value => value),
    });
};

export const useSearchAndFilter = (query, filters, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-combined', query, filters, page, pageSize],
        queryFn: () => {
            const params = new URLSearchParams({ page, page_size: pageSize });
            if (query) params.append('q', query);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            return api.get(`/portfolio-items/combined/?${params}`).then(res => res.data);
        },
        enabled: !!query || Object.values(filters).some(value => value),
    });
};

export const usePortfolioByCategory = (category, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-category', category, page, pageSize],
        queryFn: () => api.get(`/portfolio-items/by_category/?category=${category}&page=${page}&page_size=${pageSize}`).then(res => res.data),
        enabled: !!category,
    });
};

// Categories API
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => api.get('/categories/').then(res => res.data),
        staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    });
};

// Services API
export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: () => api.get('/services/').then(res => res.data),
        staleTime: 30 * 60 * 1000, // 30 minutes - services don't change often
    });
};

// Legacy API functions (for backward compatibility)
export const portfolioAPI = {
    // Get all portfolio items with pagination
    getPortfolioItems: (page = 1, pageSize = 12) =>
        api.get(`/portfolio-items/?page=${page}&page_size=${pageSize}`),

    // Get specific portfolio item
    getPortfolioItem: (id) =>
        api.get(`/portfolio-items/${id}/`),

    // Search portfolio items
    searchPortfolioItems: (query, page = 1, pageSize = 12) =>
        api.get(`/portfolio-items/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`),

    // Filter portfolio items
    filterPortfolioItems: (filters, page = 1, pageSize = 12) => {
        const params = new URLSearchParams({ page, page_size: pageSize });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return api.get(`/portfolio-items/filter/?${params}`);
    },

    // Combined search and filter
    searchAndFilter: (query, filters, page = 1, pageSize = 12) => {
        const params = new URLSearchParams({ page, page_size: pageSize });
        if (query) params.append('q', query);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return api.get(`/portfolio-items/search-filter/?${params}`);
    },

    // Get portfolio items by category
    getByCategory: (category, page = 1, pageSize = 12) => 
        api.get(`/portfolio-items/by_category/?category=${category}&page=${page}&page_size=${pageSize}`),
}

// Categories API
export const categoriesAPI = {
    getCategories: () => api.get('/categories/'),
};

// Services API
export const servicesAPI = {
    getServices: () => api.get('/services/'),
};

export default api;