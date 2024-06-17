package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllRecetasdetail(c *gin.Context) {
	var recetasdetail []models.RecetaDetalle
	if result := initializers.DB.Find(&recetasdetail); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetasdetail})
}

func GetRecetadetail(c *gin.Context) {
	var recetadetail models.RecetaDetalle
	if result := initializers.DB.First(&recetadetail, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetadetail})
}

func CreateRecetadetail(c *gin.Context) {
	var recetadetail models.RecetaDetalle
	if err := c.ShouldBindJSON(&recetadetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&recetadetail); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": recetadetail})
}

func UpdateRecetadetail(c *gin.Context) {
	var recetadetail models.RecetaDetalle
	if result := initializers.DB.First(&recetadetail, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&recetadetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&recetadetail).Omit("created_at").Updates(&recetadetail); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recetadetail})
}

func DeleteRecetadetail(c *gin.Context) {
	var recetadetail models.RecetaDetalle
	if result := initializers.DB.First(&recetadetail, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&recetadetail); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
