package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	var usuarios []models.Usuario
	if result := initializers.DB.Find(&usuarios); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuarios})
}

func GetUser(c *gin.Context) {
	var usuario models.Usuario
	if result := initializers.DB.First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(200, gin.H{"data": usuario})
}

func CreateUser(c *gin.Context) {
	var usuario models.Usuario
	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//Encriptar contraseña
	bytes, err := bcrypt.GenerateFromPassword([]byte(usuario.Password), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuario.Password = string(bytes)

	if result := initializers.DB.Create(&usuario); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(201, gin.H{"data": usuario})
}
