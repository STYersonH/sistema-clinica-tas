package controllers

import (
	"net/http"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	modelsApi "github.com/asterfy/tis-clinic/modelsAPI"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	var usuarios []models.Usuario
	if result := initializers.DB.Find(&usuarios); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuarios})
}

func GetUser(c *gin.Context) {
	// var usuario models.Usuario
	// if result := initializers.DB.Preload("Paciente").Preload("Doctor").First(&usuario, c.Param("id")); result.Error != nil {
	// 	c.JSON(404, gin.H{"error": "Record not found!"})
	// 	return
	// }

	// c.JSON(200, gin.H{"data": usuario})
	var usuario models.Usuario

	if result := initializers.DB.First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}
	if usuario.DniPaciente != nil {
		var paciente models.Paciente
		if result := initializers.DB.First(&paciente, "dni = ?", usuario.DniPaciente); result.Error != nil {
			c.JSON(404, gin.H{"error": "Record not found!"})
			return
		}

		var accountPacient modelsApi.InfoAccountPacient
		accountPacient.IdPaciente = paciente.ID
		accountPacient.Dni = *paciente.Dni
		accountPacient.Nombres = *paciente.Nombres
		accountPacient.Apellidos = *paciente.Apellido_paterno + " " + *paciente.Apellido_materno
		accountPacient.Genero = *paciente.Genero
		accountPacient.Direccion = *paciente.Direccion
		accountPacient.CorreoElectronico = *paciente.Email
		accountPacient.Telefono = *paciente.Telefono
		accountPacient.FechaNacimiento = *paciente.FechaNacimiento
		accountPacient.Ocupacion = *paciente.Ocupacion

		c.JSON(200, gin.H{"data": accountPacient})
	} else {
		var doctor models.Doctor
		if result := initializers.DB.Preload("Especialidad").First(&doctor, "numero_licencia = ?", usuario.LicenciaDoctor); result.Error != nil {
			c.JSON(404, gin.H{"error": "Record not found!"})
			return
		}

		var accountDoctor modelsApi.InfoAccountDoctor
		accountDoctor.IdDoctor = doctor.ID
		accountDoctor.Dni = doctor.Dni
		accountDoctor.NroLiscencia = doctor.NumeroLicencia
		accountDoctor.Nombres = doctor.Nombres
		accountDoctor.Apellidos = doctor.Apellido_paterno + " " + doctor.Apellido_materno
		accountDoctor.Genero = doctor.Genero
		accountDoctor.Direccion = doctor.Direccion
		accountDoctor.CorreoElectronico = doctor.Email
		accountDoctor.Telefono = doctor.Telefono
		accountDoctor.FechaNacimiento = doctor.FechaNacimiento
		accountDoctor.Especialidad = doctor.Especialidad.Nombre

		c.JSON(200, gin.H{"data": accountDoctor})
	}

	// c.JSON(200, gin.H{"data": "data"})
}

func CreateUser(c *gin.Context) {
	var usuario models.Usuario
	if err := c.ShouldBindJSON(&usuario); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	//Encriptar contraseña
	bytes, err := bcrypt.GenerateFromPassword([]byte(usuario.Password), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuario.Password = string(bytes)

	if result := initializers.DB.Create(&usuario); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(201, gin.H{"data": usuario})
}

func ChangePasswordUser(c *gin.Context) {
	//Buscar usuario
	var usuario models.Usuario
	if result := initializers.DB.First(&usuario, c.Param("id")); result.Error != nil {
		c.JSON(404, gin.H{"error": "Record not found!"})
		return
	}

	//Validar contraseña actual
	var changePassword modelsApi.ChangePassword
	if err := c.ShouldBindJSON(&changePassword); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if changePassword.NewPassword == "" || changePassword.ConfirmNewPassword == "" {
		c.JSON(400, gin.H{"error": "New password and confirm new password are required!"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(usuario.Password), []byte(changePassword.ActualPassword))
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid password!"})
		return
	}

	if changePassword.NewPassword != changePassword.ConfirmNewPassword {
		c.JSON(400, gin.H{"error": "Passwords do not match!"})
		return
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(changePassword.NewPassword), 7)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	usuario.Password = string(bytes)

	if result := initializers.DB.Save(&usuario); result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": usuario})
}
