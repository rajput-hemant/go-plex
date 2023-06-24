package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	// create a router mux
	mux := chi.NewRouter()
	mux.Use(app.enableCORS)

	mux.Use(middleware.Recoverer)

	// register routes
	mux.Get("/", app.Home)
	mux.Post("/auth", app.authenticate)
	mux.Get("/refresh", app.refreshToken)
	mux.Get("/logout", app.logout)
	mux.Get("/movies", app.AllMovies)

	return mux
}
