package modelsApi

type InfoPatient struct {
	TipoSeguro        *string
	Nombres           string
	Apellidos         string
	FechaNacimiento   string
	DNI               string
	NroCelular        string
	Genero            string
	DireccionVivienda string
	Ocupacion         *string
	Historiales       []HistorialInfoPatient
}

type HistorialInfoPatient struct {
	IdCita         int
	Dia            string
	Hora           string
	NombreDoctor   string
	ApellidoDoctor string
}
