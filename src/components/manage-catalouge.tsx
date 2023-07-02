import { useEffect } from "react";
import { LinkIcon } from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import useSwr from "swr";

import { Movie } from "@/types/movie";
import { OutletContext } from "@/types/outlet-context";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

const getMovies = async (token: string) => {
  const response = await fetch("/api/admin/movies", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: Movie[] = await response.json();

  return data;
};

const ManageCatalouge = () => {
  const navigate = useNavigate();
  const { jwtToken }: OutletContext = useOutletContext();
  const { data: movies, mutate } = useSwr("/movies", () => {
    return getMovies(jwtToken ?? "");
  });

  useEffect(() => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }

    mutate();
  }, [jwtToken, navigate, mutate]);

  return (
    <>
      <h2 className="text-3xl font-medium">Manage Catalouge</h2>

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
                  to={`/admin/movie/${movie.id}`}
                  className="flex items-center underline-offset-2 hover:underline"
                >
                  {movie.title}
                  <LinkIcon className="ml-1 h-3 w-3 text-zinc-700" />
                </Link>{" "}
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

export default ManageCatalouge;
