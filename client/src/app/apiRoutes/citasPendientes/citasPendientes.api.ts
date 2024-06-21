import axios from 'axios'

const documentApi = axios.create({
    baseURL: "http://localhost:8080/citaspendientes/"
})

export const getCitasProgramadasDoctor = (numeroLicencia:string) => documentApi.get(`pendientedoctor/${numeroLicencia}/`)
export const getCitasProgramadasPaciente = (dniPaciente:string) => documentApi.get(`pendientepaciente/${dniPaciente}/`)

