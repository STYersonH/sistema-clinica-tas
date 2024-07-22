package main

import (
	"fmt"
	"math/rand"

	"github.com/asterfy/tis-clinic/initializers"
	"github.com/asterfy/tis-clinic/models"
	"github.com/bxcodec/faker/v3"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func randomGenero() string {
	generos := []string{"masculino", "femenino"}
	return generos[rand.Intn(len(generos))]
}

func CrearEspecialidades(especialidades []string) {
	for i := 0; i < len(especialidades); i++ {
		var especialidad = models.Especialidad{}
		especialidad.Nombre = especialidades[i]

		if result := initializers.DB.Create(&especialidad); result.Error != nil {
			fmt.Println("Error al guardar especialidad")
		}
	}
}

func CrearPacientes(n int) {
	for i := 0; i < n; i++ {
		var paciente = models.Paciente{}
		*paciente.Dni = faker.CCNumber()[:8]
		*paciente.Genero = randomGenero()
		if *paciente.Genero == "masculino" {
			*paciente.Nombres = faker.FirstNameMale()
		} else {
			*paciente.Nombres = faker.FirstNameFemale()
		}
		*paciente.Apellido_paterno = faker.LastName()
		*paciente.Apellido_materno = faker.LastName()
		*paciente.Email = faker.Email()
		*paciente.Telefono = faker.Phonenumber()[:9]
		*paciente.Ocupacion = "Ingeniero"
		*paciente.FechaNacimiento = faker.Date()

		//Guardar paciente
		if result := initializers.DB.Create(&paciente); result.Error != nil {
			fmt.Println("Error al guardar paciente")
		} else {
			//Crear cuenta para usuario
			CrearUsuario("paciente", *paciente.Dni)
		}

	}
}

func CrearDoctores(n int) {
	for i := 0; i < n; i++ {
		var doctor = models.Doctor{}
		doctor.NumeroLicencia = faker.CCNumber()[:10]
		doctor.Dni = faker.CCNumber()[:8]
		doctor.Genero = randomGenero()
		if doctor.Genero == "masculino" {
			doctor.Nombres = faker.FirstNameMale()
		} else {
			doctor.Nombres = faker.FirstNameFemale()
		}
		doctor.Apellido_paterno = faker.LastName()
		doctor.Apellido_materno = faker.LastName()
		doctor.Email = faker.Email()
		doctor.Direccion = ""
		doctor.Telefono = faker.Phonenumber()[:9]
		doctor.EspecialidadId = uint(rand.Intn(9) + 1) // 1-9
		doctor.FechaNacimiento = faker.Date()

		//Guardar paciente
		if result := initializers.DB.Create(&doctor); result.Error != nil {
			fmt.Println("Error al guardar doctor")
		} else {
			//Crear cuenta para doctor
			CrearUsuario("doctor", doctor.NumeroLicencia)
		}

	}
}

func CrearUsuario(tipoUsuario string, codigoUsaurio string) {
	var usuario = models.Usuario{}
	usuario.Tipo = tipoUsuario
	if tipoUsuario == "paciente" || tipoUsuario == "admin" {
		usuario.DniPaciente = &codigoUsaurio
		usuario.LicenciaDoctor = nil
	} else if tipoUsuario == "doctor" {
		usuario.LicenciaDoctor = &codigoUsaurio
		usuario.DniPaciente = nil
	}

	//Encriptar contraseña
	bytes, err := bcrypt.GenerateFromPassword([]byte(codigoUsaurio), 7)
	if err != nil {
		fmt.Println("Error al encriptar contraseña")
		return
	}

	usuario.Password = string(bytes)
	usuario.Habilitado = true

	//Guardar usuario
	if result := initializers.DB.Create(&usuario); result.Error != nil {
		fmt.Println("Error al guardar paciente")
	}
}

func CrearMedicamentos(medicamentos []string) {
	for i := 0; i < len(medicamentos); i++ {
		var medicamento = models.Medicamento{}
		medicamento.Nombre = medicamentos[i]
		medicamento.Descripcion = medicamentos[i]

		//Guardar medicamento
		if result := initializers.DB.Create(&medicamento); result.Error != nil {
			fmt.Println("Error al guardar medicamento")
		}
	}
}
func CrearSeguros() {
	var seguro = models.Seguro{}

	seguro.TipoSeguro = "basico"
	seguro.Precio = 100.0
	//Guardar seguro
	if result := initializers.DB.Create(&seguro); result.Error != nil {
		fmt.Println("Error al guardar seguro")
	}

	seguro.TipoSeguro = "estandar"
	seguro.Precio = 200.0
	seguro.ID = 2
	if result := initializers.DB.Create(&seguro); result.Error != nil {
		fmt.Println("Error al guardar seguro")
	}

	seguro.TipoSeguro = "premiun"
	seguro.Precio = 300.0
	seguro.ID = 3
	if result := initializers.DB.Create(&seguro); result.Error != nil {
		fmt.Println("Error al guardar seguro")
	}
}

func main() {
	//Crear especialidades
	var especialidades = []string{"Cardiología", "Dermatología", "Gastroenterología", "Geriatría", "Hematología", "Medicina general", "Neurología", "Oftalmología", "Traumatología"}
	//Crear medicamentos
	var medicamentos = []string{"Paracetamol", "Ibuprofeno", "Diclofenaco", "Omeprazol", "Amoxicilina", "Metformina", "Enalapril", "Losartan", "Simvastatina", "Levotiroxina"}
	CrearMedicamentos(medicamentos)
	//Crear seguros
	CrearSeguros()
	//Crear especialidades
	CrearEspecialidades(especialidades)
	//Crear pacientes y sus respectivas cuentas
	// CrearPacientes(10)
	//Crear doctores y sus respectivas cuentas
	CrearDoctores(10)
}
