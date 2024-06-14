package main

import (
	"fmt"
	"log"

	"github.com/asterfy/tis-clinic/models"
	"github.com/bxcodec/faker/v3"
)

func main() {
	var paciente models.Paciente
	err := faker.FakeData(&paciente)
	if err != nil {
		log.Fatalf("Error generando datos aleatorios para Paciente: %v", err)
	}
	fmt.Println(paciente)
}
