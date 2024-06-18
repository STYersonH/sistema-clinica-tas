import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getPacientes = () => documentApi.get("pacientes/");
export const getPaciente = (id: string) => documentApi.get(`pacientes/${id}/`);
export const postPaciente = (data: any) => documentApi.post("pacientes/", data);
export const updatePaciente = (id: string, data: any) =>
  documentApi.put(`pacientes/${id}/`, data);
export const deletePaciente = (id: string) =>
  documentApi.delete(`pacientes/${id}/`);
