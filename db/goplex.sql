SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_table_access_method = heap;
--
-- Name: genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genres (
  id integer NOT NULL,
  genre character varying(255),
  created_at timestamp without time zone,
  updated_at timestamp without time zone
);
--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.genres
ALTER COLUMN id
ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.genres_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movies (
  id integer NOT NULL,
  title character varying(512),
  release_date date,
  runtime integer,
  mpaa_rating character varying(10),
  description text,
  image character varying(255),
  created_at timestamp without time zone,
  updated_at timestamp without time zone
);
--
-- Name: movies_genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movies_genres (
  id integer NOT NULL,
  movie_id integer,
  genre_id integer
);
--
-- Name: movies_genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.movies_genres
ALTER COLUMN id
ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movies_genres_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.movies
ALTER COLUMN id
ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movies_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
  id integer NOT NULL,
  first_name character varying(255),
  last_name character varying(255),
  email character varying(255),
  password character varying(255),
  created_at timestamp without time zone,
  updated_at timestamp without time zone
);
--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users
ALTER COLUMN id
ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.genres (genre, created_at, updated_at)
VALUES (
    'Comedy',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Sci-Fi',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Horror',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Romance',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Action',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Thriller',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Drama',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Mystery',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Crime',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Animation',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Adventure',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Fantasy',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Superhero',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  );
--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.movies (
    title,
    release_date,
    runtime,
    mpaa_rating,
    description,
    image,
    created_at,
    updated_at
  )
VALUES (
    'Highlander',
    '1986-03-07',
    116,
    'R',
    'He fought his first battle on the Scottish Highlands in 1536. He will fight his greatest battle on the streets of New York City in 1986. His name is Connor MacLeod. He is immortal.',
    '/8Z8dptJEypuLoOQro1WugD855YE.jpg',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'Raiders of the Lost Ark',
    '1981-06-12',
    115,
    'PG-13',
    'Archaeology professor Indiana Jones ventures to seize a biblical artefact known as the Ark of the Covenant. While doing so, he puts up a fight against Renee and a troop of Nazis.',
    '/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  ),
  (
    'The Godfather',
    '1972-03-24',
    175,
    '18A',
    'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
    '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  );
--
-- Data for Name: movies_genres; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.movies_genres (movie_id, genre_id)
VALUES (1, 5),
  (1, 12),
  (2, 1),
  (2, 11),
  (3, 2),
  (3, 5),
  (4, 2),
  (4, 11),
  (5, 3),
  (5, 9),
  (6, 3),
  (6, 7);
--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (
    first_name,
    last_name,
    email,
    password,
    created_at,
    updated_at
  )
VALUES (
    'Admin',
    'User',
    'admin@example.com',
    '$2a$12$1XixfB4rG4RyPZNbU0opWu0wvD9vk0DJmLuKH0bMY0T.fQeYXbjYW',
    '2022-09-23 00:00:00',
    '2022-09-23 00:00:00'
  );
--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.genres_id_seq', 13, true);
--
-- Name: movies_genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movies_genres_id_seq', 6, true);
--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movies_id_seq', 3, true);
--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);
--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genres
ADD CONSTRAINT genres_pkey PRIMARY KEY (id);
--
-- Name: movies_genres movies_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies_genres
ADD CONSTRAINT movies_genres_pkey PRIMARY KEY (id);
--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies
ADD CONSTRAINT movies_pkey PRIMARY KEY (id);
--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id);
--
-- Name: movies_genres movies_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies_genres
ADD CONSTRAINT movies_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON UPDATE CASCADE ON DELETE CASCADE;
--
-- Name: movies_genres movies_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies_genres
ADD CONSTRAINT movies_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE CASCADE;