import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/seguros",
});

export const getTiposSeguro = () => documentApi.get("/");
