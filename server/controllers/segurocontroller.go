package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/gin-gonic/gin"
)

func GetAllSeguros(c *gin.Context) {
	var seguros []models.Seguro
	if result := initializers.DB.Find(&seguros); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": seguros})
}

func GetSeguro(c *gin.Context) {
	var seguro models.Seguro
	if result := initializers.DB.First(&seguro, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": seguro})
}

func CreateSeguro(c *gin.Context) {
	var seguro models.Seguro
	if err := c.ShouldBindJSON(&seguro); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := initializers.DB.Create(&seguro); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": seguro})
}

func UpdateSeguro(c *gin.Context) {
	var seguro models.Seguro
	if result := initializers.DB.First(&seguro, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	// Bind solo los campos que se desean actualizar desde el JSON
	if err := c.BindJSON(&seguro); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Guardar el registro actualizado
	if result := initializers.DB.Model(&seguro).Omit("created_at").Updates(&seguro); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": seguro})
}

func DeleteSeguro(c *gin.Context) {
	var seguro models.Seguro
	if result := initializers.DB.First(&seguro, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	if result := initializers.DB.Delete(&seguro); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
