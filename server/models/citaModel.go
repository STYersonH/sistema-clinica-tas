package models

import (
	"time"

	"gorm.io/gorm"
)

type Cita struct {
	gorm.Model
	DniPaciente    string       `gorm:"not null; type:varchar(8)"` // foreign key
	Paciente       Paciente     `gorm:"foreignKey:DniPaciente; references:Dni"`
	LicenciaDoctor string       `gorm:"not null; type:varchar(50)"` // foreign key
	Doctor         Doctor       `gorm:"foreignKey:LicenciaDoctor; references:NumeroLicencia"`
	Fecha          time.Time    `gorm:"not null; type:date;"`
	Hora           time.Time    `gorm:"not null; type:time"`
	EspecialidadId uint         `gorm:"not null"` // foreign key
	Especialidad   Especialidad `gorm:"not null; foreignkey:EspecialidadId"`
	Motivo         string       `gorm:"not null; type:varchar(50)"`
	Estado         string       `gorm:"not null; type:enum('programada','completada','cancelada')"`
}