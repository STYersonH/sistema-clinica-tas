package controllers

import (
	"net/http"
	"strings"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
)

// func getInfoPacienteByName(c *gin.Context) {
// 	namePatient := c.Query("name")

// }

func GetInfoPaciente(c *gin.Context) {
	var infoPaciente modelsApi.InfoPatient
	NroDniPaciente := c.Query("DNI")
	namePatient := c.Query("name")

	//Llenar datos de paciente
	var pacienteDB models.Paciente
	if result := initializers.DB.First(&pacienteDB, "dni = ?", NroDniPaciente); result.Error != nil {
		if result := initializers.DB.First(&pacienteDB, "nombres = ?", namePatient); result.Error != nil {
			c.JSON(404, gin.H{"error": "Paciente no encontrado"})
			return
		} else {
			NroDniPaciente = *pacienteDB.Dni
		}
	}

	infoPaciente.Nombres = *pacienteDB.Nombres
	infoPaciente.Apellidos = *pacienteDB.Apellido_paterno + " " + *pacienteDB.Apellido_materno
	infoPaciente.FechaNacimiento = *pacienteDB.FechaNacimiento
	infoPaciente.DNI = *pacienteDB.Dni
	infoPaciente.NroCelular = *pacienteDB.Telefono
	infoPaciente.Genero = *pacienteDB.Genero
	infoPaciente.DireccionVivienda = *pacienteDB.Direccion
	infoPaciente.Ocupacion = pacienteDB.Ocupacion

	//Obtener tipo de seguro
	var pacienteAsegurado models.Asegurado
	if result := initializers.DB.Preload("Seguro").First(&pacienteAsegurado, "dni_asegurado = ?", NroDniPaciente); result.Error != nil {
		infoPaciente.TipoSeguro = nil
	} else {
		infoPaciente.TipoSeguro = &pacienteAsegurado.Seguro.TipoSeguro
	}

	//Obtener historiales clínicos
	var ArrayHistoriales []modelsApi.HistorialInfoPatient
	var citasCompletadas []models.Cita
	if result := initializers.DB.Preload("Doctor").Find(&citasCompletadas, "dni_paciente = ? AND estado = ?", NroDniPaciente, "Completada"); result.Error != nil {
		infoPaciente.Historiales = nil
	} else {
		for _, cita := range citasCompletadas {
			var historialInfoPatient modelsApi.HistorialInfoPatient
			historialInfoPatient.IdCita = int(cita.ID)
			historialInfoPatient.Dia = cita.Fecha
			historialInfoPatient.Hora = cita.Hora[10:16]
			historialInfoPatient.NombreDoctor = cita.Doctor.Nombres
			historialInfoPatient.ApellidoDoctor = cita.Doctor.Apellido_paterno
			ArrayHistoriales = append(ArrayHistoriales, historialInfoPatient)
		}
		infoPaciente.Historiales = ArrayHistoriales
	}
	c.JSON(http.StatusOK, gin.H{"data": infoPaciente})
}

func GetCitaAndHistorial(c *gin.Context) {
	IdCitaParam := c.Query("IdCita")
	var citaHistorial modelsApi.CitaHistorial

	var citaDB models.Cita
	if result := initializers.DB.Preload("Paciente").Preload("Doctor").First(&citaDB, "id = ?", IdCitaParam); result.Error != nil {
		c.JSON(404, gin.H{"error": "La cita no existe"})
		return
	}
	var historialClinicoDB models.HistorialClinico
	if result := initializers.DB.First(&historialClinicoDB, "id = ?", citaDB.HistorialClinicoId); result.Error != nil {
		c.JSON(404, gin.H{"error": "La cita no tiene historial clínico"})
		return
	}

	//Llenar datos de paciente
	citaHistorial.CitaDatos.NombrePaciente = *citaDB.Paciente.Nombres
	citaHistorial.CitaDatos.ApellidosPaciente = *citaDB.Paciente.Apellido_paterno + " " + *citaDB.Paciente.Apellido_materno
	citaHistorial.CitaDatos.DNIPaciente = *citaDB.Paciente.Dni

	// Llenar datos de la cita
	citaHistorial.CitaDatos.Dia = citaDB.Fecha[0:10]
	citaHistorial.CitaDatos.Hora = citaDB.Hora[11:16]
	citaHistorial.CitaDatos.Motivo = citaDB.Motivo
	//Llenar datos de diagnóstico
	citaHistorial.DatosDiagnostico.Diagnostico = historialClinicoDB.Enfermedad
	citaHistorial.DatosDiagnostico.FechaDiagnostico = historialClinicoDB.FechaDiagnostico

	//Llenar datos del médico
	var medicoDB models.Doctor
	if result := initializers.DB.Preload("Especialidad").First(&medicoDB, "numero_licencia = ?", historialClinicoDB.LicenciaDoctor); result.Error != nil {
		c.JSON(404, gin.H{"error": "Médico no encontrado"})
		return
	}
	citaHistorial.DatosDiagnostico.Medico.NombresApellidos = medicoDB.Nombres + " " + medicoDB.Apellido_paterno + " " + medicoDB.Apellido_materno
	citaHistorial.DatosDiagnostico.Medico.Telefono = medicoDB.Telefono
	citaHistorial.DatosDiagnostico.Medico.Especialidad = medicoDB.Especialidad.Nombre
	citaHistorial.DatosDiagnostico.Medico.Email = medicoDB.Email

	//Llenar datos de tratamientos
	var tratamientosDB []models.Tratamiento
	var ArrayTratamientos []modelsApi.Treatment

	if result := initializers.DB.Find(&tratamientosDB, "historial_clinico_id = ?", historialClinicoDB.ID); result.Error != nil {
		citaHistorial.DatosDiagnostico.Tratamientos = nil
	} else {
		for _, tratamiento := range tratamientosDB {
			var tratamientoSend modelsApi.Treatment
			tratamientoSend.Tipo = tratamiento.Tipo
			tratamientoSend.Descripcion = tratamiento.Descripcion
			if strings.ToLower(tratamiento.Tipo) == "medicamento" {
				var ArrayRecipes []modelsApi.Recipe
				//Llenar datos de recetas
				var recetaMedicaDB models.RecetaMedica
				if result := initializers.DB.First(&recetaMedicaDB, "tratamiento_id = ?", tratamiento.ID); result.Error != nil {
					tratamientoSend.Receta = nil
				} else {
					var recetasDB []models.RecetaDetalle
					if result := initializers.DB.Preload("Medicamento").Find(&recetasDB, "receta_medica_id = ?", recetaMedicaDB.ID); result.Error != nil {
						tratamientoSend.Receta = nil
					} else {
						for _, receta := range recetasDB {
							var recipe modelsApi.Recipe
							recipe.NombreMedicamento = receta.Medicamento.Nombre
							recipe.Dosis = receta.Dosis
							recipe.Frecuencia = receta.Frecuencia
							recipe.Duracion = receta.Duracion
							ArrayRecipes = append(ArrayRecipes, recipe)
						}
						tratamientoSend.Receta = ArrayRecipes
					}
				}
			} else {
				tratamientoSend.Receta = nil
			}
			ArrayTratamientos = append(ArrayTratamientos, tratamientoSend)
		}
	}
	citaHistorial.DatosDiagnostico.Tratamientos = ArrayTratamientos
	c.JSON(http.StatusOK, gin.H{"data": citaHistorial})
}
