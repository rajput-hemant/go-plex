export type Movie = {
  id: number;
  title: string;
  description: string;
  release_date: string;
  mpaa_rating: string;
  runtime: number;
  image: string;
  genres?: Genre[];
  genreIds?: number[];
};

export type Genre = {
  id: number;
  name: string;
  checked: boolean;
};
