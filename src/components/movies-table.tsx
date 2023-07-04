import { LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

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

type MoviesTableProps = {
  movies: Movie[];
};

const MoviesTable = ({ movies }: MoviesTableProps) => {
  return (
    <Table className="my-4 rounded-md border">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-white">Movie</TableHead>
          <TableHead className="bg-white">Release Date</TableHead>
          <TableHead className="bg-white">Rating</TableHead>
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
  );
};

export default MoviesTable;
