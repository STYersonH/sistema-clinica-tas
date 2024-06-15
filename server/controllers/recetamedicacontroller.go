package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllRecetasmedicas(c *gin.Context) {
	var recetasmedicas []models.RecetaMedica
	if result := initializers.DB.Find(&recetasmedicas); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetasmedicas})
}

func GetRecetamedica(c *gin.Context) {
	var recetamedica models.RecetaMedica
	if result := initializers.DB.First(&recetamedica, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetamedica})
}

func CreateRecetamedica(c *gin.Context) {
	var recetamedica models.RecetaMedica
	if err := c.ShouldBindJSON(&recetamedica); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&recetamedica); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": recetamedica})
}

func UpdateRecetamedica(c *gin.Context) {
	var recetamedica models.RecetaMedica
	if result := initializers.DB.First(&recetamedica, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&recetamedica); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&recetamedica).Omit("created_at").Updates(&recetamedica); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetamedica})
}

func DeleteRecetamedica(c *gin.Context) {
	var recetamedica models.RecetaMedica
	if result := initializers.DB.First(&recetamedica, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&recetamedica); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
