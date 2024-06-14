package models

import (
	"gorm.io/gorm"
)

type Especialidad struct {
	gorm.Model
	Nombre string `gorm:"not null; type:varchar(50)"`
}
