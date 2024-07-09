package models

import (
	"gorm.io/gorm"
)

type Paciente struct {
	gorm.Model
	Dni              *string `gorm:"unique;not null;type:varchar(8)"`
	Nombres          *string `gorm:"not null;type:varchar(50)"`
	Apellido_paterno *string `gorm:"not null;type:varchar(30)"`
	Apellido_materno *string `gorm:"not null;type:varchar(30)"`
	Genero           *string `gorm:"not null;type:enum('masculino','femenino')"`
	Direccion        *string `gorm:"type:varchar(100)"`
	Email            *string `gorm:"type:varchar(40)"`
	Telefono         *string `gorm:"not null;type:varchar(12)"`
	Ocupacion        *string `gorm:"type:varchar(30)"`
	FechaNacimiento  *string `gorm:"not null; type:date"`
}
