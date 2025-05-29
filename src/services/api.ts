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

const handleError = (error: AxiosError<Record<string, string[] | string>>) => {
  const data = error.response?.data;

  let backendMessage: string | undefined;

  // Tenta usar campos genéricos como 'error' ou 'detail'
  if (data && typeof data === 'object') {
    const errorField = data.error;
    const detailField = data.detail;

    if (typeof errorField === 'string') backendMessage = errorField;
    else if (typeof detailField === 'string') backendMessage = detailField;
  }

  // Se ainda não tem mensagem, tenta extrair a primeira mensagem de campo
  if (!backendMessage && typeof data === 'object') {
    const firstKey = Object.keys(data)[0];
    const fieldError = data[firstKey];

    if (Array.isArray(fieldError)) {
      backendMessage = fieldError[0];
    } else if (typeof fieldError === 'string') {
      backendMessage = fieldError;
    }
  }

  // fallback
  if (!backendMessage) {
    backendMessage = error.message || 'Ocorreu um erro inesperado';
  }

  toast.error(backendMessage); // garantido string agora

  (error as AxiosError & { customMessage?: string }).customMessage = backendMessage;

  return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, handleError);
publicApi.interceptors.response.use((res) => res, handleError);
