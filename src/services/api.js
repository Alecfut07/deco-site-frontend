import axios from 'axios';
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

// Configure base URL - adjust this to match Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to get full image URL
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

// Portfolio Items API with TanStack Query
export const usePortfolioItems = (page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-items', page, pageSize],
        queryFn: async () => {
            const response = await api.get(`/api/portfolio-items/?page=${page}&page_size=${pageSize}`);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes (matches backend cache)
    });
};

export const usePortfolioItem = (id) => {
    return useQuery({
        queryKey: ['portfolio_item', id],
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
        queryKey: ['portfolio-search', query, page, pageSize],
        queryFn: async () => {
            const response = await api.get(`/api/gallery/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
            return response.data;
        },
        enabled: !!query && query.length > 2,
        staleTime: 2 * 60 * 1000,
    });
};

// Filter by category
export const useFilterPortfolio = (category, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-filter', category, page, pageSize],
        queryFn: async () => {
            const response = await api.get(`/api/gallery/filter/?category=${category}&page=${page}&page_size=${pageSize}`);
            return response.data;
        },
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
    });
};

// Combined search and filter
export const useSearchAndFilter = (query, category, page = 1, pageSize = 12) => {
    return useQuery({
        queryKey: ['portfolio-combined', query, category, page, pageSize],
        queryFn: async () => {
            const params = new URLSearchParams({ page: page.toString(), page_size: pageSize.toString() });
            if (query) params.append('q', query);
            if (category) params.append('category', category);
            const response = await api.get(`/api/gallery/combined/?${params}`);
            return response.data;
        },
        enabled: !!query || !!category,
        staleTime: 2 * 60 * 1000,
    });
};

// Categories API
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories/');
            return response.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};

// Services API
export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await api.get('/services/');
            return response.data;
        },
        staleTime: 30 * 60 * 1000, // 30 minutes - services don't change often
    });
};

// Business Info API
export const useBusinessInfo = () => {
    return useQuery({
        queryKey: ['business-info'],
        queryFn: async () => {
            const response = await api.get(`/api/business-info/`);
            return response.data;
        },
        staleTime: 60 * 60 * 1000, // 1 hour
    });
};

export default api;