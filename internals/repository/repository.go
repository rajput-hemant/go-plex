package repository

import (
	"database/sql"
	"go-plex/internals/models"
)

type DatabaseRepo interface {
	AllMovies() ([]*models.Movie, error)
	Connection() *sql.DB
}
