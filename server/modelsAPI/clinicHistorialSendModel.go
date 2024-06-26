package modelsApi

type ClinicHistorialSend struct {
	Diagnostico      string
	FechaDiagnostico string
	Medico           Medico
	Tratamientos     []Treatment
}

type Medico struct {
	NombresApellidos string
	Telefono         string
	Especialidad     string
	Email            string
}

type Treatment struct {
	Tipo        string
	Descripcion string
	Receta      []Recipe
}

type Recipe struct {
	NombreMedicamento string
	Dosis             string
	Frecuencia        string
	Duracion          string
}
