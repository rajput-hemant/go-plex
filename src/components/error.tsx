import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { cn } from "@/lib/utils";

export default function Error({ errorMessage }: { errorMessage?: string }) {
  const error = useRouteError();

  if (!errorMessage)
    if (isRouteErrorResponse(error)) {
      // error is type `ErrorResponse`
      errorMessage = error.error?.message || error.statusText;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      console.error(error);
      errorMessage = "Unknown error";
    }

  return (
    <div
      className={cn(
        "flex h-screen items-center justify-center",
        errorMessage && "h-full w-full"
      )}
    >
      <div className="min-w-[25rem] rounded-md border p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-medium text-red-500">Opps!</h1>

        <p className="mb-4 text-gray-700">
          Sorry, an unexpected error has occured!
        </p>

        <p className="text-gray-700">
          <em>{errorMessage}</em>
        </p>
      </div>
    </div>
  );
}
