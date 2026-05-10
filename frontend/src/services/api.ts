import { getAccessToken } from './token';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  get: async (url: string) => {
    const response = await fetch(`${API_URL}${url}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
   patch: async (url: string, data: any) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (url: string) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (response.status !== 204) {
       return handleResponse(response);
    }
    return;
  },
   postForm: async (url: string, data: FormData) => {
    const token = getAccessToken();
    const headers: HeadersInit = {};
     if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers,
      body: data,
    });
    return handleResponse(response);
  },
  patchForm: async (url: string, data: FormData) => {
    const token = getAccessToken();
    const headers: HeadersInit = {};
     if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method: 'PATCH',
      headers: headers,
      body: data,
    });
    return handleResponse(response);
  },
};
