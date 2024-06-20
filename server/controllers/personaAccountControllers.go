package controllers

import (
	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetInfoUser(c *gin.Context) {
	var usuario models.Usuario

	if result := initializers.DB.Preload("Paciente").Preload("Doctor").First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}
	var data any
	if usuario.Paciente != nil {
		data = usuario.Paciente
	} else {
		data = usuario.Doctor
	}
	c.JSON(200, gin.H{"data": data})
}
