package models

import "gorm.io/gorm"

type Tratamiento struct {
	gorm.Model
	HistorialClinicoId uint             `gorm:"not null"` // foreign key
	HistorialClinico   HistorialClinico `gorm:"not null; foreignkey:HistorialClinicoId"`
	Tipo               string           `gorm:"not null; type:enum('medicamento','terapia','cirugia','otro')"`
	Descripcion        string           `gorm:"not null; type:varchar(200)"`
}
