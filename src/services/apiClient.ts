// services/apiClient.ts
import { getCookie } from '@/helpers/cookies';

// Use the proxy endpoint for API requests
const API_URL = '/api';

export const apiClient = {
  get: async (endpoint: string, params?: Record<string, any>) => {
    try {
      const token = getCookie('token');
      
      // Build query string
      let url = `${API_URL}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      // Only add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },
  
  post: async (endpoint: string, body: any) => {
    try {
      const token = getCookie('token');
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      
      // Only add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }
};