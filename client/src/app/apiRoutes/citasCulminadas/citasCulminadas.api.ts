import axios from 'axios'

const documentApi = axios.create({
    baseURL: "http://localhost:8080/citascompletadas/"
})

export const getCitasCuliminadasPaciente = (dniPaciente:string) => documentApi.get(`culminadopaciente/${dniPaciente}/`)