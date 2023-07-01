import "@/styles/index.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import {
  EditMovie,
  Error,
  Genres,
  GraphQL,
  Home,
  Login,
  ManageCatalouge,
  Movie,
  Movies,
} from "./components";
import { Center, Loader } from "./components/ui";

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
