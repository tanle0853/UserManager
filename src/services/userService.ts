import { user } from "@/interfaces/user";

import axios, { AxiosInstance, AxiosResponse } from "axios";

interface LoginData {
  username: string;
  password: string;
}

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // Đảm bảo bạn đã cấu hình biến môi trường VUE_APP_API_BASE_URL
});

export const getusers = async (): Promise<AxiosResponse<user[]>> =>
  axiosInstance.get("/user");

export const getuser = async (id: string): Promise<AxiosResponse<user>> =>
  axiosInstance.get(`/user/${id}`);

export const createuser = async (user: user): Promise<AxiosResponse> =>
  axiosInstance.post("/user", user);

export const updateuser = async (
  id: string,
  newuser: user
): Promise<AxiosResponse<user>> => axiosInstance.put(`/user/${id}`, newuser);

export const deleteuser = async (id: string): Promise<AxiosResponse> =>
  axiosInstance.delete(`/user/${id}`);

export const loginUser = async (loginData: LoginData): Promise<AxiosResponse> => {
  return axiosInstance.post("/login", loginData);
};

