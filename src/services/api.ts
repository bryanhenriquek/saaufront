import axios from "axios";
//import toast from 'react-hot-toast';

//import { User } from '@/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (config.url?.endsWith("login/")) {
      return config;
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export const login = async (data: FormData) => {
  const res = await api.post("login/", data);
  return res.data;
};

export const register = async (data: FormData) => {
  const res = await api.post("users/create/", data);
  return res.data;
};

export default api;