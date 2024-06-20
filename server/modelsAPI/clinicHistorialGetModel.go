package modelsApi

type ClinicHistorialGet struct {
	IdCita         int
	DniPaciente    string
	LicenciaDoctor string
	Diagnostico    string
	Tratamienots   []Treatment
}
