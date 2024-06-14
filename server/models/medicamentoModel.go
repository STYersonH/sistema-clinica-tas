package models

import "gorm.io/gorm"

type Medicamento struct {
	gorm.Model
	Nombre      string `gorm:"not null; type:varchar(50)"`
	Descripcion string `gorm:"not null; type:varchar(200)"`
}
