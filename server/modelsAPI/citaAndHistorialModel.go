package modelsApi

type CitaHistorial struct {
	CitaDatos        CitaDatos
	DatosDiagnostico ClinicHistorialSend
}

type CitaDatos struct {
	Dia    string
	Hora   string
	Motivo string
}
