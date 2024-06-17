package main

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/routes"
	"github.com/gin-gonic/gin"
)

func init() {
	// Inicializar la conexión a la base de datos
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	// Crear un enrutador Gin
	router := gin.Default()

	// Configurar las rutas
	routes.SetupRoutes(router)

	// Iniciar el servidor Gin
	router.Run(":8080")
}

// REQUISITOS FUNCIONALES
// 	Mantenimiento (médico, paciente, cita, asegurado, receta)
// 	Proceso (Reserva de cita, Historial clínico)
