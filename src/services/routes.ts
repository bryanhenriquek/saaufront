import { authApi, publicApi } from "./api";

// Sem token
export const login = async (data: FormData) => {
  const res = await publicApi.post("login/", data);
  return res.data;
};

export const register = async (data: FormData) => {
  const res = await publicApi.post("users/create/", data);
  return res.data;
};

// Token test2
export const changePassword = async (data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  const res = await authApi.put("reset_password/", data);
  return res.data;
};

export const listUsers = async () => {
  const res = await authApi.get("users/listUser/");
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await authApi.delete(`users/deleteUser/${id}/`);
  return res.data;
};

export const getUser = async (id: number) => {
  const res = await authApi.get(`users/${id}/`);
  return res.data;
};

export const updateUserStatus = async (id: number) => {
  const res = await authApi.put(`users/${id}/toggle-active/`);
  return res.data;
};
