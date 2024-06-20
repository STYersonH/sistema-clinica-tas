package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
)

func GetAllHistoriales(c *gin.Context) {
	var historiales []models.HistorialClinico
	if result := initializers.DB.Find(&historiales); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": historiales})
}

func GetHistorial(c *gin.Context) {
	var historial models.HistorialClinico
	if result := initializers.DB.First(&historial, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": historial})
}

func CreateHistorial(c *gin.Context) {
	var clinicHistorialGet modelsApi.ClinicHistorialGet

	if err := c.ShouldBindJSON(&clinicHistorialGet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// if result := initializers.DB.Create(&historial); result.Error != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
	// 	return
	// }

	c.JSON(http.StatusCreated, gin.H{"data": clinicHistorialGet})
}

func UpdateHistorial(c *gin.Context) {
	var historial models.HistorialClinico
	if result := initializers.DB.First(&historial, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&historial); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&historial).Omit("created_at").Updates(&historial); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": historial})
}

func DeleteHistorial(c *gin.Context) {
	var historial models.HistorialClinico
	if result := initializers.DB.First(&historial, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&historial); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
