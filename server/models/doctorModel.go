package models

import (
	"gorm.io/gorm"
)

type Doctor struct {
	gorm.Model
	NumeroLicencia   string       `gorm:"unique;not null; type:varchar(20)"`
	Dni              string       `gorm:"unique;not null; type:varchar(8)"`
	Nombres          string       `gorm:"not null; type:varchar(50)"`
	Apellido_paterno string       `gorm:"not null; type:varchar(30)"`
	Apellido_materno string       `gorm:"not null; type:varchar(30)"`
	Direccion        string       `gorm:"type:varchar(100)"`
	Email            string       `gorm:"not null; type:varchar(40)"`
	Telefono         string       `gorm:"not null; type:varchar(12)"`
	FechaNacimiento  string       `gorm:"not null; type:date"`
	EspecialidadId   uint         `gorm:"not null"` // foreign key
	Especialidad     Especialidad `gorm:"not null; foreignkey:EspecialidadId"`
	Genero           string       `gorm:"not null; type:enum('masculino','femenino')"`
}
