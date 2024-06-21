import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getEspecialidades = () => documentApi.get("especialidades/");
