import { Link } from "react-router-dom";
import useSwr from "swr";

import { Genre } from "@/types/movie";
import ErrorPage from "./error";

const getGenres = async () => {
  try {
    const response = await fetch("/api/genres");
    const data: Genre[] = await response.json();

    return data.sort((a, b) => a.id - b.id);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const Genres = () => {
  const { data: genres, error } = useSwr("/api/genres", getGenres);

  if (error) {
    return <ErrorPage errorMessage={error.message} />;
  }

  return (
    <>
      <h2 className="text-3xl font-medium">Genres</h2>

      <hr className="mb-4 mt-2" />

      <div className="flex flex-col rounded-md border font-medium">
        {genres?.map((g) => (
          <Link
            key={g.id}
            to={`/genres/${g.id}`}
            state={{ genreName: g.name }}
            className="border-b px-4 py-2 last:border-none odd:border-r hover:bg-gray-100"
          >
            {g.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Genres;
