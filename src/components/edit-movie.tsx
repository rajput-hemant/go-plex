import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { OutletContext } from "@/types/outlet-context";
import {
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

type Error =
  | "title"
  | "release_date"
  | "runtime"
  | "mpaa_rating"
  | "description";

const EditMovie = () => {
  const navigate = useNavigate();
  const { jwtToken }: OutletContext = useOutletContext();

  const [error, setError] = useState(null);
  const [errors, setErrors] = useState<Error[]>([]);
  const [movie, setMovie] = useState({
    id: 0,
    title: "",
    description: "",
    release_date: "",
    mpaa_rating: "",
    runtime: "",
  });

  const { id } = useParams();

  useEffect(() => {
    if (!jwtToken) {
      navigate("/login");
      return;
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
  };

  const hasError = (key: Error) => {
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

  return (
    <>
      <h2 className="text-3xl font-medium">Edit Movie</h2>

      <hr className="mt-2" />

      <pre>{JSON.stringify(movie, null, 2)}</pre>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={movie.id} />

        <Label>
          Title
          <Input
            title="Title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            className="mt-1"
          />
          {hasError("title") && (
            <span className="text-red-500">Title is required</span>
          )}
        </Label>

        <Label>
          Release Date
          <Input
            title="Release Date"
            name="release_date"
            type="date"
            value={movie.release_date}
            onChange={handleChange}
            className="mt-1"
          />
          {hasError("release_date") && (
            <span className="text-red-500">Release Date is required</span>
          )}
        </Label>

        <Label>
          Runtime
          <Input
            title="Runtime"
            name="runtime"
            value={movie.runtime}
            onChange={handleChange}
            className="mt-1"
          />
          {hasError("runtime") && (
            <span className="text-red-500">Runtime is required</span>
          )}
        </Label>

        <Label>
          MPAA Rating
          <Select onValueChange={handleChange}>
            <SelectTrigger>
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
          {hasError("mpaa_rating") && (
            <span className="text-red-500">MPAA Rating is required</span>
          )}
        </Label>

        <Label>
          Description
          <Textarea
            title="Description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            className="mt-1"
          />
          {hasError("description") && (
            <span className="text-red-500">Description is required</span>
          )}
        </Label>
      </form>
    </>
  );
};

export default EditMovie;
