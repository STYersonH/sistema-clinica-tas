package models

import "gorm.io/gorm"

type Usuario struct {
	gorm.Model
	DniPaciente    *string   `gorm:"unique; type:varchar(8)"` // foreign key
	Paciente       *Paciente `gorm:"foreignkey:DniPaciente; references:Dni"`
	LicenciaDoctor *string   `gorm:"unique; type:varchar(20)"` // foreign key
	Doctor         *Doctor   `gorm:"foreignkey:LicenciaDoctor; references:NumeroLicencia"`
	Password       string    `gorm:"not null; type:varchar(100)"`
	Tipo           string    `gorm:"not null; type:enum('paciente','doctor','admin')"`
	Habilitado     bool      `gorm:"not null; type:boolean; default:true"`
}
