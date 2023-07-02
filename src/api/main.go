package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"go-plex/internals/models"
	"go-plex/internals/repository"
	"go-plex/internals/repository/dbrepo"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const port = 8080

type application struct {
	Domain string
	DSN    string
	// DB     *sql.DB
	DB           repository.DatabaseRepo
	auth         Auth
	JWTSecret    string
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
	APIKey       string
}

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	api_key := os.Getenv("TMDB_API_KEY")

	// set application config
	var app application

	// read from cmdline
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=goplex sslmode=disable timezone=UTC connect_timeout=10", "Postgres Connection String")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "verysecret", "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "example.com", "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "example.com", "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "example.com", "domain")
	flag.StringVar(&app.APIKey, "api-key", api_key, "api key")
	flag.Parse()

	// connect to db
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	// app.DB = conn
	// defer app.DB.Close() // close db connection when main exits

	// database repo
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookiePath:    "/",
		CookieName:    "refresh_token",
		// CookieDomain:  app.CookieDomain,
	}

	log.Printf("Starting server on port %d", port)

	// start a web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}

func (app *application) getPoster(movie models.Movie) models.Movie {
	type TheMovieDB struct {
		Page    int `json:"page"`
		Results []struct {
			PosterPath string `json:"poster_path"`
		} `json:"results"`
		TotalPages int `json:"total_pages"`
	}

	client := &http.Client{}
	theUrl := fmt.Sprintf("https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s", app.APIKey, url.QueryEscape(movie.Title))

	req, err := http.NewRequest("GET", theUrl, nil)
	if err != nil {
		log.Println(err)
		return movie
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return movie
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return movie
	}

	var theMovieDB TheMovieDB
	err = json.Unmarshal(bodyBytes, &theMovieDB)
	if err != nil {
		log.Println(err)
		return movie
	}

	if len(theMovieDB.Results) > 0 {
		movie.Image = theMovieDB.Results[0].PosterPath
	}

	return movie
}
