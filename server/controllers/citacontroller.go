package controllers

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
)

func GetAllCitas(c *gin.Context) {
	var citas []models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor.Especialidad").Preload("Especialidad").Find(&citas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": citas})
}

func GetCita(c *gin.Context) {
	var cita models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor.Especialidad").Preload("Especialidad").First(&cita, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cita})
}

// obtener citas en estado='pendiente' dado el número de licencia de un médico
func GetCitasPendientesporLicenciaDoctor(c *gin.Context) {
	licenciaDoctor := c.Param("licencia_doctor")
	var citas []models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor.Especialidad").Preload("Especialidad").Where("licencia_doctor = ? AND estado = ?", licenciaDoctor, "programada").Find(&citas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": citas})
}

// obteneer citas en estado='pendiente' dado el dni de un paciente
func GetCitasPendientesporDniPaciente(c *gin.Context) {
	dniPaciente := c.Param("dni_paciente")
	var citas []models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor.Especialidad").Preload("Especialidad").Where("dni_paciente = ? AND estado = ?", dniPaciente, "programada").Find(&citas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": citas})
}

// Obtener citas en estado ='completada' dado el dni de un paciente
func GetCitasCulminadasporDniPaciente(c *gin.Context) {
	dniPaciente := c.Param("dni_paciente")
	var citas []models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor.Especialidad").Preload("Especialidad").Where("dni_paciente = ? AND estado = ?", dniPaciente, "completada").Find(&citas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": citas})
}

// Función para obtener un doctor aleatoriamente según id de especialidad
func getRandomDoctorByIdEsp(idEspecialidad uint) models.Doctor {
	var doctoresEspecialidad []models.Doctor
	if result := initializers.DB.Where("especialidad_id = ?", idEspecialidad).Find(&doctoresEspecialidad); result.Error != nil {
		return models.Doctor{}
	}
	if len(doctoresEspecialidad) == 0 {
		if result := initializers.DB.Find(&doctoresEspecialidad); result.Error != nil {
			return models.Doctor{}
		}
	}
	return doctoresEspecialidad[rand.Intn(len(doctoresEspecialidad))]
}

// Función para validar la fecha de la cita
func validarFechaCita(fecha string) bool {
	const formato = "2006-01-02"
	fechaProporcionada, err := time.Parse(formato, fecha)
	if err != nil {
		return false
	}
	fechaActual := time.Now().Truncate(24 * time.Hour)

	return !fechaProporcionada.Before(fechaActual)
}

func CreateCita(c *gin.Context) {
	//Extraer los datos del JSON
	var citaJSON modelsApi.CitaGet
	if err := c.ShouldBindJSON(&citaJSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Validar la fecha de la cita
	if !validarFechaCita(citaJSON.Fecha) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La fecha de la cita no es válida"})
		return
	}

	var citaBD models.Cita
	citaBD.DniPaciente = citaJSON.DniPaciente
	citaBD.Fecha = citaJSON.Fecha
	citaBD.EspecialidadId = citaJSON.EspecialidadId
	citaBD.Motivo = citaJSON.Motivo
	citaBD.Hora = citaJSON.Fecha + " " + citaJSON.Hora + ":" + citaJSON.Minuto + ":00"
	citaBD.Estado = "programada"

	//Obtener un doctor aleatorio según la especialidad
	var doctor models.Doctor = getRandomDoctorByIdEsp(citaBD.EspecialidadId)
	citaBD.LicenciaDoctor = doctor.NumeroLicencia

	if result := initializers.DB.Create(&citaBD); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": citaBD, "message": "Cita creada!"})
}

func UpdateCita(c *gin.Context) {
	//Recuperar datos de JSON
	var citaJSON modelsApi.CitaGet
	if err := c.ShouldBindJSON(&citaJSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cita models.Cita

	if result := initializers.DB.First(&cita, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// cita.DniPaciente = citaJSON.DniPaciente
	cita.Fecha = citaJSON.Fecha
	cita.EspecialidadId = citaJSON.EspecialidadId
	cita.Motivo = citaJSON.Motivo
	cita.Hora = citaJSON.Fecha + " " + citaJSON.Hora + ":" + citaJSON.Minuto + ":00"

	if cita.EspecialidadId != citaJSON.EspecialidadId {
		var doctoresEspecialidad []models.Doctor
		if result := initializers.DB.Where("especialidad_id = ?", citaJSON.EspecialidadId).Find(&doctoresEspecialidad); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
		if len(doctoresEspecialidad) == 0 {
			if result := initializers.DB.Find(&doctoresEspecialidad); result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
				return
			}
		}

		var numerosLicencia []string
		for _, doctor := range doctoresEspecialidad {
			numerosLicencia = append(numerosLicencia, doctor.NumeroLicencia)
		}
		cita.LicenciaDoctor = numerosLicencia[rand.Intn(len(numerosLicencia))]
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&cita).Omit("created_at").Updates(&cita); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cita, "message": "Cita actualizada!"})
}

func DeleteCita(c *gin.Context) {
	var cita models.Cita
	if result := initializers.DB.First(&cita, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}
	cita.Estado = "cancelada"

	if result := initializers.DB.Model(&cita).Omit("created_at").Updates(&cita); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
