package controllers

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func ValidateLogin(c *gin.Context) {
	var usuario models.Usuario

	if err := c.BindJSON(&usuario); err != nil {
		c.JSON(400, gin.H{"error": "Invalid JSON provided"})
		return
	}
	var usuarioDB models.Usuario
	if usuario.DniPaciente == nil || *usuario.DniPaciente == "" {
		//Cuenta de dcotor
		result := initializers.DB.Where("licencia_doctor = ?", usuario.LicenciaDoctor).First(&usuarioDB)
		if result.Error != nil {
			c.JSON(400, gin.H{"error": "Erro al recuperar doctor"})
			return
		}

	} else {
		//Cuenta de paciente
		result := initializers.DB.Where("dni_paciente = ?", usuario.DniPaciente).First(&usuarioDB)
		if result.Error != nil {
			c.JSON(400, gin.H{"error": "Error al recuperar paciente"})
			return
		}
	}

	err := bcrypt.CompareHashAndPassword([]byte(usuarioDB.Password), []byte(usuario.Password))

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid password"})
		return
	}

	//Mostrar  datos recibidos
	c.JSON(200, gin.H{"data": usuarioDB})
}
