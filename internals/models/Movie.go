package models

import "time"

type Movie struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ReleaseDate time.Time `json:"release_date"`
	MPAARating  string    `json:"mpaa_rating"`
	Runtime     int       `json:"runtime"`
	Image       string    `json:"image"`
	CreatedAt   time.Time `json:"-"`
	UpdatedAt   time.Time `json:"-"`
	Genres      []*Genre  `json:"genres,omitempty"`
	GenreIds    []int     `json:"genre_ids,omitempty"`
}

type Genre struct {
	ID        int       `json:"id"`
	GenreName string    `json:"name"`
	Checked   bool      `json:"checked"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}
