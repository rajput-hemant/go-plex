package repository

import (
	"database/sql"
	"go-plex/internals/models"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
	GetUserByEmail(email string) (*models.User, error)
}
