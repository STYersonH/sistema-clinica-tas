package models

import "gorm.io/gorm"

type RecetaDetalle struct {
	gorm.Model
	MedicamentoId  uint         `gorm:"not null"` // foreign key
	Medicamento    Medicamento  `gorm:"not null; foreignkey:MedicamentoId"`
	RecetaMedicaId uint         `gorm:"not null"` // foreign key
	RecetaMedica   RecetaMedica `gorm:"not null; foreignkey:RecetaMedicaId"`
	Dosis          string       `gorm:"not null; type:varchar(50)"`
	Frecuencia     string       `gorm:"not null; type:varchar(50)"`
	Duracion       string       `gorm:"not null; type:varchar(50)"`
}
