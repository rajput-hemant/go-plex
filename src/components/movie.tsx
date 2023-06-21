import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Movie } from "@/types/movie";

const Movie = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const movie = {
      id: 1,
      title: "The Shawshank Redemption",
      release_date: "1994-09-14",
      runtime: 144,
      mpaa_rating: "R",
      description: "Some long description",
    };

    setMovie(movie);
  }, [id]);

  return (
    <>
      <h2 className="text-3xl font-medium">Movie: {movie?.title}</h2>
      <small>
        <em>
          {movie?.release_date}, {movie?.runtime} minutes, Rated{" "}
          {movie?.mpaa_rating}
        </em>
      </small>

      <hr className="mt-2" />

      <p>{movie?.description}</p>
    </>
  );
};

export default Movie;
