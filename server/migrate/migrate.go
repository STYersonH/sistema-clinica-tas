package main

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}
func main() {
	initializers.DB.AutoMigrate(
		&models.Paciente{},
		&models.Seguro{},
		&models.Asegurado{},
		&models.Cita{},
		&models.Doctor{},
		&models.Especialidad{},
		&models.HistorialClinico{},
		&models.Medicamento{},
		&models.RecetaDetalle{},
		&models.RecetaMedica{},
		&models.Tratamiento{},
		&models.Usuario{},
	)
}
