import { FormEvent, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { Genre, Movie } from "@/types/movie";
import { OutletContext } from "@/types/outlet-context";
import { cn } from "@/lib/utils";
import ErrorPage from "./error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "./ui";

type ErrorType =
  | "title"
  | "release_date"
  | "runtime"
  | "mpaa_rating"
  | "description"
  | "genres";

const fetchGenres = async () => {
  try {
    const response = await fetch("/api/genres");
    const data: Genre[] = await response.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

const EditMovie = () => {
  const navigate = useNavigate();
  const { jwtToken }: OutletContext = useOutletContext();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [movie, setMovie] = useState<Movie>({
    id: 0,
    title: "",
    description: "",
    release_date: "",
    mpaa_rating: "",
    image: "",
    runtime: "",
    genres: [],
    genre_ids: Array(13).fill(0),
  });

  const { id } = useParams();

  useEffect(() => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }

    if (id === undefined) {
      setMovie({
        id: 0,
        title: "",
        description: "",
        release_date: "",
        mpaa_rating: "",
        image: "",
        runtime: "",
        genres: [],
        genre_ids: Array(13).fill(0),
      });

      fetchGenres().then((data) => {
        const genres: Genre[] = [];
        data.forEach((g) => {
          genres.push({
            id: g.id,
            name: g.name,
            checked: false,
          });
        });

        setMovie((m) => ({
          ...m,
          genres: genres,
          genre_ids: [],
        }));
      });
    } else {
      (async () => {
        try {
          const response = await fetch(`/api/admin/movies/${id}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Invalid response code" + response.status);
          }

          const data: { movie: Movie; genres: Genre[] } = await response.json();

          const genres: Genre[] = [];
          data.genres?.forEach((g) => {
            genres.push({
              id: g.id,
              name: g.name,
              checked:
                data.movie.genre_ids?.indexOf(g.id) !== -1 ? true : false,
            });
          });

          setMovie({
            ...data.movie,
            release_date: new Date(data.movie.release_date)
              .toISOString()
              .split("T")[0],
            genres: genres,
          });
        } catch (error) {
          setError((error as Error).message);
        }
      })();
    }
  }, [id, jwtToken, navigate]);

  const handleChange = (event: FormEvent | string) => {
    if (typeof event === "string") {
      setMovie({
        ...movie,
        mpaa_rating: event,
      });
      return;
    }

    const { name, value } = event.target as HTMLInputElement;

    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors: ErrorType[] = [];

    const validate = (key: ErrorType) => {
      if (movie[key] === "") {
        errors.push(key);
      }
    };

    validate("title");
    validate("release_date");
    validate("runtime");
    validate("mpaa_rating");
    validate("description");

    if (movie.genre_ids?.length === 0) {
      errors.push("genres");
    }

    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch(`/api/admin/movies/${movie.id}`, {
        method: movie.id === 0 ? "PUT" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
          credentials: "include",
        },
        body: JSON.stringify({
          ...movie,
          release_date: new Date(movie.release_date),
          runtime: parseInt(movie.runtime),
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
      } else {
        navigate("/manage-catalogue");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hasError = (key: ErrorType) => {
    return errors.indexOf(key) !== -1;
  };

  const mpaaRatingOptions = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
    { id: "18A", value: "18A" },
  ];

  const handleCheck = (e: boolean, i: number) => {
    const tempGenres = movie.genres ?? [];
    const tempGenre_ids = movie.genre_ids ?? [];

    tempGenres[i].checked = !tempGenres[i].checked;

    if (!e) {
      tempGenre_ids.splice(tempGenre_ids.indexOf(i));
    } else {
      tempGenre_ids.push(i);
    }

    setMovie({
      ...movie,
      genre_ids: tempGenre_ids,
    });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/movies/${movie.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
      } else {
        navigate("/manage-catalogue");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error !== null) {
    return <ErrorPage errorMessage={error} />;
  }

  return (
    <>
      <h2 className="text-3xl font-medium">Edit Movie</h2>

      <hr className="mt-2" />

      {/* <pre>{JSON.stringify(movie, null, 2)}</pre> */}

      <form onSubmit={handleSubmit} className="my-4">
        <input type="hidden" name="id" value={movie.id} />

        <Label>
          Title
          <Input
            title="Title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            className={cn("mt-1", hasError("title") && "border-red-500")}
          />
        </Label>

        {hasError("title") && (
          <span className="mt-1 block text-sm text-red-500">
            Title is required
          </span>
        )}

        <Label>
          Release Date
          <Input
            title="Release Date"
            name="release_date"
            type="date"
            value={movie.release_date}
            onChange={handleChange}
            className={cn("mt-1", hasError("release_date") && "border-red-500")}
          />
        </Label>

        {hasError("release_date") && (
          <span className="mt-1 block text-sm text-red-500">
            Release Date is required
          </span>
        )}

        <Label>
          Runtime
          <Input
            title="Runtime"
            name="runtime"
            value={movie.runtime}
            onChange={handleChange}
            className={cn("mt-1", hasError("runtime") && "border-red-500")}
          />
        </Label>

        {hasError("runtime") && (
          <span className="mt-1 block text-sm text-red-500">
            Runtime is required
          </span>
        )}

        <Label>
          MPAA Rating
          <Select value={movie.mpaa_rating} onValueChange={handleChange}>
            <SelectTrigger
              className={cn(hasError("mpaa_rating") && "border-red-500")}
            >
              <SelectValue placeholder="Select a MPAA Rating" />
            </SelectTrigger>

            <SelectContent className="z-50">
              <SelectGroup>
                {mpaaRatingOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>

        {hasError("mpaa_rating") && (
          <span className="mt-1 block text-sm text-red-500">
            MPAA Rating is required
          </span>
        )}

        <Label>
          Description
          <Textarea
            title="Description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            className={cn("mt-1", hasError("description") && "border-red-500")}
          />
        </Label>

        {hasError("description") && (
          <span className="mt-1 block text-sm text-red-500">
            Description is required
          </span>
        )}

        <h3 className="my-4 text-2xl font-medium">Genres</h3>

        {movie.genres && movie.genres.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g, i) => (
              <Badge
                key={i}
                className="space-x-1 border-zinc-300 bg-white py-1.5 text-black hover:bg-gray-300"
              >
                <Checkbox
                  checked={g.checked}
                  onCheckedChange={(e: boolean) => handleCheck(e, i)}
                  className="rounded border-gray-500 bg-transparent"
                />

                <span>{g.name}</span>
              </Badge>
            ))}
          </div>
        )}

        {hasError("genres") && (
          <span className="mt-1 block text-sm text-red-500">
            You must select at least one genre
          </span>
        )}

        <hr className="my-4" />

        {/* save button */}
        <div className="mt-4">
          <button
            type="submit"
            className="rounded-3xl bg-green-500 px-5 py-2 font-semibold text-white hover:bg-green-600"
          >
            Save
          </button>

          {/* delete button */}
          {movie.id > 0 && (
            <AlertDialog>
              <AlertDialogTrigger className="ml-4 rounded-3xl bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600">
                Delete
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500" />
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the movie from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-blue-500 hover:bg-blue-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Yes, delete it!
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </form>
    </>
  );
};

export default EditMovie;
