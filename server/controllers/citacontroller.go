package controllers

import (
	"math/rand"
	"net/http"

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
	if result := initializers.DB.Where("dni_paciente = ? AND estado = ?", dniPaciente, "programada").Find(&citas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": citas})
}
func CreateCita(c *gin.Context) {
	//Extraer los datos del JSON
	var citaJSON modelsApi.CitaGet
	if err := c.ShouldBindJSON(&citaJSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var citaBD models.Cita
	citaBD.DniPaciente = citaJSON.DniPaciente
	citaBD.Fecha = citaJSON.Fecha
	citaBD.EspecialidadId = citaJSON.EspecialidadId
	citaBD.Motivo = citaJSON.Motivo
	citaBD.Hora = citaJSON.Fecha + " " + citaJSON.Hora + ":" + citaJSON.Minuto + ":00"
	citaBD.Estado = "programada"

	var doctoresEspecialidad []models.Doctor
	if result := initializers.DB.Where("especialidad_id = ?", citaBD.EspecialidadId).Find(&doctoresEspecialidad); result.Error != nil {
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
	citaBD.LicenciaDoctor = numerosLicencia[rand.Intn(len(numerosLicencia))]

	if result := initializers.DB.Create(&citaBD); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": citaBD, "message": "Cita creada!"})
}

func UpdateCita(c *gin.Context) {
	var cita models.Cita
	if result := initializers.DB.First(&cita, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&cita); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&cita).Omit("created_at").Updates(&cita); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cita})
}

func DeleteCita(c *gin.Context) {
	var cita models.Cita
	if result := initializers.DB.First(&cita, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&cita); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
