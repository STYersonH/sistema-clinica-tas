package controllers

import (
	"time"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsservice "github.com/asterfy/tis-clinic/modelsService"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func AsegurarPersonalService(c *gin.Context) {
	//Recoger datos del json
	var AsegurarPersonalJSON modelsservice.AsegurarPersonalGetService
	if err := c.ShouldBindJSON(&AsegurarPersonalJSON); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//Iniciar respuesta
	var AsegurarPersonalRespuesta modelsservice.AsegurarPersonalPostService

	//Recorrer arreglo de DatosPersonal
	var CostoTotalAsegurados float64 = 0
	for _, personaPorAsegurar := range AsegurarPersonalJSON.DatosPersonal {
		//Iniciar respuesta
		var DatosAseguradoRespuesta modelsservice.DatosAseguradoPostService
		DatosAseguradoRespuesta.DatosPaciente.DniAsegurado = *personaPorAsegurar.DniPaciente
		DatosAseguradoRespuesta.DatosPaciente.Nombres = *personaPorAsegurar.Nombres
		DatosAseguradoRespuesta.DatosPaciente.Apellidos = *personaPorAsegurar.ApellidoPaterno + " " + *personaPorAsegurar.ApellidoMaterno
		DatosAseguradoRespuesta.DatosPaciente.TipoSeguro = *personaPorAsegurar.TipoSeguro

		// Validar tipo de seguro
		var seguroDB models.Seguro
		if result := initializers.DB.Where("tipo_seguro = ?", personaPorAsegurar.TipoSeguro).First(&seguroDB); result.Error != nil {
			DatosAseguradoRespuesta.Mensaje = "Tipo de seguro no válido"
			AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
			continue
		}

		//Verificar si la persona está registrada como paciente
		var pacienteDB models.Paciente
		if result := initializers.DB.Where("dni = ?", personaPorAsegurar.DniPaciente).First(&pacienteDB); result.Error != nil {

			if personaPorAsegurar.FechaNacimiento == nil || *personaPorAsegurar.FechaNacimiento == "" {
				c.JSON(400, gin.H{"error": "Fecha de nacimiento vacía"})
				return
			}
			if personaPorAsegurar.Genero == nil || *personaPorAsegurar.Genero == "" {
				c.JSON(400, gin.H{"error": "Género vacío"})
				return
			}

			//Validar datos del paciente
			if !validarFechaNacimiento(*personaPorAsegurar.FechaNacimiento) {
				DatosAseguradoRespuesta.Mensaje = "Fecha de nacimiento inválida"
				AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
				continue
			}
			if !validarGenero(*personaPorAsegurar.Genero) {
				DatosAseguradoRespuesta.Mensaje = "Género no válido"
				AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
				continue
			}
			//Agregar paciente a la base de datos
			var newPaciente models.Paciente
			newPaciente.Dni = personaPorAsegurar.DniPaciente
			newPaciente.Nombres = personaPorAsegurar.Nombres
			newPaciente.Apellido_paterno = personaPorAsegurar.ApellidoPaterno
			newPaciente.Apellido_materno = personaPorAsegurar.ApellidoMaterno
			newPaciente.Genero = personaPorAsegurar.Genero
			newPaciente.Direccion = personaPorAsegurar.Direccion
			newPaciente.Telefono = personaPorAsegurar.Telefono
			newPaciente.Email = personaPorAsegurar.Email
			newPaciente.Ocupacion = personaPorAsegurar.Ocupacion
			newPaciente.FechaNacimiento = personaPorAsegurar.FechaNacimiento

			if result := initializers.DB.Create(&newPaciente); result.Error != nil {
				DatosAseguradoRespuesta.Mensaje = "Error al crear paciente"
				AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
				continue
			}

			//Crear cuenta de paciente
			var newUsuario models.Usuario
			newUsuario.DniPaciente = personaPorAsegurar.DniPaciente
			newUsuario.Password = *personaPorAsegurar.DniPaciente
			//Encriptar contraseña
			bytes, err := bcrypt.GenerateFromPassword([]byte(newUsuario.Password), 7)
			if err != nil {
				DatosAseguradoRespuesta.Mensaje = "Error al encriptar contraseña"
				AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
				continue
			}

			newUsuario.Password = string(bytes)
			newUsuario.Tipo = "paciente"
			newUsuario.Habilitado = true

			if result := initializers.DB.Create(&newUsuario); result.Error != nil {
				DatosAseguradoRespuesta.Mensaje = "Error al crear usuario"
				AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
				continue
			}
		}

		//Asegurar paciente
		var aseguradoDB models.Asegurado
		if result := initializers.DB.Where("dni_asegurado = ?", personaPorAsegurar.DniPaciente).First(&aseguradoDB); result.Error == nil {
			//Analizar
			DatosAseguradoRespuesta.Mensaje = "La persona ya está asegurada"
			AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
			continue
		}

		//Obtener fecha actual
		// Obtener la fecha y hora actual
		currentTime := time.Now()

		// Formatear la fecha actual en el formato "año-mes-día"
		fechaInscripcion := currentTime.Format("2006-01-02")
		futureTime := currentTime.AddDate(*AsegurarPersonalJSON.TotalAnios, 0, 0)
		fechaCaducidad := futureTime.Format("2006-01-02")

		var newAsegurado models.Asegurado
		newAsegurado.SeguroId = seguroDB.ID
		newAsegurado.DniAsegurado = *personaPorAsegurar.DniPaciente
		newAsegurado.FechaInscipcion = fechaInscripcion
		newAsegurado.FechaVencimiento = fechaCaducidad

		if result := initializers.DB.Create(&newAsegurado); result.Error != nil {
			DatosAseguradoRespuesta.Mensaje = "Error al asegurar paciente"
			AsegurarPersonalRespuesta.PersonalNoAsegurado = append(AsegurarPersonalRespuesta.PersonalNoAsegurado, DatosAseguradoRespuesta)
			continue
		}
		DatosAseguradoRespuesta.Mensaje = "Paciente asegurado exitosamente"
		DatosAseguradoRespuesta.DatosPaciente.FechaInscripcion = fechaInscripcion
		DatosAseguradoRespuesta.DatosPaciente.FechaVencimiento = fechaCaducidad
		DatosAseguradoRespuesta.DatosPaciente.Precio = seguroDB.Precio
		CostoTotalAsegurados += seguroDB.Precio
		AsegurarPersonalRespuesta.PersonalAsegurado = append(AsegurarPersonalRespuesta.PersonalAsegurado, DatosAseguradoRespuesta)
	}

	AsegurarPersonalRespuesta.PrecioTotal = CostoTotalAsegurados
	c.JSON(200, gin.H{"data": AsegurarPersonalRespuesta})
}
