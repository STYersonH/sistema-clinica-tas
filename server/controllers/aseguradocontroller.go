package controllers

import (
	"net/http"
	"time"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
)

func GetAllAsegurados(c *gin.Context) {
	var asegurados []models.Asegurado
	if result := initializers.DB.Preload("Paciente").Preload("Seguro").Find(&asegurados); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": asegurados})
}

func GetAsegurado(c *gin.Context) {
	var asegurado models.Asegurado
	if result := initializers.DB.Preload("Paciente").Preload("Seguro").First(&asegurado, c.Param("id")); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": asegurado})
}

// datos de asegurado dado el DNI del paciente
func GetAseguradoporDNI(c *gin.Context) {
	var asegurado models.Asegurado
	dni := c.Param("dni_asegurado")
	if err := initializers.DB.Preload("Paciente").Preload("Seguro").Where("dni_asegurado=?", dni).First(&asegurado).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, asegurado)
}

// Datos del seguro dado el Dni del paciente
func GetSeguroporDNI(c *gin.Context) {
	var asegurado models.Asegurado
	dni := c.Param("dni_asegurado")
	if err := initializers.DB.Preload("Seguro").Where("dni_asegurado=?", dni).First(&asegurado).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"seguro_id":   asegurado.SeguroId,
		"tipo_seguro": asegurado.Seguro.TipoSeguro,
		"precio":      asegurado.Seguro.Precio,
	})

}
func CreateAsegurado(c *gin.Context) {

	//Obtener datos del JSON
	var aseguradoGet modelsApi.SeguroGet

	if err := c.ShouldBindJSON(&aseguradoGet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Buscar paciente
	var paciente models.Paciente
	if err := initializers.DB.First(&paciente, "id = ?", aseguradoGet.IdPaciente).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	//Verificar si ya està asegurado
	var aseguradoExistente models.Asegurado
	if err := initializers.DB.Where("dni_asegurado = ?", paciente.Dni).First(&aseguradoExistente).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El paciente ya está asegurado"})
		return
	}
	//Buscar seguro
	var seguro models.Seguro
	if err := initializers.DB.First(&seguro, "tipo_seguro = ?", aseguradoGet.Tipo).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}
	//Obtener fecha actual
	// Obtener la fecha y hora actual
	currentTime := time.Now()

	// Formatear la fecha actual en el formato "año-mes-día"
	fechaInscripcion := currentTime.Format("2006-01-02")
	futureTime := currentTime.AddDate(aseguradoGet.CantAnios, 0, 0)
	fechaCaducidad := futureTime.Format("2006-01-02")

	//Crear y agregar asegurado
	var aseguradoBD models.Asegurado

	aseguradoBD.DniAsegurado = *paciente.Dni
	aseguradoBD.SeguroId = seguro.ID
	aseguradoBD.FechaInscipcion = fechaInscripcion
	aseguradoBD.FechaVencimiento = fechaCaducidad

	if result := initializers.DB.Create(&aseguradoBD); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": aseguradoBD})
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
