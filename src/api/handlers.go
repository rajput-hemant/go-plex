package main

import (
	"encoding/json"
	"errors"
	"go-plex/internals/models"
	"go-plex/src/graphql"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v4"
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

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.DB.AllMovies()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) authenticate(w http.ResponseWriter, r *http.Request) {
	// read json payload
	var requestPayload struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &requestPayload)
	if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return
	}

	// validate user against database
	user, err := app.DB.GetUserByEmail(requestPayload.Email)
	if err != nil {
		app.errorJSON(w, errors.New("invalid email"), http.StatusUnauthorized)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if !valid || err != nil {
		app.errorJSON(w, errors.New("invalid password"), http.StatusUnauthorized)
		return
	}

	// create a jwt user
	u := JWTUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	// generate jwt tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	app.writeJSON(w, http.StatusAccepted, tokens)
}

func (app *application) refreshToken(w http.ResponseWriter, r *http.Request) {
	for _, cookie := range r.Cookies() {
		if cookie.Name == app.auth.CookieName {
			claims := &Claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(app.auth.Secret), nil
			})
			if err != nil {
				app.errorJSON(w, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the user id from the claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			// get the user from the database
			user, err := app.DB.GetUserByID(userID)
			if err != nil {
				app.errorJSON(w, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			// create a jwt user
			u := JWTUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			// generate jwt tokens
			tokens, err := app.auth.GenerateTokenPair(&u)
			if err != nil {
				app.errorJSON(w, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
			http.SetCookie(w, refreshCookie)

			app.writeJSON(w, http.StatusAccepted, tokens)
		}
	}
}

func (app *application) logout(w http.ResponseWriter, r *http.Request) {
	// delete the cookie
	cookie := app.auth.GetExpiredRefreshCookie()
	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusAccepted)

	app.writeJSON(w, http.StatusOK, "logged out")
}

func (app *application) MovieCatalog(w http.ResponseWriter, r *http.Request) {
	movies, err := app.DB.AllMovies()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) GetMovie(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	movieId, err := strconv.Atoi(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movie, err := app.DB.OneMovie(movieId)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movie)
}

func (app *application) MovieForEdit(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	movieId, err := strconv.Atoi(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movie, genres, err := app.DB.OneMovieForEdit(movieId)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	payload := struct {
		Movie  *models.Movie   `json:"movie"`
		Genres []*models.Genre `json:"genres"`
	}{
		movie,
		genres,
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.DB.AllGenres()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, genres)
}

func (app *application) InsertMovie(w http.ResponseWriter, r *http.Request) {
	var movie models.Movie

	err := app.readJSON(w, r, &movie)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// try to get an image
	movie = app.getPoster(movie)
	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	newID, err := app.DB.InsertMovie(movie)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// handle genres
	err = app.DB.UpdateMovieGenres(newID, movie.GenreIds)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	print("Movie ID: ", newID)

	resp := JSONResponse{
		Error:   false,
		Message: "Movie inserted successfully",
	}

	app.writeJSON(w, http.StatusCreated, resp)
}

func (app *application) UpdateMovie(w http.ResponseWriter, r *http.Request) {
	var payload models.Movie

	err := app.readJSON(w, r, &payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movie, err := app.DB.OneMovie(payload.ID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movie.Title = payload.Title
	movie.Description = payload.Description
	movie.ReleaseDate = payload.ReleaseDate
	movie.Runtime = payload.Runtime
	movie.MPAARating = payload.MPAARating
	movie.UpdatedAt = time.Now()

	// update the movie
	err = app.DB.UpdateMovie(*movie)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// handle genres
	err = app.DB.UpdateMovieGenres(movie.ID, payload.GenreIds)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "Movie updated successfully",
	}

	app.writeJSON(w, http.StatusOK, resp)
}

func (app *application) DeleteMovie(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	err = app.DB.DeleteMovie(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	resp := JSONResponse{
		Error:   false,
		Message: "Movie deleted successfully",
	}

	app.writeJSON(w, http.StatusOK, resp)
}

func (app *application) AllMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movies, err := app.DB.AllMovies(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	_ = app.writeJSON(w, http.StatusOK, movies)
}

func (app *application) moviesGraphQL(w http.ResponseWriter, r *http.Request) {
	// we need to populate our Graph type with the movies
	movies, _ := app.DB.AllMovies()

	// get the query from the request
	q, _ := io.ReadAll(r.Body)
	query := string(q)

	// create a new var of type *graphql.Graph
	g := graphql.New(movies)

	// set the query string on the variable
	g.QueryString = query

	// perform the query
	response, err := g.Query()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	// write the response
	j, _ := json.MarshalIndent(response, "", "  ")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
