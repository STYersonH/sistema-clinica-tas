import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080",
});

export const postCita = (data: any) => documentApi.post("/citas/", data);
export const obtenerInfoCitaPorDNIPaciente = (dni: string) =>
  documentApi.get(`/citaspendientes/pendientepaciente/${dni}/`);
export const putCita = (id: string, data: any) =>
  documentApi.put(`/citas/${id}/`, data);
