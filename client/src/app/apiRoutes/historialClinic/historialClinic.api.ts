import axios from 'axios'

const documentApi = axios.create({
    baseURL: "http://localhost:8080/historiales"
})

export const getHistorialUsuario = (id:string) => documentApi.get(`/?ID=${id}`)
export const createHistorialClinico = (data:any) => documentApi.post(`/`, data)
