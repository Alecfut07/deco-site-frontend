import axios from 'axios';

// Configure base URL - adjust this to match Django backend
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Portfolio Items API
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