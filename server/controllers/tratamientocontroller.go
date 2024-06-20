package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllTratamientos(c *gin.Context) {
	var tratamientos []models.Tratamiento
	if result := initializers.DB.Preload("HistorialClinico").Find(&tratamientos); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tratamientos})
}

func GetTratamiento(c *gin.Context) {
	var tratamiento models.Tratamiento
	if result := initializers.DB.First(&tratamiento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tratamiento})
}

func CreateTratamiento(c *gin.Context) {
	var tratamiento models.Tratamiento
	if err := c.ShouldBindJSON(&tratamiento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&tratamiento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": tratamiento})
}

func UpdateTratamiento(c *gin.Context) {
	var tratamiento models.Tratamiento
	if result := initializers.DB.First(&tratamiento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&tratamiento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&tratamiento).Omit("created_at").Updates(&tratamiento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tratamiento})
}

func DeleteTratamiento(c *gin.Context) {
	var tratamiento models.Tratamiento
	if result := initializers.DB.First(&tratamiento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&tratamiento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
