package controllers

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsservice "github.com/asterfy/tis-clinic/modelsService"
	"github.com/gin-gonic/gin"
)

func ReservarCitaService(c *gin.Context) {
	//Recuperar datos json
	var ReserveCitaJSON modelsservice.ReserveCitaGetService

	if err := c.ShouldBindJSON(&ReserveCitaJSON); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	//Validar fecha de la cita
	if !validarFechaCita(ReserveCitaJSON.DatosCita.Fecha) {
		c.JSON(400, gin.H{"error": "Fecha de la cita no válida"})
		return
	}
	//Validar campo especialidad
	var especialidadJSON models.Especialidad
	if result := initializers.DB.Where("nombre = ?", ReserveCitaJSON.DatosCita.Especialidad).First(&especialidadJSON); result.Error != nil {
		c.JSON(400, gin.H{"error": "Especialidad no válida"})
		return
	}

	//Analizar si el paciente ya existe en la BD
	var pacienteDeReservarCita models.Paciente

	if result := initializers.DB.Where("dni = ?", ReserveCitaJSON.DatosPaciente.DniPaciente).First(&pacienteDeReservarCita); result.Error != nil {
		// Validar campos
		if !validarFechaNacimiento(ReserveCitaJSON.DatosPaciente.FechaNacimiento) {
			c.JSON(400, gin.H{"error": "Fecha de nacimiento inválida"})
			return
		}
		//Validar campo de género
		if !validarGenero(ReserveCitaJSON.DatosPaciente.Genero) {
			c.JSON(400, gin.H{"error": "Género no válido"})
			return
		}
		// Crear paciente y cuenta
		var newPaciente models.Paciente
		*newPaciente.Dni = ReserveCitaJSON.DatosPaciente.DniPaciente
		*newPaciente.Nombres = ReserveCitaJSON.DatosPaciente.Nombres
		*newPaciente.Apellido_paterno = ReserveCitaJSON.DatosPaciente.ApellidoPaterno
		*newPaciente.Apellido_materno = ReserveCitaJSON.DatosPaciente.ApellidoMaterno
		*newPaciente.Genero = ReserveCitaJSON.DatosPaciente.Genero
		*newPaciente.Direccion = *ReserveCitaJSON.DatosPaciente.Direccion
		*newPaciente.Email = *ReserveCitaJSON.DatosPaciente.Email
		*newPaciente.Telefono = ReserveCitaJSON.DatosPaciente.Telefono
		*newPaciente.Ocupacion = *ReserveCitaJSON.DatosPaciente.Ocupacion
		*newPaciente.FechaNacimiento = ReserveCitaJSON.DatosPaciente.FechaNacimiento

		crearPaciente(newPaciente, c)
		crearCuentaPaciente(newPaciente, c)
	}

	// Crear cita
	var newCita models.Cita
	newCita.DniPaciente = ReserveCitaJSON.DatosPaciente.DniPaciente
	//Obtener Doctor
	var doctor models.Doctor = getRandomDoctorByIdEsp(especialidadJSON.ID)
	newCita.LicenciaDoctor = doctor.NumeroLicencia
	newCita.Fecha = ReserveCitaJSON.DatosCita.Fecha
	newCita.Hora = ReserveCitaJSON.DatosCita.Fecha + " " + ReserveCitaJSON.DatosCita.Hora + ":" + ReserveCitaJSON.DatosCita.Minuto + ":00"
	newCita.EspecialidadId = especialidadJSON.ID
	newCita.Motivo = ReserveCitaJSON.DatosCita.Motivo
	newCita.Estado = "programada"

	if result := initializers.DB.Create(&newCita); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	//Construir respuesta
	var ReserveCitaPost modelsservice.ReserveCitaPostService
	ReserveCitaPost.Mensaje = "Cita creada exitosamente"
	ReserveCitaPost.DatosCita.Motivo = newCita.Motivo
	ReserveCitaPost.DatosCita.Fecha = newCita.Fecha
	ReserveCitaPost.DatosCita.Hora = newCita.Hora[10:16]
	ReserveCitaPost.DatosMedico.NombresMedico = doctor.Nombres
	ReserveCitaPost.DatosMedico.ApellidosMedico = doctor.Apellido_paterno + " " + doctor.Apellido_materno
	ReserveCitaPost.DatosPaciente.DniPaciente = *pacienteDeReservarCita.Dni
	ReserveCitaPost.DatosPaciente.NombresPaciene = *pacienteDeReservarCita.Nombres
	ReserveCitaPost.DatosPaciente.ApellidosPaciente = *pacienteDeReservarCita.Apellido_paterno + " " + *pacienteDeReservarCita.Apellido_materno

	c.JSON(201, gin.H{"data": ReserveCitaPost})
}
