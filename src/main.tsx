/* eslint-disable react-refresh/only-export-components */

import "@/styles/index.css";

import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import { Center, Loader } from "./components/ui";

const EditMovie = lazy(() => import("./components/edit-movie.tsx"));
const Error = lazy(() => import("./components/error.tsx"));
const Genre = lazy(() => import("./components/genre.tsx"));
const Genres = lazy(() => import("./components/genres.tsx"));
const GraphQL = lazy(() => import("./components/graphql.tsx"));
const Home = lazy(() => import("./components/home.tsx"));
const Login = lazy(() => import("./components/login.tsx"));
const ManageCatalouge = lazy(() => import("./components/manage-catalouge.tsx"));
const Movie = lazy(() => import("./components/movie.tsx"));
const Movies = lazy(() => import("./components/movies.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/movies/:id",
        element: <Movie />,
      },
      {
        path: "/genres",
        element: <Genres />,
      },
      {
        path: "/genres/:id",
        element: <Genre />,
      },
      {
        path: "/admin/movie/0",
        element: <EditMovie />,
      },
      {
        path: "/admin/movie/:id",
        element: <EditMovie />,
      },
      {
        path: "/manage-catalogue",
        element: <ManageCatalouge />,
      },
      {
        path: "/graphql",
        element: <GraphQL />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <Center absolutely>
          <Loader iconSize={50} />
        </Center>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
