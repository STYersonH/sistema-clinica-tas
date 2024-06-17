package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllAsegurados(c *gin.Context) {
	var asegurados []models.Asegurado
	if result := initializers.DB.Find(&asegurados); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": asegurados})
}

func GetAsegurado(c *gin.Context) {
	var asegurado models.Asegurado
	if result := initializers.DB.First(&asegurado, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": asegurado})
}

func CreateAsegurado(c *gin.Context) {
	var asegurado models.Asegurado
	if err := c.ShouldBindJSON(&asegurado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&asegurado); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": asegurado})
}

func UpdateAsegurado(c *gin.Context) {
	var asegurado models.Asegurado
	if result := initializers.DB.First(&asegurado, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&asegurado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&asegurado).Omit("created_at").Updates(&asegurado); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": asegurado})
}

func DeleteAsegurado(c *gin.Context) {
	var asegurado models.Asegurado
	if result := initializers.DB.First(&asegurado, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&asegurado); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}