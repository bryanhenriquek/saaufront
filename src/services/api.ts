import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

export const authApi = axios.create({
  baseURL: API_BASE_URL,
});

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error: AxiosError<{ error?: string; detail?: string }>) => {
  const backendMessage =
    error.response?.data?.error ||
    error.response?.data?.detail ||
    error.message ||
    "Ocorreu um erro inesperado";

  toast.error(backendMessage);

  (error as AxiosError & { customMessage?: string }).customMessage = backendMessage;

  return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, handleError);
publicApi.interceptors.response.use((res) => res, handleError);
