import { useParams } from "react-router-dom";
import useSwr from "swr";

import type { Movie as Movietype } from "@/types/movie";
import { formatDate } from "@/lib/utils";
import ErrorPage from "./error";
import { Badge } from "./ui";

const getMovie = async (id: string) => {
  try {
    const response = await fetch(`/api/movies/${id}`);
    const data: Movietype = await response.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const Movie = () => {
  const { id } = useParams();
  const { data: movie, error } = useSwr("/movie", () => {
    if (id) return getMovie(id);
  });

  if (movie)
    if (movie.genres !== undefined) {
      movie.genres = Object.values(movie?.genres);
    } else {
      movie.genres = [];
    }

  if (error) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <>
      <h2 className="text-3xl font-medium">Movie: {movie?.title}</h2>

      <small>
        <em>
          {formatDate(movie?.release_date ?? "")} | {movie?.runtime} minutes |
          Rated {movie?.mpaa_rating}
        </em>
      </small>

      <br />

      <div className="mt-2 flex gap-1">
        {movie?.genres &&
          movie.genres.map((genre) => (
            <Badge key={genre.id}>{genre.name}</Badge>
          ))}
      </div>

      <hr className="mt-2" />

      <div className="mt-2">
        {movie && movie.image.length > 0 ? (
          <img
            src={`https://image.tmdb.org/t/p/w200/${movie?.image}`}
            alt={movie?.title}
          />
        ) : (
          <img
            src={`https://via.placeholder.com/200x300?text=No+Image`}
            alt={movie?.title}
          />
        )}
      </div>

      <p>{movie?.description}</p>
    </>
  );
};

export default Movie;
