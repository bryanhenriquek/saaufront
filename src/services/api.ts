import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; detail?: string }>) => {
    const backendMessage =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "Ocorreu um erro inesperado";

    toast.error(backendMessage);

    (error as AxiosError & { customMessage?: string }).customMessage = backendMessage;

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

export const listUsers = async () => {
  const res = await api.get("users/listUser/");
  return res.data;
}

export const deleteUser = async (id: number) => {
  const res = await api.delete(`users/deleteUser/${id}/`);
  return res.data;
}

export default api;