import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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

export const changePassword = async (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const res = await api.put('reset_password/', data);
  return res.data;
};

export const listUsers = async () => {
  const res = await api.get("users/listUser/");
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`users/deleteUser/${id}/`);
  return res.data;
};

export const getUser = async (id: number) => {
  const res = await api.get(`users/${id}/`);
  return res.data;
};

export const updateUserStatus = async (id: number) => {
  const response = await api.put(
    `users/${id}/toggle-active/`,
  );
  return response.data;
};

export default api;
