import axios from "axios";
import { user } from "@/interfaces/user";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios";

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
