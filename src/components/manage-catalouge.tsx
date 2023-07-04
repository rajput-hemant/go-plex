import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useSwr from "swr";

import { Movie } from "@/types/movie";
import { OutletContext } from "@/types/outlet-context";
import MoviesTable from "./movies-table";

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

      {movies && <MoviesTable movies={movies} />}
    </>
  );
};

export default ManageCatalouge;
