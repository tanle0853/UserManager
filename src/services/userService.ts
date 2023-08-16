import { user } from "@/interfaces/user";
import { AxiosResponse } from "axios";
import axios from "./axios";

export const getusers = async (): Promise<AxiosResponse<user[]>> =>
  await axios.get("/user");

export const getuser = async (id: string): Promise<AxiosResponse<user>> =>
  await axios.get(`/user/${id}`);

export const createuser = async (user: user): Promise<AxiosResponse> =>
  await axios.post("/user", user);

export const updateuser = async (
  id: string,
  newuser: user
): Promise<AxiosResponse<user>> => await axios.put(`/user/${id}`, newuser);

export const deleteuser = async (id: string): Promise<AxiosResponse> =>
  await axios.delete(`/user/${id}`);
