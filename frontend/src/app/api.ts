import axios, { type AxiosResponse } from 'axios';
import type { SimulationInputParams, SimulationDetail, SimulationHistoryItem } from './types/simulation';

const API_BASE_URL = '/api';

// Helper function to get CSRF token from cookies
const getCsrfToken = (): string | null => {
    const name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
    }
    return null;
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for sending session cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add CSRF token to safe methods
apiClient.interceptors.request.use(config => {
    const csrfToken = getCsrfToken();
    if (csrfToken && config.method !== 'get' && config.method !== 'head' && config.method !== 'options') {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

// --- Auth API ---

export const fetchCsrfToken = (): Promise<AxiosResponse> => {
    // This request is primarily to ensure the csrftoken cookie is set
    return apiClient.get('/auth/csrf-token/');
};

// --- Simulation API ---

export const createSimulation = (data: SimulationInputParams): Promise<AxiosResponse<SimulationDetail>> => {
    return apiClient.post('/simulations/create/', data);
};

export const fetchHistory = (): Promise<AxiosResponse<SimulationHistoryItem[]>> => {
    return apiClient.get('/simulations/history/');
};

export const fetchSimulationDetail = (id: number): Promise<AxiosResponse<SimulationDetail>> => {
    return apiClient.get(`/simulations/detail/${id}/`);
};

export default apiClient;