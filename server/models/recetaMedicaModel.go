package models

import (
	"gorm.io/gorm"
)

type RecetaMedica struct {
	gorm.Model
	TratamientoId uint        `gorm:"not null"` // foreign key
	Tratamiento   Tratamiento `gorm:"not null; foreignkey:TratamientoId"`
	FechaEmision  string      `gorm:"not null;type:date"`
}
