package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllMedicamentos(c *gin.Context) {
	var medicamentos []models.Medicamento
	if result := initializers.DB.Find(&medicamentos); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicamentos})
}

func GetMedicamento(c *gin.Context) {
	var medicamento models.Medicamento
	if result := initializers.DB.First(&medicamento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicamento})
}

func CreateMedicamento(c *gin.Context) {
	var medicamento models.Medicamento
	if err := c.ShouldBindJSON(&medicamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&medicamento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": medicamento})
}

func UpdateMedicamento(c *gin.Context) {
	var medicamento models.Medicamento
	if result := initializers.DB.First(&medicamento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&medicamento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&medicamento).Omit("created_at").Updates(&medicamento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicamento})
}

func DeleteMedicamento(c *gin.Context) {
	var medicamento models.Medicamento
	if result := initializers.DB.First(&medicamento, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&medicamento); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
