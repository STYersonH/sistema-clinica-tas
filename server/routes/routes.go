// routes/routes.go

package routes

import (
	"github.com/asterfy/tis-clinic/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Grupo de rutas para pacientes
	asegurados := router.Group("/asegurados")
	{
		asegurados.GET("/", controllers.GetAllAsegurados)
		asegurados.GET("/:id/", controllers.GetAsegurado)
		asegurados.GET("/dni/:dni_asegurado/", controllers.GetAseguradoporDNI)
		asegurados.GET("/seguro/:dni_asegurado/", controllers.GetSeguroporDNI)
		asegurados.POST("/", controllers.CreateAsegurado)
		asegurados.PUT("/:id/", controllers.UpdateAsegurado)
		asegurados.DELETE("/:id/", controllers.DeleteAsegurado)
	}
	citas := router.Group("/citas")
	{
		citas.GET("/", controllers.GetAllCitas)
		citas.GET("/:id/", controllers.GetCita)
		citas.GET("/pendientedoctor/:licencia_doctor", controllers.GetCitasPendientesporLicenciaDoctor)
		citas.GET("/pendientepaciente/:dni_paciente", controllers.GetCitasPendientesporDniPaciente)
		citas.POST("/", controllers.CreateCita)
		citas.PUT("/:id/", controllers.UpdateCita)
		citas.DELETE("/:id/", controllers.DeleteCita)
	}
	doctores := router.Group("/doctores")
	{
		doctores.GET("/", controllers.GetAllDoctors)
		doctores.GET("/:id/", controllers.GetDoctor)
		doctores.POST("/", controllers.CreateDoctor)
		doctores.PUT("/:id/", controllers.UpdateDoctor)
		doctores.DELETE("/:id/", controllers.DeleteDoctor)
	}
	especialidades := router.Group("/especialidades")
	{
		especialidades.GET("/", controllers.GetAllEspecialidades)
		especialidades.GET("/:id/", controllers.GetEspecialidad)
		especialidades.POST("/", controllers.CreateEspecialidad)
		especialidades.PUT("/:id/", controllers.UpdateEspecialidad)
		especialidades.DELETE("/:id/", controllers.DeleteEspecialidad)
	}
	historiales := router.Group("/historiales")
	{
		historiales.GET("/", controllers.GetAllHistoriales)
		historiales.GET("/:id/", controllers.GetHistorial)
		historiales.POST("/", controllers.CreateHistorial)
		historiales.PUT("/:id/", controllers.UpdateHistorial)
		historiales.DELETE("/:id/", controllers.DeleteHistorial)
	}
	medicamentos := router.Group("/medicamentos")
	{
		medicamentos.GET("/", controllers.GetAllMedicamentos)
		medicamentos.GET("/:id/", controllers.GetMedicamento)
		medicamentos.POST("/", controllers.CreateMedicamento)
		medicamentos.PUT("/:id/", controllers.UpdateMedicamento)
		medicamentos.DELETE("/:id/", controllers.DeleteMedicamento)
	}
	pacientes := router.Group("/pacientes")
	{
		pacientes.GET("/", controllers.GetAllPatients)
		pacientes.GET("/:id/", controllers.GetPatient)
		pacientes.POST("/", controllers.CreatePatient)
		pacientes.PUT("/:id/", controllers.UpdatePatient)
		pacientes.DELETE("/:id/", controllers.DeletePatient)
	}
	recetasdetail := router.Group("/recetasdetail")
	{
		recetasdetail.GET("/", controllers.GetAllRecetasdetail)
		recetasdetail.GET("/:id/", controllers.GetRecetadetail)
		recetasdetail.POST("/", controllers.CreateRecetadetail)
		recetasdetail.PUT("/:id/", controllers.UpdateRecetadetail)
		recetasdetail.DELETE("/:id/", controllers.DeleteRecetadetail)
	}
	recetasmedicas := router.Group("/recetasmedicas")
	{
		recetasmedicas.GET("/", controllers.GetAllRecetasmedicas)
		recetasmedicas.GET("/:id/", controllers.GetRecetamedica)
		recetasmedicas.POST("/", controllers.CreateRecetamedica)
		recetasmedicas.PUT("/:id/", controllers.UpdateRecetamedica)
		recetasmedicas.DELETE("/:id/", controllers.DeleteRecetamedica)
	}
	seguros := router.Group("/seguros")
	{
		seguros.GET("/", controllers.GetAllSeguros)
		seguros.GET("/:id/", controllers.GetSeguro)
		seguros.POST("/", controllers.CreateSeguro)
		seguros.PUT("/:id/", controllers.UpdateSeguro)
		seguros.DELETE("/:id/", controllers.DeleteSeguro)
	}
	tratamientos := router.Group("/tratamientos")
	{
		tratamientos.GET("/", controllers.GetAllTratamientos)
		tratamientos.GET("/:id/", controllers.GetTratamiento)
		tratamientos.POST("/", controllers.CreateTratamiento)
		tratamientos.PUT("/:id/", controllers.UpdateTratamiento)
		tratamientos.DELETE("/:id/", controllers.DeleteTratamiento)
	}

	auth := router.Group("/auth")
	{
		auth.POST("/", controllers.ValidateLogin)
	}
	usuarios := router.Group("/usuarios")
	{
		usuarios.GET("/", controllers.GetUsers)
		usuarios.GET("/:id/", controllers.GetUser)
		usuarios.POST("/", controllers.CreateUser)
		usuarios.PUT("/:id/", controllers.ChangePasswordUser)
	}

}
