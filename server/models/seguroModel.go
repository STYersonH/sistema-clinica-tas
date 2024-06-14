package models

import "gorm.io/gorm"

type Seguro struct {
	gorm.Model
	TipoSeguro string  `gorm:"unique;not null; type:enum('basico','premiun','estandar')"`
	Precio     float64 `gorm:"not null; check:Precio > 0"`
}
