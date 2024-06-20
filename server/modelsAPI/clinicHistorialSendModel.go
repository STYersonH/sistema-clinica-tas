package modelsApi

type ClinicHistorialSend struct {
	Diagnostico      string
	FechaDiagnostico string
	Medico           Medico
	Tratamientos     []Treatment
}
