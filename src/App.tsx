import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Go Watch a Movie!</h1>

        <Link to="/login">
          <span className="rounded-md bg-green-400 px-4 py-2 font-semibold text-white hover:bg-green-500">
            Login
          </span>
        </Link>
      </div>

      <hr className="mb-3" />

      <div className="flex">
        <div className="w-1/4">
          <nav className="flex flex-col rounded-md border-2 font-medium  ">
            <Link to="/" className="border-b px-4 py-2 hover:bg-gray-100">
              Home
            </Link>

            <Link to="/movies" className="border-b px-4 py-2 hover:bg-gray-100">
              Movies
            </Link>

            <Link to="/genres" className="border-b px-4 py-2 hover:bg-gray-100">
              Genres
            </Link>

            <Link
              to="/admin/movie/0"
              className="border-b px-4 py-2 hover:bg-gray-100"
            >
              Add Movie
            </Link>

            <Link
              to="/manage-catalogue"
              className="border-b px-4 py-2 hover:bg-gray-100"
            >
              Manage Catalogue
            </Link>

            <Link to="/graphql" className="px-4 py-2 hover:bg-gray-100">
              GraphQL
            </Link>
          </nav>
        </div>

        <div className="w-3/4 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
