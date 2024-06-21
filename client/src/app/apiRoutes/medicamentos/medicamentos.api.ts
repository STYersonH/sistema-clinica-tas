import axios from 'axios'

const documentApi = axios.create({
    baseURL: "http://localhost:8080/medicamentos/"
})

export const getMedicamentos = () => documentApi.get(``)