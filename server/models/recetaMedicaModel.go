package models

import (
	"time"

	"gorm.io/gorm"
)

type RecetaMedica struct {
	gorm.Model
	TratamientoId uint        `gorm:"not null"` // foreign key
	Tratamiento   Tratamiento `gorm:"not null; foreignkey:TratamientoId"`
	FechaEmision  time.Time   `gorm:"not null;type:date"`
}
