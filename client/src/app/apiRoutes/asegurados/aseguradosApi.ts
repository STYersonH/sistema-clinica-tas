import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/asegurados",
});

export const getAsegurados = () => documentApi.get("/");
export const getInfoAsegurado = (dni: string) =>
  documentApi.get(`/dni/${dni}/`);
export const getInfoSeguro = (dni: string) =>
  documentApi.get(`/seguro/${dni}/`);
export const asegurar = (data: any) => documentApi.post("/", data);
