import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getUsers = () => documentApi.get("usuarios/");
export const getUser = (id: string) => documentApi.get(`usuarios/${id}/`);
