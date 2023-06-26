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

const getMovies = async () => {
  const response = await fetch("/api/movies");
  const data: Movie[] = await response.json();

  return data;
};

const Movies = () => {
  const { data: movies } = useSwr("/movies", getMovies);

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
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
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
