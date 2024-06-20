package controllers

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func ValidateLogin(c *gin.Context) {
	var usuarioJson modelsApi.UserJson

	if err := c.BindJSON(&usuarioJson); err != nil {
		c.JSON(400, gin.H{"error": "Error parsing JSON"})
		return
	}

	//Validar que los campos no esten vacios
	if usuarioJson.Username == "" || usuarioJson.Password == "" {
		c.JSON(400, gin.H{"error": "Invalid JSON provided"})
		return
	}

	//----------------Buscar usuario en la base de datos----------------
	var usuarioDB models.Usuario

	//Buscar cuenta como doctor
	result := initializers.DB.Where("licencia_doctor = ?", usuarioJson.Username).First(&usuarioDB)
	if result.Error != nil {
		//Buscar cuenta como paciente
		result = initializers.DB.Where("dni_paciente = ?", usuarioJson.Username).First(&usuarioDB)
		if result.Error != nil {
			c.JSON(400, gin.H{"error": "Invalid username"})
			return
		}
	}

	err := bcrypt.CompareHashAndPassword([]byte(usuarioDB.Password), []byte(usuarioJson.Password))

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid password"})
		return
	}

	//Mostrar  datos de usuario logueado correctamente
	c.JSON(200, gin.H{"data": usuarioDB})
}
