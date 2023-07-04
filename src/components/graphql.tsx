import { useEffect, useState } from "react";
import useSwr from "swr";

import { Movie } from "@/types/movie";
import ErrorPage from "@/components/error";
import MoviesTable from "./movies-table";
import { Input } from "./ui";

const getMovies = async () => {
  try {
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: /* graphql */ `
          {
            list {
              id
              title
              runtime
              release_date
              mpaa_rating
            }
          }`,
    });

    const data = await res.json();

    return data.data.list as Movie[];
  } catch (error) {
    console.log(error);
  }
};

const GraphQL = () => {
  const { data: movies, error } = useSwr("graphql", getMovies);

  const [filteredMovies, setFilteredMovies] = useState<Movie[] | undefined>(
    movies
  );

  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    if (query.length === 0) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies?.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredMovies(filtered);
    }
  };

  if (error) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <>
      <h2 className="text-3xl font-medium">GraphQL</h2>

      <hr className="mt-2" />

      <form>
        <Input
          title="Search"
          type="search"
          placeholder="Search Movies..."
          onChange={handleSearch}
          className="mt-4"
        />

        {filteredMovies ? (
          <MoviesTable movies={filteredMovies} />
        ) : (
          <p className="my-4 text-center text-2xl font-semibold">
            No Movies yet!
          </p>
        )}
      </form>
    </>
  );
};

export default GraphQL;
