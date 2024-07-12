package modelsservice

type AsegurarPersonalGetService struct {
	DatosPersonal []DatosAsegurarPersonalGetService
	TotalAnios    *int
}

type DatosAsegurarPersonalGetService struct {
	DatosPacienteGetService
	TipoSeguro *string
}
