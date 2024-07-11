package modelsservice

type ReserveCitaPostService struct {
	Mensaje       string
	DatosCita     DatosCitaPostService
	DatosMedico   DatosMedicoPostService
	DatosPaciente DatosPacientePostService
}

type DatosCitaPostService struct {
	Motivo string
	Fecha  string
	Hora   string
}

type DatosPacientePostService struct {
	DniPaciente       string
	NombresPaciene    string
	ApellidosPaciente string
}

type DatosMedicoPostService struct {
	NombresMedico   string
	ApellidosMedico string
	TelefonoMedico  string
}
