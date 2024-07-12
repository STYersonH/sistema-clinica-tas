package modelsservice

type ReserveCitaGetService struct {
	DatosCita     DatosCitaGetService
	DatosPaciente DatosPacienteGetService
}

type DatosCitaGetService struct {
	Fecha        *string
	Hora         *string
	Minuto       *string
	Especialidad *string
	Motivo       *string
}

type DatosPacienteGetService struct {
	DniPaciente     *string
	Nombres         *string
	ApellidoPaterno *string
	ApellidoMaterno *string
	Genero          *string
	Direccion       *string
	Email           *string
	Telefono        *string
	Ocupacion       *string
	FechaNacimiento *string
}
