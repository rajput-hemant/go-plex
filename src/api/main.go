package main

import (
	"fmt"
	"log"
	"net/http"
)

const port = 8080

type application struct {
	Domain string
}

func main() {
	// set application config
	var app application

	// read from cmdline
	// ...

	// connect to db
	// ..

	app.Domain = "http://localhost:8080"

	log.Printf("Starting server on port %d", port)

	// register routes
	http.HandleFunc("/", Hello)

	// start a web server
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}
