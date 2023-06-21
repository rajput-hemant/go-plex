package main

import (
	"encoding/json"
	"go-plex/internals/models"
	"log"
	"net/http"
	"time"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprintf(w, "Hello, world from %s", app.Domain)

	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go Plex up and running",
		Version: "1.0.0",
	}

	out, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {
	var movies []models.Movie

	rd, _ := time.Parse("2006-01-02", "1999-03-31")

	the_matrix := models.Movie{
		ID:          1,
		Title:       "The Matrix",
		Description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
		ReleaseDate: rd,
		MPAARating:  "R",
		Runtime:     136,
		Image:       "https://image.tmdb.org/t/p/w500/jBegA6V243J6HUnpcOILsRvBnGb.jpg",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	rd, _ = time.Parse("2006-01-02", "2010-07-16")

	inception := models.Movie{
		ID:          2,
		Title:       "Inception",
		Description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
		ReleaseDate: rd,
		MPAARating:  "PG-13",
		Runtime:     148,
		Image:       "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	movies = append(movies, the_matrix, inception)

	out, err := json.MarshalIndent(movies, "", "  ")
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}
