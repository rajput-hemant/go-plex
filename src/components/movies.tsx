import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useSwr from "swr";

import { Movie } from "@/types/movie";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import ErrorPage from "./error";

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Movie</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {movies?.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>
                <Link
                  to={`/movies/${movie.id}`}
                  className="flex items-center underline-offset-2 hover:underline"
                >
                  {movie.title}
                  <LinkIcon className="ml-1 h-3 w-3 text-zinc-700" />
                </Link>
              </TableCell>
              <TableCell>{formatDate(movie.release_date)}</TableCell>
              <TableCell>{movie.mpaa_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Movies;
