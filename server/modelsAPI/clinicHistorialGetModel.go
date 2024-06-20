package modelsApi

type ClinicHistorialGet struct {
	IdCita           int
	Diagnostico      string
	DniPaciente      string
	LicenciaMedico   string
	FechaDiagnostico string
	Tratamientos     []Treatment
}
