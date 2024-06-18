import axios from "axios";

const documentApi = axios.create({
  baseURL: "http://localhost:8080/",
});

export const login = (data: any) => documentApi.post("auth/", data);
