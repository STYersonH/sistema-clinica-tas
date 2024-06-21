import axios from 'axios'

const documentApi = axios.create({
    baseURL: "http://localhost:8080/citas/"
})

export const getCitasProgramadasDoctor = (numeroLicencia:string) => documentApi.get(`pendientedoctor/${numeroLicencia}/`)