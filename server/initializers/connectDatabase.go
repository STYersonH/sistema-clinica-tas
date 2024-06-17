package initializers

import (
	"fmt"
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
func ConnectToDB() error {
	connection, dsn := craftDSNs()

	// Crear una instancia de GORM para conectar a MySQL
	db, err := gorm.Open(mysql.Open(connection), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error al abrir la conexión a MySQL: %w", err)
	}

	// Crear la base de datos si no existe
	createDatabaseCommand := "CREATE DATABASE IF NOT EXISTS " + "clinic_db" + ";"

	if err := db.Exec(createDatabaseCommand).Error; err != nil {
		return fmt.Errorf("error al crear la base de datos: %w", err)
	}

	// Conectar a la base de datos especificada
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error al conectar a la base de datos: %w", err)
	}

	DB = db
	return nil
}
