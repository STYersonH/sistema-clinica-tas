import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getHistorialUsuario = (id: string) =>
  documentApi.get(`historiales/?ID=${id}`);
export const createHistorialClinico = (data: any) =>
  documentApi.post(`historiales/`, data);
export const obtenerDatosDeUnaConsultaRealizada = (idCita: string) =>
  documentApi.get(`citaHistorial/?IdCita=${idCita}`);
