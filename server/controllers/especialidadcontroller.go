package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllEspecialidades(c *gin.Context) {
	var especialidades []models.Especialidad
	if result := initializers.DB.Find(&especialidades); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": especialidades})
}

func GetEspecialidad(c *gin.Context) {
	var especialidad models.Especialidad
	if result := initializers.DB.First(&especialidad, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": especialidad})
}

func CreateEspecialidad(c *gin.Context) {
	var especialidad models.Especialidad
	if err := c.ShouldBindJSON(&especialidad); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&especialidad); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": especialidad})
}

func UpdateEspecialidad(c *gin.Context) {
	var especialidad models.Especialidad
	if result := initializers.DB.First(&especialidad, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&especialidad); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&especialidad).Omit("created_at").Updates(&especialidad); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": especialidad})
}

func DeleteEspecialidad(c *gin.Context) {
	var especialidad models.Especialidad
	if result := initializers.DB.First(&especialidad, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&especialidad); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
