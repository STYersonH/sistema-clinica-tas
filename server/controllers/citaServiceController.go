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
	if !validarFechaCita(*ReserveCitaJSON.DatosCita.Fecha) {
		c.JSON(400, gin.H{"error": "Fecha de la cita no válida"})
		return
	}
	//Validar campo de minuto de la cita
	if ReserveCitaJSON.DatosCita.Minuto == nil || *ReserveCitaJSON.DatosCita.Minuto == "" {
		c.JSON(400, gin.H{"error": "Minuto de la cita no válido"})
		return
	}
	//Validar campo especialidad
	var especialidadJSON models.Especialidad
	if result := initializers.DB.Where("nombre = ?", ReserveCitaJSON.DatosCita.Especialidad).First(&especialidadJSON); result.Error != nil {
		c.JSON(400, gin.H{"error": "Especialidad no válida"})
		return
	}
	//Validar campo de motivo
	if ReserveCitaJSON.DatosCita.Motivo == nil || *ReserveCitaJSON.DatosCita.Motivo == "" {
		c.JSON(400, gin.H{"error": "Motivo de la cita no válido"})
		return
	}

	//Analizar si el paciente ya existe en la BD
	var pacienteDeReservarCita models.Paciente

	if result := initializers.DB.Where("dni = ?", ReserveCitaJSON.DatosPaciente.DniPaciente).First(&pacienteDeReservarCita); result.Error != nil {

		// Validar campos
		if ReserveCitaJSON.DatosPaciente.FechaNacimiento == nil || *ReserveCitaJSON.DatosPaciente.FechaNacimiento == "" {
			c.JSON(400, gin.H{"error": "Fecha de nacimiento vacía"})
			return
		}
		if ReserveCitaJSON.DatosPaciente.Genero == nil || *ReserveCitaJSON.DatosPaciente.Genero == "" {
			c.JSON(400, gin.H{"error": "Género vacío"})
			return
		}
		if !validarFechaNacimiento(*ReserveCitaJSON.DatosPaciente.FechaNacimiento) {
			c.JSON(400, gin.H{"error": "Fecha de nacimiento inválida"})
			return
		}
		//Validar campo de género
		if !validarGenero(*ReserveCitaJSON.DatosPaciente.Genero) {
			c.JSON(400, gin.H{"error": "Género no válido"})
			return
		}
		// Crear paciente y cuenta
		// var newPaciente models.Paciente
		pacienteDeReservarCita.Dni = ReserveCitaJSON.DatosPaciente.DniPaciente
		pacienteDeReservarCita.Nombres = ReserveCitaJSON.DatosPaciente.Nombres
		pacienteDeReservarCita.Apellido_paterno = ReserveCitaJSON.DatosPaciente.ApellidoPaterno
		pacienteDeReservarCita.Apellido_materno = ReserveCitaJSON.DatosPaciente.ApellidoMaterno
		pacienteDeReservarCita.Genero = ReserveCitaJSON.DatosPaciente.Genero
		pacienteDeReservarCita.Direccion = ReserveCitaJSON.DatosPaciente.Direccion
		pacienteDeReservarCita.Email = ReserveCitaJSON.DatosPaciente.Email
		pacienteDeReservarCita.Telefono = ReserveCitaJSON.DatosPaciente.Telefono
		pacienteDeReservarCita.Ocupacion = ReserveCitaJSON.DatosPaciente.Ocupacion
		pacienteDeReservarCita.FechaNacimiento = ReserveCitaJSON.DatosPaciente.FechaNacimiento

		crearPaciente(pacienteDeReservarCita, c)
		crearCuentaPaciente(pacienteDeReservarCita, c, false)
	}

	// Crear cita
	var newCita models.Cita
	newCita.DniPaciente = *ReserveCitaJSON.DatosPaciente.DniPaciente
	//Obtener Doctor
	var doctor models.Doctor = getRandomDoctorByIdEsp(especialidadJSON.ID)
	newCita.LicenciaDoctor = doctor.NumeroLicencia
	newCita.Fecha = *ReserveCitaJSON.DatosCita.Fecha
	newCita.Hora = *ReserveCitaJSON.DatosCita.Fecha + " " + *ReserveCitaJSON.DatosCita.Hora + ":" + *ReserveCitaJSON.DatosCita.Minuto + ":00"
	newCita.EspecialidadId = especialidadJSON.ID
	newCita.Motivo = *ReserveCitaJSON.DatosCita.Motivo
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
	ReserveCitaPost.DatosMedico.TelefonoMedico = doctor.Telefono
	ReserveCitaPost.DatosPaciente.DniPaciente = *pacienteDeReservarCita.Dni
	ReserveCitaPost.DatosPaciente.NombresPaciene = *pacienteDeReservarCita.Nombres
	ReserveCitaPost.DatosPaciente.ApellidosPaciente = *pacienteDeReservarCita.Apellido_paterno + " " + *pacienteDeReservarCita.Apellido_materno

	c.JSON(201, gin.H{"data": ReserveCitaPost})
}
