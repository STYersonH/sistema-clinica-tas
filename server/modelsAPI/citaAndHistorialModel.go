package modelsApi

type CitaHistorial struct {
	CitaDatos        CitaDatos
	DatosDiagnostico ClinicHistorialSend
}

type CitaDatos struct {
	NombrePaciente    string
	ApellidosPaciente string
	DNIPaciente       string
	Dia               string
	Hora              string
	Motivo            string
}
