package main

import (
	"flag"
	"fmt"
	"go-plex/internals/repository"
	"go-plex/internals/repository/dbrepo"
	"log"
	"net/http"
)

const port = 8080

type application struct {
	Domain string
	DSN    string
	// DB     *sql.DB
	DB repository.DatabaseRepo
}

func main() {
	// set application config
	var app application

	// read from cmdline
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=postgres sslmode=disable timezone=UTC connect_timeout=10", "Postgres Connection String")
	flag.Parse()

	// connect to db
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	// app.DB = conn
	// defer app.DB.Close() // close db connection when main exits
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.Domain = "http://localhost:8080"

	log.Printf("Starting server on port %d", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
