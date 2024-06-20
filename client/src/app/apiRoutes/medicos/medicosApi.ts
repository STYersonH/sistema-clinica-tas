import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getMedicos = () => documentApi.get("doctors/");
export const getMedico = (id: string) => documentApi.get(`doctors/${id}/`);
export const postMedico = (data: any) => documentApi.post("doctors/", data);
export const login = (data: any) => documentApi.post("auth/", data);
export const updateMedico = (id: string, data: any) =>
  documentApi.put(`doctors/${id}/`, data);
export const deleteMedico = (id: string) =>
  documentApi.delete(`doctors/${id}/`);
