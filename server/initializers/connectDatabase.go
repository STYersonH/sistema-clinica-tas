package initializers

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func craftDSNs() (string, string) {
	//Obtener las variables de entorno
	db_name := os.Getenv("DB_NAME")
	db_user := os.Getenv("DB_USER")
	db_password := os.Getenv("DB_PASSWORD")
	db_host := os.Getenv("DB_HOST")
	db_port := os.Getenv("DB_PORT")

	//Construir las cadenas de conexión
	connection := fmt.Sprintf("%s:%s@tcp(%s:%s)/", db_user, db_password, db_host, db_port)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", db_user, db_password, db_host, db_port, db_name)

	return connection, dsn
}

func ConnectToDB() {
	connection, dsn := craftDSNs()

	//Crear base de datos de ser necesaro
	db, err := gorm.Open(mysql.Open(connection), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

	createDatabaseCommand := "CREATE DATABASE IF NOT EXISTS " + os.Getenv("DB_NAME") + ";"
	db.Exec(createDatabaseCommand)

	//Conectar con la base de datos
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Error al conectar con la base de datos")
	} else {
		DB = db
	}
}
