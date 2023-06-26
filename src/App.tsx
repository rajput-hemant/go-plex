import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "./components/ui";
import { cn } from "./lib/utils";
import type { Alert as AlertType } from "./types/outlet-context";

function App() {
  const navigate = useNavigate();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertType | null>(null);

  const [tickInterval, setTickInterval] = useState<NodeJS.Timer | null>(null);

  const LoginLogoutEl = jwtToken ? "button" : Link;

  const logout = () => {
    try {
      fetch("/api/logout", { credentials: "include" });
    } catch (error) {
      console.error("Error logging out!", error);
    }

    setJwtToken(null);
    toggleRefresh(false);
    navigate("/login");
  };

  const refresh = async () => {
    try {
      const response = await fetch("/api/refresh", {
        credentials: "include",
      });

      const data = await response.json();

      if (data?.access_token) {
        setJwtToken(data.access_token);
      }
    } catch (error) {
      // console.error("User is not logged in!", error);
      // ...
    }
  };

  const toggleRefresh = useCallback(
    (status: boolean) => {
      console.log("clicked");

      if (status) {
        console.log("turning on ticking");

        const i = setInterval(() => {
          refresh();
        }, 600000); // 10 minutes

        setTickInterval(i);
        console.log("setting tick interval to: ", i);
      } else {
        console.log("turning off ticking");
        console.log("turning off tick interval: ", tickInterval);

        setTickInterval(null);
        if (tickInterval) {
          clearInterval(tickInterval);
        }
      }
    },

    [tickInterval]
  );

  useEffect(() => {
    if (!jwtToken) {
      refresh();
    }
  }, [jwtToken, toggleRefresh]);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Go Watch a Movie!</h1>

        <LoginLogoutEl to={jwtToken ? "#!" : "/login"} onClick={logout}>
          <span
            className={cn(
              "rounded-3xl bg-green-500 px-5 py-2 font-semibold text-white hover:bg-green-600",
              jwtToken && "bg-red-500 hover:bg-red-600"
            )}
          >
            {jwtToken ? "Logout" : "Login"}
          </span>
        </LoginLogoutEl>
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

            <Link
              to="/genres"
              className={cn(
                "px-4 py-2 hover:bg-gray-100",
                jwtToken && "border-b"
              )}
            >
              Genres
            </Link>

            {jwtToken && (
              <>
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
              </>
            )}
          </nav>
        </div>

        <div className="w-3/4 px-4">
          {alert && (
            <Alert variant={alert?.variant} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert?.title}</AlertTitle>
              <AlertDescription>{alert?.description} </AlertDescription>
            </Alert>
          )}

          <Outlet
            context={{ jwtToken, setJwtToken, setAlert, toggleRefresh }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
