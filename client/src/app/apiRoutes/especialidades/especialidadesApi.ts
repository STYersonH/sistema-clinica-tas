import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const getUsers = () => documentApi.get("especialidades/");
