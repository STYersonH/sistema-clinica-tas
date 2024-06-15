package models

import (
	"gorm.io/gorm"
)

type Asegurado struct {
	gorm.Model
	SeguroId         uint     `gorm:"not null"` //foreign key
	Seguro           Seguro   `gorm:"foreignKey:SeguroId"`
	DniAsegurado     string   `gorm:"not null; type:varchar(8)"`
	Paciente         Paciente `gorm:"foreignKey:DniAsegurado; references:Dni"` //foreign key
	FechaInscipcion  string   `gorm:"not null, default:CURRENT_TIMESTAMP; type:date"`
	FechaVencimiento string   `gorm:"not null; type:date"`
}
