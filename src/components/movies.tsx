import useSwr from "swr";

import { Movie } from "@/types/movie";
import ErrorPage from "./error";
import MoviesTable from "./movies-table";

const getMovies = async () => {
  try {
    const response = await fetch("/api/movies");
    const data: Movie[] = await response.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const Movies = () => {
  const { data: movies, error } = useSwr("/movies", getMovies);

  if (error) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <>
      <h2 className="text-3xl font-medium">Movies</h2>

      <hr className="mt-2" />

      {movies && <MoviesTable movies={movies} />}
    </>
  );
};

export default Movies;
