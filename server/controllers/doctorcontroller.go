package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetAllDoctors(c *gin.Context) {
	var doctors []models.Doctor
	if result := initializers.DB.Find(&doctors); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": doctors})
}

func GetDoctor(c *gin.Context) {
	var doctor models.Doctor
	if result := initializers.DB.First(&doctor, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": doctor})
}

func CreateDoctor(c *gin.Context) {
	var doctor models.Doctor
	if err := c.ShouldBindJSON(&doctor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&doctor); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	//Crear cuenta para doctor
	var usuarioDoctor models.Usuario
	usuarioDoctor.LicenciaDoctor = &doctor.NumeroLicencia
	usuarioDoctor.Tipo = "Doctor"
	usuarioDoctor.Habilitado = true

	bytes, err := bcrypt.GenerateFromPassword([]byte(doctor.NumeroLicencia), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuarioDoctor.Password = string(bytes)
	if result := initializers.DB.Create(&usuarioDoctor); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"mesage": "Doctor y cuenta de usuario creado", "data": doctor})
}

func UpdateDoctor(c *gin.Context) {
	var doctor models.Doctor
	if result := initializers.DB.First(&doctor, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&doctor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&doctor).Omit("created_at").Updates(&doctor); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": doctor})
}

func DeleteDoctor(c *gin.Context) {
	var doctor models.Doctor
	if result := initializers.DB.First(&doctor, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&doctor); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
