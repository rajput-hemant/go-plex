import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Movie } from "@/types/movie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const movieList = [
      {
        id: 1,
        title: "The Shawshank Redemption",
        release_date: "1994-09-14",
        runtime: 144,
        mpaa_rating: "R",
        description: "Some long description",
      },
      {
        id: 2,
        title: "The Godfather",
        release_date: "1972-03-14",
        runtime: 144,
        mpaa_rating: "R",
        description: "Some long description",
      },
    ];

    setMovies(movieList);
  }, []);

  return (
    <div className="">
      <h2 className="text-3xl font-medium">Movies</h2>

      <hr className="mt-2" />

      <Table>
        <TableHeader>
          <TableHead>Movie</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Rating</TableHead>
        </TableHeader>

        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <Link to={`/movies/${movie.id}`}>
                <TableCell>{movie.title}</TableCell>
              </Link>
              <TableCell>{movie.release_date}</TableCell>
              <TableCell>{movie.mpaa_rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Movies;
