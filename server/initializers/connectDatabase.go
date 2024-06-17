package initializers

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func craftDSNs() (string, string) {
	//Obtener las variables de entorno
	db_name := "clinic_db"
	db_user := "root"
	db_password := "48770660"
	db_host := "127.0.0.1"
	db_port := "3307"
	// fmt.Printf("DB_HOST: %s, DB_PORT: %s\n", db_host, db_port)
	//Construir las cadenas de conexión
	connection := fmt.Sprintf("%s:%s@tcp(%s:%s)/", db_user, db_password, db_host, db_port)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", db_user, db_password, db_host, db_port, db_name)

	return connection, dsn
}
func ConnectToDB() error {
	connection, dsn := craftDSNs()

	// Imprimir las cadenas de conexión para depuración
	fmt.Println("Connection:", connection)
	fmt.Println("DSN:", dsn)

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
