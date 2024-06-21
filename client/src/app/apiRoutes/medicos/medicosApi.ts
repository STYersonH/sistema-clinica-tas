import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getMedicos = () => documentApi.get("doctores/");
export const getMedico = (id: string) => documentApi.get(`doctores/${id}/`);
export const postMedico = (data: any) => documentApi.post("doctores/", data);
export const login = (data: any) => documentApi.post("auth/", data);
export const updateMedico = (id: string, data: any) =>
  documentApi.put(`doctores/${id}/`, data);
export const deleteMedico = (id: string) =>
  documentApi.delete(`doctores/${id}/`);
