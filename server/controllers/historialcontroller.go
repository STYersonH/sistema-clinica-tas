package controllers

import (
	"net/http"
	"strings"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
)

func GetAllHistoriales(c *gin.Context) {
	//Extraer atributos del contexto
	nroIdentificacion := c.Query("ID")

	//Buscar historiales clinicos como paciente o como doctor
	var historiales []models.HistorialClinico
	if len(nroIdentificacion) == 8 {
		if result := initializers.DB.Preload("Doctor").Find(&historiales, "dni_paciente = ?", nroIdentificacion); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
	} else {
		if result := initializers.DB.Preload("Doctor").Find(&historiales, "licencia_doctor = ?", nroIdentificacion); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}
	}

	var arrayHistorialClinics []modelsApi.ClinicHistorialSend

	//Recorrer historiales clinicos
	for _, historial := range historiales {
		var clinicHistorialSend modelsApi.ClinicHistorialSend
		clinicHistorialSend.Diagnostico = historial.Enfermedad
		clinicHistorialSend.FechaDiagnostico = historial.FechaDiagnostico

		//Crear y guardar Medico
		var medico modelsApi.Medico
		medico.Telefono = historial.Doctor.Telefono
		medico.NombresApellidos = historial.Doctor.Nombres + " " + historial.Doctor.Apellido_paterno + " " + historial.Doctor.Apellido_materno
		medico.Email = historial.Doctor.Email
		var Especialidad models.Especialidad
		if result := initializers.DB.First(&Especialidad, "id = ?", historial.Doctor.EspecialidadId); result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Specialty not found!"})
			return
		}

		medico.Especialidad = Especialidad.Nombre
		clinicHistorialSend.Medico = medico

		//Buscar tratamientos
		var tratamientos []models.Tratamiento
		if result := initializers.DB.Find(&tratamientos, "historial_clinico_id = ?", historial.ID); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}

		var ArrayTratamientos []modelsApi.Treatment
		//Recorrer tratamientos
		for _, tratamiento := range tratamientos {
			var treatment modelsApi.Treatment
			treatment.Tipo = tratamiento.Tipo
			treatment.Descripcion = tratamiento.Descripcion

			var ArrayReceta = []modelsApi.Recipe{}

			//Recuperar medicamentos asignados a un tratamiento
			if strings.ToLower(tratamiento.Tipo) == "medicamento" {
				var recetasMedicas []models.RecetaMedica
				if result := initializers.DB.Find(&recetasMedicas, "tratamiento_id = ?", tratamiento.ID); result.Error != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
					return
				}

				for _, recetaMedica := range recetasMedicas {
					var recetasMedicaDetalle []models.RecetaDetalle
					if result := initializers.DB.Preload("Medicamento").Find(&recetasMedicaDetalle, "receta_medica_id = ?", recetaMedica.ID); result.Error != nil {
						c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found!"})
						return
					}

					for _, recetaDetalle := range recetasMedicaDetalle {
						var recipe modelsApi.Recipe
						recipe.NombreMedicamento = recetaDetalle.Medicamento.Nombre
						recipe.Dosis = recetaDetalle.Dosis
						recipe.Frecuencia = recetaDetalle.Frecuencia
						recipe.Duracion = recetaDetalle.Duracion

						ArrayReceta = append(ArrayReceta, recipe)
					}
				}
			}

			//Guardar recetas
			treatment.Receta = ArrayReceta
			//Guardar tratamientos en lista de tratamientos
			ArrayTratamientos = append(ArrayTratamientos, treatment)
		}
		//Guardar lista de tratamientos en historial clinico
		clinicHistorialSend.Tratamientos = ArrayTratamientos
		//Guardar historial clinico en lista de historiales clinicos
		arrayHistorialClinics = append(arrayHistorialClinics, clinicHistorialSend)
	}

	c.JSON(http.StatusOK, gin.H{"data": arrayHistorialClinics})
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

	//Recuperar el JSON enviado
	if err := c.ShouldBindJSON(&clinicHistorialGet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Obtener cita
	var cita models.Cita
	if result := initializers.DB.First(&cita, "id = ?", clinicHistorialGet.IdCita); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cita not found!"})
		return
	}

	//Evaluar si la cita ya tiene un historial clinico
	if cita.HistorialClinicoId != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Historial clinico ya creado!"})
		return
	}

	//Crear hisotrial clinico
	var nuevoHistorialClinico models.HistorialClinico
	nuevoHistorialClinico.DniPaciente = clinicHistorialGet.DniPaciente
	nuevoHistorialClinico.LicenciaDoctor = clinicHistorialGet.LicenciaMedico
	nuevoHistorialClinico.Enfermedad = clinicHistorialGet.Diagnostico
	nuevoHistorialClinico.FechaDiagnostico = clinicHistorialGet.FechaDiagnostico

	if result := initializers.DB.Create(&nuevoHistorialClinico); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	//Crear tratamientos
	for _, tratamiento := range clinicHistorialGet.Tratamientos {
		var nuevoTratamiento models.Tratamiento
		nuevoTratamiento.HistorialClinicoId = nuevoHistorialClinico.ID
		nuevoTratamiento.Tipo = tratamiento.Tipo
		if strings.ToLower(tratamiento.Tipo) == "medicamento" && tratamiento.Descripcion == "" {
			nuevoTratamiento.Descripcion = "Consumo de medicamentos"
		} else {
			nuevoTratamiento.Descripcion = tratamiento.Descripcion
		}

		if result := initializers.DB.Create(&nuevoTratamiento); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
			return
		}

		//Crear recetas de ser necesaras
		if strings.ToLower(nuevoTratamiento.Tipo) == "medicamento" {
			for _, recipe := range tratamiento.Receta {
				//Crear receta medica
				var nuevaRecetaMedica models.RecetaMedica
				nuevaRecetaMedica.TratamientoId = nuevoTratamiento.ID
				nuevaRecetaMedica.FechaEmision = nuevoHistorialClinico.FechaDiagnostico

				if result := initializers.DB.Create(&nuevaRecetaMedica); result.Error != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
					return
				}
				//Buscar id de medicamento pasado
				var medicamento models.Medicamento
				if result := initializers.DB.First(&medicamento, "nombre = ?", recipe.NombreMedicamento); result.Error != nil {
					c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found!"})
					return
				}

				var recetaDetalle models.RecetaDetalle
				recetaDetalle.RecetaMedicaId = nuevaRecetaMedica.ID
				recetaDetalle.MedicamentoId = medicamento.ID
				recetaDetalle.Dosis = recipe.Dosis
				recetaDetalle.Frecuencia = recipe.Frecuencia
				recetaDetalle.Duracion = recipe.Duracion

				if result := initializers.DB.Create(&recetaDetalle); result.Error != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
					return
				}
			}
		}

	}

	//Actualizar estado de cita a "completada" y asignar Id de historial clinico
	cita.Estado = "Completada"
	cita.HistorialClinicoId = &nuevoHistorialClinico.ID
	if result := initializers.DB.Model(&cita).Omit("created_at").Updates(&cita); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": nuevoHistorialClinico.ID, "message": "Historial clinico creado exitosamente!"})
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
