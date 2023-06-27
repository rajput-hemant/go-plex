import { FormEvent, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { OutletContext } from "@/types/outlet-context";
import { Input, Label } from "./ui";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setJwtToken, setAlert, toggleRefresh }: OutletContext =
    useOutletContext();

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) {
        setAlert({
          title: "Invalid Credentials",
          variant: "destructive",
          description: data.message,
        });
      } else {
        setJwtToken(data.access_token);
        setAlert(null);
        toggleRefresh(true);
        navigate("/");
      }
    } catch (error) {
      setAlert({
        title: "Error",
        variant: "destructive",
        description: (error as { message: string }).message,
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-medium">Login</h2>

      <hr className="mt-2" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-4 flex max-w-[40rem] flex-col gap-2"
      >
        <Label htmlFor="email" className="text-slate-600">
          Email
        </Label>
        <Input
          title="Email Address"
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label htmlFor="password" className="text-slate-600">
          Password
        </Label>
        <Input
          title="Password"
          name="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-10 w-full rounded-md bg-blue-500 font-semibold text-white transition-colors duration-300 hover:bg-blue-600 active:scale-[101%]"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
