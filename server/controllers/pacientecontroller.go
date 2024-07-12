package controllers

import (
	"net/http"
	"strings"
	"time"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetAllPatients(c *gin.Context) {
	var patients []models.Paciente
	if result := initializers.DB.Find(&patients); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patients})
}

func GetPatient(c *gin.Context) {
	var patient models.Paciente
	if result := initializers.DB.First(&patient, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})
}

// Función para validar un campo de género
func validarGenero(genero string) bool {
	if genero != "" {
		return strings.ToLower(genero) == "masculino" || strings.ToLower(genero) == "femenino"
	}
	return false
}

// Función para validar una fecha de nacimiento
func validarFechaNacimiento(fecha string) bool {
	const formato = "2006-01-02"
	fechaNacimiento, err := time.Parse(formato, fecha)
	if err != nil {
		return false
	}
	fechaActual := time.Now()

	return !fechaNacimiento.After(fechaActual)
}

func crearPaciente(patient models.Paciente, c *gin.Context) {
	if result := initializers.DB.Create(&patient); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}
}

func crearCuentaPaciente(patient models.Paciente, c *gin.Context, flag bool) {
	//Crear cuenta para paciente
	var usuarioPaciente models.Usuario
	usuarioPaciente.DniPaciente = patient.Dni
	usuarioPaciente.Tipo = "Paciente"
	usuarioPaciente.Habilitado = true

	bytes, err := bcrypt.GenerateFromPassword([]byte(*patient.Dni), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuarioPaciente.Password = string(bytes)
	if result := initializers.DB.Create(&usuarioPaciente); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}
	if flag {
		c.JSON(http.StatusCreated, gin.H{"message": "Paciente y cuenta de usuario creado exitosamente", "data": patient})
	}
}

func CreatePatient(c *gin.Context) {
	var patient models.Paciente
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar fecha de nacimiento
	if !validarFechaNacimiento(*patient.FechaNacimiento) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Fecha de nacimiento inválida"})
		return
	}

	// Validar campo de género
	if !validarGenero(*patient.Genero) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Género inválido"})
		return
	}

	//Crear paciente
	crearPaciente(patient, c)

	//Crear cuenta para paciente
	crearCuentaPaciente(patient, c, true)
}

func UpdatePatient(c *gin.Context) {
	var patient models.Paciente
	if result := initializers.DB.First(&patient, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&patient).Omit("created_at").Updates(&patient); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})
}

func DeletePatient(c *gin.Context) {
	var patient models.Paciente
	if result := initializers.DB.First(&patient, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&patient); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "Record deleted!"})
}
