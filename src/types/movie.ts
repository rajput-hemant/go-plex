export type Movie = {
  id: number;
  title: string;
  description: string;
  release_date: string;
  mpaa_rating: string;
  runtime: string;
  image: string;
  genres?: Genre[];
  genre_ids?: number[];
};

export type Genre = {
  id: number;
  name: string;
  checked: boolean;
};
