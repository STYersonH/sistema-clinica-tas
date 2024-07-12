package modelsservice

type AsegurarPersonalPostService struct {
	PersonalAsegurado   []DatosAseguradoPostService
	PersonalNoAsegurado []DatosAseguradoPostService
	PrecioTotal         float64
}

type DatosAseguradoPostService struct {
	Mensaje       string
	DatosPaciente DatosPacienteAseguradoPostService
}

type DatosPacienteAseguradoPostService struct {
	DniAsegurado     string
	Nombres          string
	Apellidos        string
	TipoSeguro       string
	FechaInscripcion string
	FechaVencimiento string
	Precio           float64
}
