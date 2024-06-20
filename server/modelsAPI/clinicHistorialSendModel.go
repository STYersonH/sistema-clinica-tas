package modelsApi

type ClinicHistorialSend struct {
	IdCita       int
	Diagnostico  string
	Medico       Medico
	Tratamienots []Treatment
}
