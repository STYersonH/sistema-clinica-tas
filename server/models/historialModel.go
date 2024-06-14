package models

import (
	"gorm.io/gorm"
)

type HistorialClinico struct {
	gorm.Model
	DniPaciente      string   `gorm:"not null; type:varchar(8)"`
	Paciente         Paciente `gorm:"foreignKey:DniPaciente; references:Dni"`
	LicenciaDoctor   string   `gorm:"not null; type:varchar(50)"`
	Doctor           Doctor   `gorm:"foreignKey:LicenciaDoctor; references:NumeroLicencia"`
	Enfermedad       string   `gorm:"not null; type:varchar(50)"`
	FechaDiagnostico string   `gorm:"not null; type:date"`
}
