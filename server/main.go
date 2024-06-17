package main

import (
	"github.com/asterfy/tis-clinic/controllers"
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	r.POST("/clinic/api/auth/", controllers.ValidateLogin)

	r.Run()
}

// REQUISITOS FUNCIONALES
// 	Mantenimiento (médico, paciente, cita, asegurado, receta)
// 	Proceso (Reserva de cita, Historial clínico)
