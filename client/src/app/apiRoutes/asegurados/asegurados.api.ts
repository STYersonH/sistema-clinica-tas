import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/asegurados",
});

export const getAsegurados = () => documentApi.get("/");